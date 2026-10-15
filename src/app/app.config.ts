import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { apiHeadersInterceptor } from '@core/interceptors/api-headers.interceptor';
import { ZoomSdkService } from '@shared/services/zoom/zoom-sdk.service';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([apiHeadersInterceptor])),
    provideAppInitializer(() => inject(ZoomSdkService).connect()),
  ],
};
