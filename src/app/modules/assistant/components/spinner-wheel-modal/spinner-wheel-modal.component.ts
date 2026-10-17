import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { NumberValuesEnum } from '@core/enums/list/number.enum';
import { ButtonComponent } from '@shared/components/atoms/button/button.component';
import { ModalMessageComponent } from '@shared/components/molecules/modal-message/modal-message.component';
import { QuizGenerateResponse } from '../../infrastructure/domain/interfaces/quiz.interface';
import { toSlices, wheelBackground, WheelSlice } from './spinner-wheel.mapper';

export const SPINNER_WHEEL_MODAL_ID = 'spinner-wheel';

enum WheelTurnEnum {
  DEGREES = 360,
}

@Component({
  selector: 'app-spinner-wheel-modal',
  templateUrl: './spinner-wheel-modal.component.html',
  styleUrl: './spinner-wheel-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModalMessageComponent, ButtonComponent],
})
export class SpinnerWheelModalComponent {
  readonly names = input<string[]>([]);
  readonly quiz = input<QuizGenerateResponse | null>(null);
  readonly notice = input('');
  readonly quizNotice = input('');

  private rotation = 0;
  private pendingWinner = '';

  protected readonly modalId = SPINNER_WHEEL_MODAL_ID;
  protected readonly spinning = signal(false);
  protected readonly revealed = signal(false);
  protected readonly winner = signal('');
  protected readonly rotationStyle = signal('rotate(0deg)');
  protected readonly slices = computed((): WheelSlice[] => toSlices(this.names()));
  protected readonly background = computed((): string => wheelBackground(this.names().length));
  protected readonly headline = computed((): string => this.spinHeadline());

  constructor() {
    effect((): void => {
      this.names();
      this.quiz();
      this.resetWheel();
    });
  }

  protected tone(index: number): string {
    return index % NumberValuesEnum.TWO === 0 ? 'a' : 'b';
  }

  protected isAnswer(index: number): boolean {
    return this.revealed() && index === this.quiz()?.respuesta_correcta;
  }

  protected showAnswer(): void {
    this.revealed.set(true);
  }

  protected spin(): void {
    if (this.spinning() || this.names().length === 0) {
      return;
    }

    const count = this.names().length;
    const index = Math.floor(Math.random() * count);
    this.pendingWinner = this.names()[index] ?? '';
    this.spinning.set(true);
    this.queueRotation(this.nextRotation(index, count));
  }

  protected finishSpin(event: TransitionEvent): void {
    if (event.propertyName !== 'transform' || !this.spinning()) {
      return;
    }

    this.spinning.set(false);
    this.winner.set(this.pendingWinner);
  }

  private spinHeadline(): string {
    if (this.spinning()) {
      return 'Girando…';
    }

    return this.winner() || 'Gira la ruleta';
  }

  private queueRotation(target: number): void {
    this.rotation = target;
    requestAnimationFrame((): void => {
      this.rotationStyle.set(`rotate(${target}deg)`);
    });
  }

  private nextRotation(index: number, count: number): number {
    const slice = WheelTurnEnum.DEGREES / count;
    const center = (index + NumberValuesEnum.ONE / NumberValuesEnum.TWO) * slice;
    const laps = Math.ceil(this.rotation / WheelTurnEnum.DEGREES) + NumberValuesEnum.FIVE;
    return laps * WheelTurnEnum.DEGREES - center;
  }

  private resetWheel(): void {
    this.rotation = 0;
    this.pendingWinner = '';
    this.spinning.set(false);
    this.revealed.set(false);
    this.winner.set('');
    this.rotationStyle.set('rotate(0deg)');
  }
}
