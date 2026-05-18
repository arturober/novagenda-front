import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';

import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { routes } from './app.routes';
import { provideGoogleId } from './auth/google-login/google-login.config';
import { authInterceptor } from './shared/interceptors/auth-interceptor';
import { baseUrlInterceptor } from './shared/interceptors/base-url-interceptor';
import { IconService } from './shared/services/icon-service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding(), withRouterConfig({paramsInheritanceStrategy: 'always'})),
    provideClientHydration(withEventReplay()),
    provideAppInitializer(() => {
      const iconService = inject(IconService);
      iconService.registerIcons();
    }),
    provideHttpClient(withFetch(), withInterceptors([baseUrlInterceptor, authInterceptor])),
    provideGoogleId('940474514077-20namm6ra4h93elaaun08nvarq07i3hh.apps.googleusercontent.com'),
  ],
};
