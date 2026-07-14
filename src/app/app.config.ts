import { ApplicationConfig, provideZoneChangeDetection, isDevMode, Injectable, inject } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch, HttpClient } from '@angular/common/http';
import { provideClientHydration, withEventReplay, withNoIncrementalHydration } from '@angular/platform-browser';
import { provideTransloco, TranslocoLoader, Translation } from '@jsverse/transloco';
import { provideQuillConfig } from 'ngx-quill';
import { registerLocaleData } from '@angular/common';
import localeHe from '@angular/common/locales/he';

import { routes } from './app.routes';

registerLocaleData(localeHe);
import { localeInterceptor } from './core/interceptors/locale.interceptor';
import { authInterceptor } from './core/interceptors/auth.interceptor';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private http = inject(HttpClient);
  getTranslation(lang: string) {
    return this.http.get<Translation>(`/assets/i18n/${lang}.json`);
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withViewTransitions()),
    provideClientHydration(withEventReplay(), withNoIncrementalHydration()),
    provideHttpClient(withFetch(), withInterceptors([localeInterceptor, authInterceptor])),
    provideQuillConfig({
      format: 'html',
      defaultEmptyValue: '',
      customOptions: [
        { import: 'attributors/class/align', whitelist: ['right', 'center', 'left'] },
        { import: 'attributors/class/direction', whitelist: ['rtl', 'ltr'] },
        { import: 'formats/header', whitelist: [2, 3, false] },
      ],
      modules: {
        keyboard: {
          bindings: {
            tab: { key: 9, handler: () => true },
          },
        },
        history: { delay: 500, maxStack: 100, userOnly: true },
      },
      beforeRender: () => import('quill'),
    }),
    provideTransloco({
      config: {
        availableLangs: ['he', 'en'],
        defaultLang: 'he',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
  ],
};
