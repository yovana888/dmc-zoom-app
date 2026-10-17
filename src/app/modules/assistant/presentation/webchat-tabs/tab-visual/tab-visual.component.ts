import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NumberValuesEnum } from '@core/enums/list/number.enum';
import { apiErrorMessage } from '@core/utils/api-error.util';
import { ModalMessageService } from '@shared/services/modal-message/modal-message.service';
import { ConnectorModel, NodeModel } from '@syncfusion/ej2-angular-diagrams';
import { firstValueFrom } from 'rxjs';
import {
  FLASHCARD_MODAL_ID,
  FlashcardModalComponent,
} from '../../../components/flashcard-modal/flashcard-modal.component';
import {
  MIND_MAP_MODAL_ID,
  MindMapModalComponent,
} from '../../../components/mind-map-modal/mind-map-modal.component';
import { toMindDiagram } from '../../../components/mind-map-modal/mind-map.mapper';
import { Flashcard } from '../../../infrastructure/domain/interfaces/final-kit.interface';
import { SessionRequest } from '../../../infrastructure/domain/interfaces/session.interface';
import { FinalKitService } from '../../../infrastructure/services/final-kit.service';
import { WebchatStore } from '../../../infrastructure/store/webchat-store';

interface VisualChip {
  label: string;
  tone: 'mind' | 'flash' | 'quiz';
}

@Component({
  selector: 'app-tab-visual',
  templateUrl: './tab-visual.component.html',
  styleUrl: './tab-visual.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MindMapModalComponent, FlashcardModalComponent],
})
export class TabVisualComponent {
  private readonly webchatStore = inject(WebchatStore);
  private readonly finalKit = inject(FinalKitService);
  private readonly modalMessage = inject(ModalMessageService);

  protected readonly isLoading = this.webchatStore.isLoading;
  protected readonly mindNodes = signal<NodeModel[]>([]);
  protected readonly mindConnectors = signal<ConnectorModel[]>([]);
  protected readonly mindMessage = signal('');
  protected readonly flashcards = signal<Flashcard[]>([]);
  protected readonly flashMessage = signal('');
  protected readonly chips: VisualChip[] = [
    { label: 'Mapa mental', tone: 'mind' },
    { label: 'FlashCard', tone: 'flash' },
    { label: 'Cuestionario', tone: 'quiz' },
  ];

  protected openChip(chip: VisualChip): void {
    if (chip.tone === 'mind') {
      void this.openMindMap();
    }
    if (chip.tone === 'flash') {
      void this.openFlashcards();
    }
  }

  private async openMindMap(): Promise<void> {
    const sessionId = this.webchatStore.session()?.sesion_id;
    if (sessionId === undefined) {
      this.showMindMap([], [], 'No hay una clase activa para generar el mapa mental.');
      return;
    }

    this.showMindMap([], [], 'Generando mapa mental…');
    await this.loadMindMap(sessionId);
  }

  private async loadMindMap(sessionId: number): Promise<void> {
    this.webchatStore.setIsLoading(true);
    try {
      const kit = await firstValueFrom(
        this.finalKit.generate(this.kitRequest(sessionId), this.meetingMinute()),
      );
      const diagram = toMindDiagram(kit.mapa_mental_json);
      this.showMindMap(diagram.nodes, diagram.connectors, '');
    } catch (error: unknown) {
      this.showMindMap([], [], apiErrorMessage(error, 'No pude generar el mapa mental.'));
    } finally {
      this.webchatStore.setIsLoading(false);
    }
  }

  private async openFlashcards(): Promise<void> {
    const sessionId = this.webchatStore.session()?.sesion_id;
    if (sessionId === undefined) {
      this.showFlashcards([], 'No hay una clase activa para generar las flashcards.');
      return;
    }

    this.showFlashcards([], 'Generando flashcards…');
    await this.loadFlashcards(sessionId);
  }

  private async loadFlashcards(sessionId: number): Promise<void> {
    this.webchatStore.setIsLoading(true);
    try {
      const kit = await firstValueFrom(
        this.finalKit.generate(this.kitRequest(sessionId), this.meetingMinute()),
      );
      this.showFlashcards(kit.flashcards, this.emptyFlashMessage(kit.flashcards));
    } catch (error: unknown) {
      this.showFlashcards([], apiErrorMessage(error, 'No pude generar las flashcards.'));
    } finally {
      this.webchatStore.setIsLoading(false);
    }
  }

  private emptyFlashMessage(cards: Flashcard[]): string {
    return cards.length === 0 ? 'No hay flashcards para esta clase.' : '';
  }

  private showFlashcards(cards: Flashcard[], message: string): void {
    this.flashcards.set(cards);
    this.flashMessage.set(message);
    this.modalMessage.open(FLASHCARD_MODAL_ID);
  }

  private showMindMap(nodes: NodeModel[], connectors: ConnectorModel[], message: string): void {
    this.mindNodes.set(nodes);
    this.mindConnectors.set(connectors);
    this.mindMessage.set(message);
    this.modalMessage.open(MIND_MAP_MODAL_ID);
  }

  private meetingMinute(): number {
    const start = Date.parse(this.webchatStore.session()?.fechas.inicio_programado ?? '');
    if (Number.isNaN(start)) {
      return 0;
    }

    const elapsed = Date.now() - start;
    if (elapsed <= 0) {
      return 0;
    }

    const minuteMs = NumberValuesEnum.THOUSAND * NumberValuesEnum.SIXTY;
    return Math.floor(elapsed / minuteMs);
  }

  private kitRequest(sessionId: number): SessionRequest {
    /* eslint-disable @typescript-eslint/naming-convention */
    return { sesion_id: sessionId };
    /* eslint-enable @typescript-eslint/naming-convention */
  }
}
