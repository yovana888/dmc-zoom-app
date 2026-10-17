import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ASSISTANT_API_PATH } from '../constants/assistant-api.paths';
import { RagAskRequest, RagAskResponse } from '../domain/interfaces/rag.interface';
import { AssistantHttpService } from './assistant-http.service';

@Injectable({ providedIn: 'root' })
export class RagService {
  private readonly http = inject(AssistantHttpService);

  ask(request: RagAskRequest): Observable<RagAskResponse> {
    return this.http.post<RagAskResponse>(ASSISTANT_API_PATH.ragAsk, request);
  }
}
