import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ASSISTANT_API_PATH } from '../constants/assistant-api.paths';
import { SessionRequest } from '../domain/interfaces/session.interface';
import { SummaryExpressResponse } from '../domain/interfaces/summary.interface';
import { AssistantHttpService } from './assistant-http.service';

@Injectable({ providedIn: 'root' })
export class SummaryService {
  private readonly http = inject(AssistantHttpService);

  express(request: SessionRequest): Observable<SummaryExpressResponse> {
    return this.http.post<SummaryExpressResponse>(ASSISTANT_API_PATH.summaryExpress, request);
  }
}
