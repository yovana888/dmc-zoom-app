import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { ButtonIconSize, ButtonIconVariant } from './button-icon.type';

const ICON_SIZE_BY_BUTTON_SIZE: Record<ButtonIconSize, string> = {
  lg: '1.5rem',
  md: '1.5rem',
  sm: '1rem',
  xs: '1rem',
};

@Component({
  selector: 'app-button-icon',
  templateUrl: './button-icon.component.html',
  styleUrl: './button-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon],
})
export class ButtonIconComponent {
  readonly variant = input<ButtonIconVariant>('primary');
  readonly size = input<ButtonIconSize>('lg');
  readonly iconName = input.required<string>();
  readonly label = input.required<string>();
  readonly iconColor = input<string>();
  readonly strokeWidth = input<string | number>();
  readonly active = input(false);
  readonly disabled = input(false);

  protected readonly iconSize = computed((): string => ICON_SIZE_BY_BUTTON_SIZE[this.size()]);
  protected readonly resolvedColor = computed((): string => this.iconColor() ?? 'currentColor');
}
