/* eslint-disable @typescript-eslint/naming-convention */
import { ConnectedUserRoleEnum, EntryRoleEnum, SessionStateEnum } from '../enums/session.enum';

export interface SessionRequest {
  sesion_id: number;
  email?: string;
}

export interface SessionDetailsRequest {
  zoom_join_url?: string;
  zoom_meeting_id?: string;
  email?: string;
}

export interface CourseDetails {
  programa_nombre: string;
  edicion_nombre: string;
  modulo_titulo: string;
  numero_clase: number;
}

export interface TeacherDetails {
  id: number;
  nombre_completo: string;
  email: string;
}

export interface ConnectedUser {
  id: number;
  nombre: string;
  rol: ConnectedUserRoleEnum;
  es_docente_de_clase: boolean;
}

export interface SessionDates {
  inicio_programado: string;
  estado_sesion: SessionStateEnum;
}

export interface SessionDetailsResponse {
  sesion_id: number;
  zoom_meeting_id: string;
  curso: CourseDetails;
  es_docente: boolean;
  rol_ingreso: EntryRoleEnum | null;
  docente: TeacherDetails | null;
  usuario_conectado: ConnectedUser | null;
  fechas: SessionDates;
}
