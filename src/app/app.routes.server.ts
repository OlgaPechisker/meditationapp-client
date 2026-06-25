import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Truly static pages — prerendered once at build time
  { path: 'about',   renderMode: RenderMode.Prerender },
  { path: 'contact', renderMode: RenderMode.Prerender },

  // Admin area — user-specific, token-gated, never indexed
  { path: 'admin',    renderMode: RenderMode.Client },
  { path: 'admin/**', renderMode: RenderMode.Client },

  // All public content pages — SSR on each request
  { path: '**', renderMode: RenderMode.Server },
];
