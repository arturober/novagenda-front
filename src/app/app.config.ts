import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { IconService } from './shared/services/icon-service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideGoogleId } from './auth/google-login/google-login.config';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    provideAppInitializer(() => {
      const iconService = inject(IconService);
      iconService.registerIcons();
    }),
    provideHttpClient(withFetch()),
    provideGoogleId('940474514077-20namm6ra4h93elaaun08nvarq07i3hh.apps.googleusercontent.com'),
  ]
};
