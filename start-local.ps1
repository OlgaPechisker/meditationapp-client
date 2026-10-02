$ErrorActionPreference = 'Stop'

$clientDir = $PSScriptRoot
$serverDir = Join-Path (Split-Path $clientDir -Parent) 'Einat'
$composeFile = Join-Path $serverDir 'docker-compose.yml'
$serverEnv = Join-Path $serverDir 'server\.env'
$nodeVersion = '24.15.0'
$npmVersion = '11.6.2'
$backend = $null
$frontend = $null

function Assert-PortAvailable([int]$port) {
  if (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue) {
    throw "Port $port is already in use. Stop the existing service before running this script."
  }
}

function Stop-StartedProcess([System.Diagnostics.Process]$process) {
  if ($null -eq $process) { return }

  $descendants = @()
  $parents = @($process.Id)
  while ($parents.Count -gt 0) {
    $children = @(Get-CimInstance Win32_Process -ErrorAction SilentlyContinue |
      Where-Object { $_.ParentProcessId -in $parents } |
      Select-Object -ExpandProperty ProcessId)
    $descendants = @($children) + $descendants
    $parents = $children
  }

  foreach ($id in (@($descendants) + @($process.Id))) {
    Stop-Process -Id $id -ErrorAction SilentlyContinue
  }
}

function Wait-ForUrl([string]$url, [string]$name, [System.Diagnostics.Process]$process) {
  for ($attempt = 0; $attempt -lt 60; $attempt++) {
    if ($process.HasExited) {
      throw "$name exited before becoming ready (exit code $($process.ExitCode))."
    }
    try {
      $response = Invoke-WebRequest -Uri $url -TimeoutSec 2 -UseBasicParsing
      if ($response.StatusCode -eq 200) { return }
    } catch {
      # A service may refuse connections while starting; retry until the deadline.
    }
    Start-Sleep -Seconds 1
  }
  throw "$name did not become ready at $url within 60 seconds. Check the output above."
}

try {
  if (-not (Test-Path $composeFile) -or -not (Test-Path $serverEnv)) {
    throw "Expected the sibling Einat backend and server\.env at $serverDir."
  }
  if (-not (Test-Path (Join-Path $clientDir 'node_modules')) -or
      -not (Test-Path (Join-Path $serverDir 'node_modules'))) {
    throw 'Dependencies are missing. Run npm ci in both the client and sibling Einat directories.'
  }

  $volta = (Get-Command volta -ErrorAction Stop).Source
  $null = Get-Command docker -ErrorAction Stop
  Assert-PortAvailable 3000
  Assert-PortAvailable 4200

  Write-Host 'Starting local PostgreSQL...'
  & docker compose -f $composeFile up -d db
  if ($LASTEXITCODE -ne 0) { throw 'Could not start the Docker database.' }

  $databaseReady = $false
  for ($attempt = 0; $attempt -lt 30; $attempt++) {
    & docker compose -f $composeFile exec -T db pg_isready -U einat -d einat_dev *> $null
    if ($LASTEXITCODE -eq 0) {
      $databaseReady = $true
      break
    }
    Start-Sleep -Seconds 1
  }
  if (-not $databaseReady) { throw 'The Docker database did not become ready within 30 seconds.' }

  Push-Location $serverDir
  try {
    Write-Host 'Applying pending database migrations...'
    & $volta run --node $nodeVersion --npm $npmVersion npm exec --workspace=server -- prisma migrate deploy
    if ($LASTEXITCODE -ne 0) { throw 'Database migrations failed.' }
  } finally {
    Pop-Location
  }

  Assert-PortAvailable 3000
  Assert-PortAvailable 4200
  Write-Host 'Starting backend on http://localhost:3000 ...'
  $backend = Start-Process -FilePath $volta -ArgumentList @(
    'run', '--node', $nodeVersion, '--npm', $npmVersion, 'npm', 'run', 'dev:server'
  ) -WorkingDirectory $serverDir -NoNewWindow -PassThru
  Wait-ForUrl 'http://localhost:3000/api/content/?locale=he' 'Backend' $backend

  Write-Host 'Starting frontend on http://localhost:4200 ...'
  $frontend = Start-Process -FilePath $volta -ArgumentList @(
    'run', '--node', $nodeVersion, '--npm', $npmVersion, 'npm', 'start'
  ) -WorkingDirectory $clientDir -NoNewWindow -PassThru
  Wait-ForUrl 'http://localhost:4200/' 'Frontend' $frontend

  Write-Host 'Both apps are ready. Press Ctrl+C to stop them (the database stays running).'
  while (-not $backend.HasExited -and -not $frontend.HasExited) {
    Start-Sleep -Seconds 1
  }
  throw 'One of the dev servers stopped unexpectedly. Check the output above.'
} finally {
  Stop-StartedProcess $frontend
  Stop-StartedProcess $backend
}
