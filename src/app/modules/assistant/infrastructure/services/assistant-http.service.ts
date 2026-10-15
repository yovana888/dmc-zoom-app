import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AssistantHttpService {
  private readonly http = inject(HttpClient);

  post<TResponse, TBody extends object = object>(path: string, body: TBody): Observable<TResponse> {
    return this.http.post<TResponse>(this.endpoint(path), body);
  }

  private endpoint(path: string): string {
    const base = environment.apiMicroserviceIA.replace(/\/$/, '');
    return `${base}${path}`;
  }
}
