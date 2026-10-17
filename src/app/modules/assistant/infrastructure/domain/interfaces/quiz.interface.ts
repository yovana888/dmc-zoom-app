/* eslint-disable @typescript-eslint/naming-convention */
import { SessionRequest } from './session.interface';

export interface QuizGenerateRequest extends SessionRequest {
  minutos_atras?: number;
}

export interface QuizGenerateResponse {
  pregunta: string;
  opciones: string[];
  respuesta_correcta: number;
  tiempo_limite_seg: number;
}
