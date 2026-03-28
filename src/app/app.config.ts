import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { IconService } from './shared/services/icon-service';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideGoogleId } from './auth/google-login/google-login.config';
import { baseUrlInterceptor } from './shared/interceptors/base-url-interceptor';
import { authInterceptor } from './shared/interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withViewTransitions()),
    provideClientHydration(withEventReplay()),
    provideAppInitializer(() => {
      const iconService = inject(IconService);
      iconService.registerIcons();
    }),
    provideHttpClient(withFetch(), withInterceptors([baseUrlInterceptor, authInterceptor])),
    provideGoogleId('940474514077-20namm6ra4h93elaaun08nvarq07i3hh.apps.googleusercontent.com'),
  ],
};
