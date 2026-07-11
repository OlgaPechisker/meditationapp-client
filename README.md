# Einat Shomonov Website — Frontend

Angular frontend for the Einat Shomonov meditation, healing & wellness practitioner website.

> **Backend (API):** [Einat server](https://github.com/OlgaPechisker/meditationapp)

## Tech Stack

- **Framework:** Angular 21 with SSR (Server-Side Rendering)
- **Language:** TypeScript
- **i18n:** Transloco (Hebrew default, English ready)
- **Styling:** Component styles

## Quick Start

### Prerequisites
- Node.js 24.15+ with npm 11.6.2
- The [backend server](https://github.com/OlgaPechisker/meditationapp) running on `http://localhost:3000`

The repository pins these versions in `.nvmrc`, `engines`, and `packageManager`. Use `npm ci` for reproducible installs.

### Install & run
```bash
npm install
npx ng serve
# App available at http://localhost:4200
```

## Environment / API URL

The app connects to the backend API. To point it at a different server, set the `API_URL` environment variable (or update `src/environments/`) before building.

## Building for Production

```bash
ng build
```

Build artifacts are output to `dist/`. The production build enables SSR and optimises for performance.

To run the SSR build locally:
```bash
node dist/client/server/server.mjs
```

## CI and dependency policy

GitHub Actions builds and tests the SSR application, verifies SSR startup, and runs `npm audit --omit=dev --audit-level=high` on every pull request. Production critical and high audit findings block CI; development-only findings are reviewed separately.

## i18n

Default locale is **Hebrew** (`he`). English (`en`) translations are wired in but may be incomplete. Translation files live in `src/assets/i18n/`.

## Admin

The admin panel is served by the frontend at `/admin/login`. It authenticates against the backend API (JWT). See the [server repo](https://github.com/OlgaPechisker/meditationapp) for admin setup.
