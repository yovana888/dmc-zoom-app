import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ASSISTANT_API_PATH } from '../constants/assistant-api.paths';
import { FinalKitResponse } from '../domain/interfaces/final-kit.interface';
import { SessionRequest } from '../domain/interfaces/session.interface';
import { AssistantHttpService } from './assistant-http.service';

@Injectable({ providedIn: 'root' })
export class FinalKitService {
  private readonly http = inject(AssistantHttpService);

  generate(request: SessionRequest, minuto: number): Observable<FinalKitResponse> {
    return this.http.post<FinalKitResponse>(ASSISTANT_API_PATH.finalKit, request, { minuto });
  }
}
