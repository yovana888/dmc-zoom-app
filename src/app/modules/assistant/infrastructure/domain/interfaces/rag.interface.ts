/* eslint-disable @typescript-eslint/naming-convention */
export interface RagAskRequest {
  sesion_id: number;
  pregunta: string;
  email?: string;
}

export interface RagAskResponse {
  respuesta: string;
  citas: string[];
}
