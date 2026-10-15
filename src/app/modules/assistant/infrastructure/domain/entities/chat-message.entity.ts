import { MessageSender } from '@shared/components/molecules/message-bubbles/message-bubbles.type';
import { TypeChatItemEnum } from '../enums/assistant.enum';

export interface ChatChip {
  label: string;
  value: string;
}

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  chips: ChatChip[];
  type: TypeChatItemEnum;
}

export type AssistantSection = 'assistant' | 'material' | 'transcript';

export type ChatMessageTemplateFactory = (username: string) => ChatMessage;
