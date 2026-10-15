import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AssistantHttpService {
  private readonly http = inject(HttpClient);

  post<TResponse, TBody extends object = object>(
    path: string,
    body: TBody,
    params?: Record<string, string | number>,
  ): Observable<TResponse> {
    return this.http.post<TResponse>(this.endpoint(path), body, this.options(params));
  }

  private options(
    params?: Record<string, string | number>,
  ): { params: Record<string, string | number> } | undefined {
    if (!params) {
      return undefined;
    }

    return { params };
  }

  private endpoint(path: string): string {
    const base = environment.apiMicroserviceIA.replace(/\/$/, '');
    return `${base}${path}`;
  }
}
