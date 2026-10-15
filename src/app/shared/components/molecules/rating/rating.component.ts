import { ChangeDetectionStrategy, Component, computed, input, model, signal } from '@angular/core';
import { RatingStar } from './rating.component.interface';
import { NumberValuesEnum } from '@core/enums/list/number.enum';

const FILLED_ICON = 'icons/rating-fill.svg';
const EMPTY_ICON = 'icons/rating-not-fill.svg';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'd-inline-flex align-items-start gap-2',
    role: 'radiogroup',
    /* eslint-disable @typescript-eslint/naming-convention */
    'aria-label': 'Valoración',
    '(mouseleave)': 'clearHover()',
  },
})
export class RatingComponent {
  readonly value = model(0);
  readonly max = input(NumberValuesEnum.FIVE);

  private readonly hoverValue = signal(0);

  protected readonly stars = computed((): RatingStar[] => this.buildStars());

  protected preview(star: number): void {
    this.hoverValue.set(star);
  }

  protected clearHover(): void {
    this.hoverValue.set(0);
  }

  protected select(star: number): void {
    this.value.set(star);
  }

  private buildStars(): RatingStar[] {
    const selected = this.hoverValue() || this.value();
    /* eslint-disable @typescript-eslint/naming-convention */
    return Array.from({ length: this.max() }, (_, index): RatingStar => {
      const value = index + NumberValuesEnum.ONE;

      return {
        value,
        icon: value <= selected ? FILLED_ICON : EMPTY_ICON,
        label: `${value} de ${this.max()}`,
        checked: this.value() === value,
      };
    });
  }
}
