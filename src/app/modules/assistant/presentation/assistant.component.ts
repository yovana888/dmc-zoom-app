import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { AssistantRoleEnum } from '@core/enums/modules/roles.enum';
import { apiErrorMessage } from '@core/utils/api-error.util';
import { ModalMessageService } from '@shared/services/modal-message/modal-message.service';
import { ZoomSdkService } from '@shared/services/zoom/zoom-sdk.service';
import { TabComponent } from '@shared/components/molecules/tabs/tab.component';
import { TabsComponent } from '@shared/components/molecules/tabs/tabs.component';
import { firstValueFrom } from 'rxjs';
import { ChatInputComponent } from '../components/chat-input/chat-input.component';
import { HeaderComponent } from '../components/header/header.component';
import {
  SUMMARY_MODAL_ID,
  SummaryModalComponent,
} from '../components/summary-modal/summary-modal.component';
import { TabAssistantComponent } from './webchat-tabs/tab-assistant/tab-assistant.component';
import { TabNotesComponent } from './webchat-tabs/tab-notes/tab-notes.component';
import { TabVisualComponent } from './webchat-tabs/tab-visual/tab-visual.component';
import {
  AssistantConversationEnum,
  TypeChatItemEnum,
} from '../infrastructure/domain/enums/assistant.enum';
import { RagAskRequest, RagAskResponse } from '../infrastructure/domain/interfaces/rag.interface';
import { SummaryExpressResponse } from '../infrastructure/domain/interfaces/summary.interface';
import {
  SessionDetailsRequest,
  SessionRequest,
} from '../infrastructure/domain/interfaces/session.interface';
import { RagService } from '../infrastructure/services/rag.service';
import { SessionDetailsService } from '../infrastructure/services/session-details.service';
import { SummaryService } from '../infrastructure/services/summary.service';
import { WebchatStore } from '../infrastructure/store/webchat-store';
import { AREA_CHAT_CONVERSATION } from './constants/assistant-messages';
import { ASSISTANT_TABS_STUDENT, ASSISTANT_TABS_TEACHER } from './constants/assistant-tabs';

@Component({
  selector: 'app-assistant',
  templateUrl: './assistant.component.html',
  styleUrl: './assistant.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ChatInputComponent,
    HeaderComponent,
    SummaryModalComponent,
    TabAssistantComponent,
    TabNotesComponent,
    TabVisualComponent,
    TabComponent,
    TabsComponent,
  ],
})
export class AssistantComponent implements OnInit {
  private readonly webchatStore = inject(WebchatStore);
  private readonly zoomSdk = inject(ZoomSdkService);
  private readonly sessionDetails = inject(SessionDetailsService);
  private readonly rag = inject(RagService);
  private readonly summary = inject(SummaryService);
  private readonly modalMessage = inject(ModalMessageService);
  protected readonly messages = this.webchatStore.messages;
  protected readonly section = signal<string>('assistant');
  protected readonly username = this.webchatStore.username;
  protected readonly isLoading = this.webchatStore.isLoading;
  protected readonly role = this.webchatStore.role;
  protected readonly courseTitle = computed(
    () => this.webchatStore.session()?.curso.programa_nombre ?? '',
  );
  protected readonly classNumber = computed(() => {
    const classNumber = this.webchatStore.session()?.curso.numero_clase;
    return classNumber === undefined ? '' : String(classNumber);
  });
  protected readonly expressSummary = signal<SummaryExpressResponse | null>(null);
  protected readonly tabs = computed(() =>
    this.role() === AssistantRoleEnum.STUDENT ? ASSISTANT_TABS_STUDENT : ASSISTANT_TABS_TEACHER,
  );

  ngOnInit(): void {
    void this.start();
  }

