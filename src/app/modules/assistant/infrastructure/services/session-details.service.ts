import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ASSISTANT_API_PATH } from '../constants/assistant-api.paths';
import {
  SessionDetailsRequest,
  SessionDetailsResponse,
} from '../domain/interfaces/session.interface';
import { AssistantHttpService } from './assistant-http.service';

@Injectable({ providedIn: 'root' })
export class SessionDetailsService {
  private readonly http = inject(AssistantHttpService);

  details(request: SessionDetailsRequest): Observable<SessionDetailsResponse> {
    return this.http.post<SessionDetailsResponse>(ASSISTANT_API_PATH.sessionDetails, request);
  }
}
