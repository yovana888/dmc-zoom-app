import { Injectable, signal } from '@angular/core';
import { ChatMessage } from '../domain/entities/chat-message.entity';
import { AssistantRoleEnum } from '@core/enums/modules/roles.enum';

@Injectable({ providedIn: 'root' })
export class WebchatStore {
  readonly messages = signal<ChatMessage[]>([]);
  readonly role = signal<AssistantRoleEnum>(AssistantRoleEnum.STUDENT);
  readonly username = signal<string>('username');
  readonly isLoading = signal<boolean>(false);

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
}
