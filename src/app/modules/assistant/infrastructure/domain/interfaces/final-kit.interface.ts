/* eslint-disable @typescript-eslint/naming-convention */
export interface Flashcard {
  pregunta: string;
  respuesta: string;
}

export interface MindNode {
  titulo: string;
  conceptos: string[];
}

export interface MindMap {
  tema: string;
  ramas: MindNode[];
}

export interface FinalKitResponse {
  resumen_ejecutivo: string;
  mapa_mental_json: MindMap;
  flashcards: Flashcard[];
  minuto: number;
}
