import { ChatMessageTemplateFactory } from '@modules/assistant/infrastructure/domain/entities/chat-message.entity';
import {
  AssistantConversationEnum,
  TypeChatItemEnum,
} from '@modules/assistant/infrastructure/domain/enums/assistant.enum';

export const AREA_CHAT_CONVERSATION: Record<string, ChatMessageTemplateFactory> = {
  [AssistantConversationEnum.WELCOME_STUDENT]: (username: string) => ({
    id: crypto.randomUUID(),
    sender: 'agent',
    text: `Hola, ${username}\nAquí tienes algunos enlaces útiles para empezar.`,
    chips: [
      {
        value: AssistantConversationEnum.SUMMARIZE_TRANSCRIPT,
        label: 'Resumir hasta ahora ⚡',
      },
      {
        value: AssistantConversationEnum.SUMMARY_LAST_CLASS,
        label: 'Resumen de la última clase 📚',
      },
    ],
    type: TypeChatItemEnum.TEXT,
  }),
  [AssistantConversationEnum.WELCOME_TEACHER]: (username: string) => ({
    id: crypto.randomUUID(),
    sender: 'agent',
    text: `Hola, ${username}\nAquí tienes algunos enlaces útiles para empezar.`,
    chips: [
      {
        value: AssistantConversationEnum.QUIZ_RESPONSE_TIME,
        label: 'Generar quiz relampago 🔥',
      },

      {
        value: AssistantConversationEnum.SPINNER_WHEEL,
        label: 'Lanzar ruleta de participación 🎰',
      },
    ],
    type: TypeChatItemEnum.TEXT,
  }),
};
