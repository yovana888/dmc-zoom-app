import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { NumberValuesEnum } from '@core/enums/list/number.enum';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  phosphorArrowsClockwise,
  phosphorCaretLeft,
  phosphorCaretRight,
} from '@ng-icons/phosphor-icons/regular';
import { ButtonComponent } from '@shared/components/atoms/button/button.component';
import { ModalMessageComponent } from '@shared/components/molecules/modal-message/modal-message.component';
import { Flashcard } from '../../infrastructure/domain/interfaces/final-kit.interface';

export const FLASHCARD_MODAL_ID = 'flashcards';

@Component({
  selector: 'app-flashcard-modal',
  templateUrl: './flashcard-modal.component.html',
  styleUrl: './flashcard-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModalMessageComponent, ButtonComponent, NgIcon],
  providers: [provideIcons({ phosphorArrowsClockwise, phosphorCaretLeft, phosphorCaretRight })],
})
export class FlashcardModalComponent {
  readonly cards = input<Flashcard[]>([]);
  readonly message = input('');

  protected readonly modalId = FLASHCARD_MODAL_ID;
  protected readonly index = signal(0);
  protected readonly flipped = signal(false);
  protected readonly current = computed((): Flashcard | null => this.cards()[this.index()] ?? null);
  protected readonly position = computed((): number => this.index() + NumberValuesEnum.ONE);
  protected readonly total = computed((): number => this.cards().length);
  protected readonly canGoBack = computed((): boolean => this.index() > 0);
  protected readonly canGoNext = computed(
    (): boolean => this.index() < this.cards().length - NumberValuesEnum.ONE,
  );

  constructor() {
    effect((): void => {
      this.cards();
      this.index.set(0);
      this.flipped.set(false);
    });
  }

  protected flip(): void {
    this.flipped.update((value): boolean => !value);
  }

  protected previous(): void {
    this.move(NumberValuesEnum.MINUS_ONE);
  }

  protected next(): void {
    this.move(NumberValuesEnum.ONE);
  }

  private move(step: number): void {
    const nextIndex = this.index() + step;
    if (nextIndex < 0 || nextIndex >= this.cards().length) {
      return;
    }

    this.index.set(nextIndex);
    this.flipped.set(false);
  }
}
