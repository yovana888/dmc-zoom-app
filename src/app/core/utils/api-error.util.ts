import { HttpErrorResponse } from '@angular/common/http';

const backendDetail = (body: unknown): string => {
  if (typeof body !== 'object' || body === null || !('detail' in body)) {
    return '';
  }

  const detail = body['detail'];
  return typeof detail === 'string' ? detail : '';
};

export const apiErrorMessage = (error: unknown, fallback: string): string => {
  if (!(error instanceof HttpErrorResponse)) {
    return fallback;
  }

  const detail = backendDetail(error.error);
  return detail.length > 0 ? `${fallback} ${detail}` : `${fallback} (HTTP ${error.status})`;
};
