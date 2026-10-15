import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  output,
  ViewChild,
} from '@angular/core';
import { ChipsComponent } from '@shared/components/atoms/chips/chips.component';
import { MessageBubblesComponent } from '@shared/components/molecules/message-bubbles/message-bubbles.component';
import { ChatChip } from '../../../infrastructure/domain/entities/chat-message.entity';
import {
  AssistantConversationEnum,
  TypeChatItemEnum,
} from '../../../infrastructure/domain/enums/assistant.enum';
import { WebchatStore } from '../../../infrastructure/store/webchat-store';

@Component({
  selector: 'app-tab-assistant',
  templateUrl: './tab-assistant.component.html',
  styleUrl: './tab-assistant.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChipsComponent, MessageBubblesComponent],
})
export class TabAssistantComponent {
  @ViewChild('chat') chat!: ElementRef<HTMLElement>;

  readonly summarize = output<void>();

  private readonly webchatStore = inject(WebchatStore);
  protected readonly messages = this.webchatStore.messages;
  protected readonly username = this.webchatStore.username;

  constructor() {
    effect(() => {
      if (this.messages().length) {
        queueMicrotask(() => this.scrollToBottom());
      }
    });
  }

  protected handleChip(chip: ChatChip): void {
    this.webchatStore.addMessage({
      id: crypto.randomUUID(),
      sender: 'user',
      text: chip.label,
      chips: [],
      type: TypeChatItemEnum.TEXT,
    });

    if (chip.value === AssistantConversationEnum.SUMMARIZE_TRANSCRIPT) {
      this.summarize.emit();
    }
  }

  private scrollToBottom(): void {
    const el = this.chat?.nativeElement;
    el.scrollTop = el.scrollHeight;
  }
}
