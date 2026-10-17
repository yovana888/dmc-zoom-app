import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { ModalMessageService } from '@shared/services/modal-message/modal-message.service';
import { ZoomSdkService } from '@shared/services/zoom/zoom-sdk.service';
import { ChipsComponent } from '@shared/components/atoms/chips/chips.component';
import { MessageBubblesComponent } from '@shared/components/molecules/message-bubbles/message-bubbles.component';
import { firstValueFrom } from 'rxjs';
import {
  SPINNER_WHEEL_MODAL_ID,
  SpinnerWheelModalComponent,
} from '../../../components/spinner-wheel-modal/spinner-wheel-modal.component';
import { wheelNames as participantNames } from '../../../components/spinner-wheel-modal/spinner-wheel.mapper';
import { ChatChip } from '../../../infrastructure/domain/entities/chat-message.entity';
import {
  AssistantConversationEnum,
  TypeChatItemEnum,
} from '../../../infrastructure/domain/enums/assistant.enum';
import { QuizGenerateResponse } from '../../../infrastructure/domain/interfaces/quiz.interface';
import { SessionRequest } from '../../../infrastructure/domain/interfaces/session.interface';
import { QuizService } from '../../../infrastructure/services/quiz.service';
import { WebchatStore } from '../../../infrastructure/store/webchat-store';

@Component({
  selector: 'app-tab-assistant',
  templateUrl: './tab-assistant.component.html',
  styleUrl: './tab-assistant.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChipsComponent, MessageBubblesComponent, SpinnerWheelModalComponent],
})
export class TabAssistantComponent {
  @ViewChild('chat') chat!: ElementRef<HTMLElement>;

  readonly summarize = output<void>();

  private readonly webchatStore = inject(WebchatStore);
  private readonly quiz = inject(QuizService);
  private readonly zoom = inject(ZoomSdkService);
  private readonly modalMessage = inject(ModalMessageService);
  protected readonly messages = this.webchatStore.messages;
  protected readonly username = this.webchatStore.username;
  protected readonly wheelNames = signal<string[]>([]);
  protected readonly wheelQuiz = signal<QuizGenerateResponse | null>(null);
  protected readonly wheelNotice = signal('');
  protected readonly quizNotice = signal('');

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
    if (chip.value === AssistantConversationEnum.SPINNER_WHEEL) {
      void this.openWheel();
    }
  }

  private async openWheel(): Promise<void> {
    const sessionId = this.webchatStore.session()?.sesion_id;
    if (sessionId === undefined) {
      this.showWheel([], null, 'No hay una clase activa para lanzar la ruleta.', '');
      return;
    }

    this.showWheel([], null, 'Preparando la ruleta…', '');
    await this.loadWheel(sessionId);
  }

  private async loadWheel(sessionId: number): Promise<void> {
    this.webchatStore.setIsLoading(true);
    try {
      const [names, quiz] = await Promise.all([this.attendeeNames(), this.liveQuiz(sessionId)]);
      this.showWheel(names, quiz, this.emptyNamesMessage(names), this.emptyQuizMessage(quiz));
    } finally {
      this.webchatStore.setIsLoading(false);
    }
  }

  private async attendeeNames(): Promise<string[]> {
    const teacherId = this.zoom.user()?.participantUUID ?? '';
    return participantNames(await this.zoom.listParticipants(), teacherId);
  }

  private async liveQuiz(sessionId: number): Promise<QuizGenerateResponse | null> {
    try {
      return await firstValueFrom(this.quiz.generateLive(this.quizRequest(sessionId)));
    } catch {
      return null;
    }
  }

  private emptyNamesMessage(names: string[]): string {
    return names.length === 0 ? 'No hay asistentes además del profesor.' : '';
  }

  private emptyQuizMessage(quiz: QuizGenerateResponse | null): string {
    return quiz ? '' : 'No pude generar la pregunta.';
  }

  private showWheel(
    names: string[],
    quiz: QuizGenerateResponse | null,
    notice: string,
    quizNotice: string,
  ): void {
    this.wheelNames.set(names);
    this.wheelQuiz.set(quiz);
    this.wheelNotice.set(notice);
    this.quizNotice.set(quizNotice);
    this.modalMessage.open(SPINNER_WHEEL_MODAL_ID);
  }

  private quizRequest(sessionId: number): SessionRequest {
    /* eslint-disable @typescript-eslint/naming-convention */
    return { sesion_id: sessionId };
    /* eslint-enable @typescript-eslint/naming-convention */
  }

  private scrollToBottom(): void {
    const el = this.chat?.nativeElement;
    el.scrollTop = el.scrollHeight;
  }
}
