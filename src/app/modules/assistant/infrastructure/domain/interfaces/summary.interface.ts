/* eslint-disable @typescript-eslint/naming-convention */
export interface SummarySpeaker {
  name: string;
  share: number;
}

export interface SummaryHighlight {
  speaker: string;
  time: string;
  text: string;
}

export interface SummaryExpressResponse {
  minuto_actual: number;
  summary: string;
  topics: string[];
  action_items: string[];
  key_questions: string[];
  keywords: string[];
  speakers: SummarySpeaker[];
  highlight: SummaryHighlight | null;
}
