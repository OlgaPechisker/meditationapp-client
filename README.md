# Einat Shomonov Website — Frontend

Angular frontend for the Einat Shomonov meditation, healing & wellness practitioner website.

> **Backend (API):** [Einat server](https://github.com/OlgaPechisker/meditationapp)

## Tech Stack

- **Framework:** Angular 22 with SSR (Server-Side Rendering)
- **Language:** TypeScript
- **i18n:** Transloco (Hebrew default, English ready)
- **Styling:** Component styles

## Quick Start

### Prerequisites
- Node.js 24.15.0–24.x with npm 11.6.2
- The [backend server](https://github.com/OlgaPechisker/meditationapp) running on `http://localhost:3000`

The repository declares these versions in `.nvmrc`, `engines`, and `packageManager`, but these files do not change an active Volta runtime. Use the commands below so Volta downloads and runs the required versions for this repository only, without changing global defaults.

### Install & run
```powershell
volta run --node 24.15.0 --npm 11.6.2 npm ci
volta run --node 24.15.0 --npm 11.6.2 npm start
# App available at http://localhost:4200
```

## Environment / API URL

The app connects to the backend API. To point it at a different server, set the `API_URL` environment variable (or update `src/environments/`) before building.

## Building for Production

```powershell
volta run --node 24.15.0 --npm 11.6.2 npm run build
```

Build artifacts are output to `dist/`. The production build enables SSR and optimises for performance.

To run the SSR build locally:
```powershell
volta run --node 24.15.0 node dist/client/server/server.mjs
```

The SSR server permits `localhost`, `127.0.0.1`, and Railway's `RAILWAY_PUBLIC_DOMAIN`.
For a custom production domain, set `NG_ALLOWED_HOSTS` to its comma-separated hostnames.

## CI and dependency policy

GitHub Actions builds and tests the SSR application, verifies SSR startup, and runs `npm audit --omit=dev --audit-level=high` on every pull request. Production critical and high audit findings block CI; development-only findings are reviewed separately.

## i18n

Default locale is **Hebrew** (`he`). English (`en`) translations are wired in but may be incomplete. Translation files live in `src/assets/i18n/`.

## Admin

The admin panel is served by the frontend at `/admin/login`. It authenticates against the backend API (JWT). See the [server repo](https://github.com/OlgaPechisker/meditationapp) for admin setup.