  private async start(): Promise<void> {
    this.rememberZoomUser();
    const request = this.sessionRequest();
    if (!request) {
      console.warn('[assistant] no Zoom meeting id available, session/details was not called');
      this.addMessage('agent', this.zoomDiagnostics('Sin id de reunión, no se llamó al back.'));
      this.appendWelcomeMessage();
      return;
    }

    this.webchatStore.setIsLoading(true);
    try {
      this.webchatStore.applySession(await firstValueFrom(this.sessionDetails.details(request)));
    } catch (error: unknown) {
      // The welcome still opens when the class cannot be resolved.
      console.error('[assistant] session/details failed', request, error);
      this.addMessage('agent', `session/details falló: ${JSON.stringify(error)}`);
    } finally {
      this.webchatStore.setIsLoading(false);
      this.appendWelcomeMessage();
    }
  }

  private zoomDiagnostics(headline: string): string {
    const lines = this.zoomSdk.diagnostics();
    return [headline, ...lines].join('\n');
  }

  private rememberZoomUser(): void {
    const screenName = this.zoomSdk.user()?.screenName ?? '';
    if (screenName.length > 0) {
      this.webchatStore.setUsername(screenName);
    }
  }

  private sessionRequest(): SessionDetailsRequest | null {
    const meetingId = this.zoomSdk.meeting()?.meetingID || this.zoomSdk.meetingUuid() || '';
    if (meetingId.length === 0) {
      return null;
    }

    return this.detailsRequest(meetingId);
  }

  private detailsRequest(meetingId: string): SessionDetailsRequest {
    /* eslint-disable @typescript-eslint/naming-convention */
    return { zoom_meeting_id: meetingId };
    /* eslint-enable @typescript-eslint/naming-convention */
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

  protected summarizeNow(): void {
    void this.loadExpressSummary();
  }

  protected handleSendMessage(text: string): void {
    this.addMessage('user', text);
    void this.ask(text);
  }

  private async ask(question: string): Promise<void> {
    const sessionId = this.webchatStore.session()?.sesion_id;
    if (sessionId === undefined) {
      this.addMessage('agent', 'No hay una clase activa para consultar.');
      return;
    }

    this.webchatStore.setIsLoading(true);
    try {
      const response = await firstValueFrom(this.rag.ask(this.ragRequest(sessionId, question)));
      this.addMessage('agent', this.answerText(response));
    } catch (error: unknown) {
      this.addMessage('agent', apiErrorMessage(error, 'No pude responder esa pregunta.'));
    } finally {
      this.webchatStore.setIsLoading(false);
    }
  }

  private async loadExpressSummary(): Promise<void> {
    const sessionId = this.webchatStore.session()?.sesion_id;
    if (sessionId === undefined) {
      this.addMessage('agent', 'No hay una clase activa para resumir.');
      return;
    }

    this.webchatStore.setIsLoading(true);
    try {
      this.expressSummary.set(
        await firstValueFrom(this.summary.express(this.summaryRequest(sessionId))),
      );
      this.modalMessage.open(SUMMARY_MODAL_ID);
    } catch (error: unknown) {
      this.addMessage('agent', apiErrorMessage(error, 'No pude generar el resumen.'));
    } finally {
      this.webchatStore.setIsLoading(false);
    }
  }

  private summaryRequest(sessionId: number): SessionRequest {
    /* eslint-disable @typescript-eslint/naming-convention */
    return { sesion_id: sessionId };
    /* eslint-enable @typescript-eslint/naming-convention */
  }

  private ragRequest(sessionId: number, question: string): RagAskRequest {
    /* eslint-disable @typescript-eslint/naming-convention */
    return { sesion_id: sessionId, pregunta: question };
    /* eslint-enable @typescript-eslint/naming-convention */
  }

  private answerText(response: RagAskResponse): string {
    if (response.citas.length === 0) {
      return response.respuesta;
    }

    return `${response.respuesta}\n${response.citas.join('\n')}`;
  }

  private addMessage(sender: 'agent' | 'user', text: string): void {
    this.webchatStore.addMessage({
      id: crypto.randomUUID(),
      sender,
      text,
      chips: [],
      type: TypeChatItemEnum.TEXT,
    });
  }
}
