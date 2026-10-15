import { Injectable, signal } from '@angular/core';
import { AssistantRoleEnum } from '@core/enums/modules/roles.enum';
import { ChatMessage } from '../domain/entities/chat-message.entity';
import { EntryRoleEnum } from '../domain/enums/session.enum';
import { SessionDetailsResponse } from '../domain/interfaces/session.interface';

@Injectable({ providedIn: 'root' })
export class WebchatStore {
  readonly messages = signal<ChatMessage[]>([]);
  readonly role = signal<AssistantRoleEnum>(AssistantRoleEnum.STUDENT);
  readonly username = signal<string>('username');
  readonly isLoading = signal<boolean>(false);
  readonly session = signal<SessionDetailsResponse | null>(null);

  setIsLoading(isLoading: boolean): void {
    this.isLoading.set(isLoading);
  }

  setMessages(messages: ChatMessage[]): void {
    this.messages.set(messages);
  }

  addMessage(message: ChatMessage): void {
    this.messages.update((current) => [...current, message]);
  }

  clearMessages(): void {
    this.messages.set([]);
  }

  setRole(role: AssistantRoleEnum): void {
    this.role.set(role);
  }

  setUsername(username: string): void {
    this.username.set(username);
  }

  applySession(session: SessionDetailsResponse): void {
    this.session.set(session);
    this.rememberConnectedUser(session);
    this.role.set(this.roleFromSession(session));
  }

  private rememberConnectedUser(session: SessionDetailsResponse): void {
    const connectedName = session.usuario_conectado?.nombre ?? '';
    if (connectedName.length > 0) {
      this.username.set(connectedName);
    }
  }

  private roleFromSession(session: SessionDetailsResponse): AssistantRoleEnum {
    const isTeacher = session.es_docente || session.rol_ingreso === EntryRoleEnum.TEACHER;
    return isTeacher ? AssistantRoleEnum.TEACHER : AssistantRoleEnum.STUDENT;
  }
}
