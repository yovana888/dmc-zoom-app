import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ASSISTANT_API_PATH } from '../constants/assistant-api.paths';
import { QuizGenerateRequest, QuizGenerateResponse } from '../domain/interfaces/quiz.interface';
import { AssistantHttpService } from './assistant-http.service';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private readonly http = inject(AssistantHttpService);

  generateLive(request: QuizGenerateRequest): Observable<QuizGenerateResponse> {
    return this.http.post<QuizGenerateResponse>(ASSISTANT_API_PATH.quizGenerateLive, request);
  }
}
