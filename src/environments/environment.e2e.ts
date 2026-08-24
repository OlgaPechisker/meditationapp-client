// Used by the cross-repo CI e2e job (see meditationapp/.github/workflows/ci.yml).
// Production-like build settings, but pointed at the local backend the CI
// job starts, instead of the hardcoded production API in environment.prod.ts.
export const environment = {
  production: true,
  apiUrl: 'http://localhost:3000/api',
};
