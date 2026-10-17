/* eslint-disable @typescript-eslint/naming-convention */
export interface ChatFilesRequest {
  sesion_id: number;
  minuto_actual: number;
}

export interface ChatFile {
  type: string;
  link: string;
  minuto: number | null;
  persona: string | null;
}

export interface ChatFilesResponse {
  archivos: ChatFile[];
}
