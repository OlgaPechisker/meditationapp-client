import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Serve static files from /browser with long-term caching.
 */
app.get(
  '**',
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
  }),
);

/**
 * Handle all other requests via Angular's per-route render modes
 * (SSR, Prerender, or Client — defined in app.routes.server.ts).
 */
app.get('**', createNodeRequestHandler(async (req, res, next) => {
  const response = await angularApp.handle(req);
  if (response) {
    await writeResponseToNodeResponse(response, res);
  } else {
    next();
  }
}));

/**
 * Start the server if this module is the main entry point.
 * Listens on the PORT env var, defaulting to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export default app;
