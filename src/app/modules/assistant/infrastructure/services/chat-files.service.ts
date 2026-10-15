import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ASSISTANT_API_PATH } from '../constants/assistant-api.paths';
import { ChatFilesRequest, ChatFilesResponse } from '../domain/interfaces/chat-files.interface';
import { AssistantHttpService } from './assistant-http.service';

@Injectable({ providedIn: 'root' })
export class ChatFilesService {
  private readonly http = inject(AssistantHttpService);

  list(request: ChatFilesRequest): Observable<ChatFilesResponse> {
    return this.http.post<ChatFilesResponse>(ASSISTANT_API_PATH.chatFiles, request);
  }
}
