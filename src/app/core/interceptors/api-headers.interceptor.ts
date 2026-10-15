import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '@environments/environment';

const JSON_CONTENT_TYPE = 'application/json';

const userEmail = (body: unknown): string | null => {
  if (typeof body !== 'object' || body === null || !('email' in body)) {
    return null;
  }

  const email = body['email'];
  return typeof email === 'string' && email.length > 0 ? email : null;
};

const isAssistantApi = (url: string): boolean => {
  const base = environment.apiMicroserviceIA.replace(/\/$/, '');
  return base.length > 0 && url.startsWith(base);
};

export const apiHeadersInterceptor: HttpInterceptorFn = (request, next) => {
  if (!isAssistantApi(request.url)) {
    return next(request);
  }

  let headers = request.headers.set('Content-Type', JSON_CONTENT_TYPE);

  if (environment.apiKey.length > 0) {
    headers = headers.set('X-API-Key', environment.apiKey);
  }

  const email = userEmail(request.body);
  if (email) {
    headers = headers.set('X-User-Email', email);
  }

  return next(request.clone({ headers }));
};
