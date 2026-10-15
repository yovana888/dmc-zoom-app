import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { TabComponent } from '@shared/components/molecules/tabs/tab.component';
import { TabsComponent } from '@shared/components/molecules/tabs/tabs.component';
import { ChatInputComponent } from '../components/chat-input/chat-input.component';
import { HeaderComponent } from '../components/header/header.component';
import { TabAssistantComponent } from './webchat-tabs/tab-assistant/tab-assistant.component';
import {
  AssistantConversationEnum,
  TypeChatItemEnum,
} from '../infrastructure/domain/enums/assistant.enum';
import { WebchatStore } from '../infrastructure/store/webchat-store';
import { AREA_CHAT_CONVERSATION } from './constants/assistant-messages';
import { AssistantRoleEnum } from '@core/enums/modules/roles.enum';
import { ASSISTANT_TABS_STUDENT, ASSISTANT_TABS_TEACHER } from './constants/assistant-tabs';

@Component({
  selector: 'app-assistant',
  templateUrl: './assistant.component.html',
  styleUrl: './assistant.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ChatInputComponent,
    HeaderComponent,
    TabAssistantComponent,
    TabComponent,
    TabsComponent,
  ],
})
export class AssistantComponent implements OnInit {
  private readonly webchatStore = inject(WebchatStore);
  protected readonly messages = this.webchatStore.messages;
  protected readonly section = signal<string>('assistant');
  protected readonly username = this.webchatStore.username;
  protected readonly isLoading = this.webchatStore.isLoading;
  protected readonly role = this.webchatStore.role;
  protected readonly tabs = computed(() =>
    this.role() === AssistantRoleEnum.STUDENT ? ASSISTANT_TABS_STUDENT : ASSISTANT_TABS_TEACHER,
  );

  ngOnInit(): void {
    this.appendWelcomeMessage();
  }

  private appendWelcomeMessage(): void {
    const role = this.webchatStore.role();
    const keyWelcome =
      role === AssistantRoleEnum.STUDENT
        ? AssistantConversationEnum.WELCOME_STUDENT
        : AssistantConversationEnum.WELCOME_TEACHER;
    this.webchatStore.addMessage(AREA_CHAT_CONVERSATION[keyWelcome](this.username()));
  }

  protected selectSection(section: string): void {
    this.section.set(section);
  }

  protected handleSendMessage(text: string): void {
    this.webchatStore.addMessage({
      id: crypto.randomUUID(),
      sender: 'user',
      text,
      chips: [],
      type: TypeChatItemEnum.TEXT,
    });
  }
}
