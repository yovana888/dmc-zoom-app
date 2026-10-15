import { ChangeDetectionStrategy, Component, computed, HostBinding, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { ButtonIcon, ButtonSize, ButtonVariant } from './button.type';

const ICON_SIZE_BY_BUTTON_SIZE: Record<ButtonSize, string> = {
  lg: '1.5rem',
  md: '1.5rem',
  sm: '1rem',
  xs: '1rem',
};

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon],
})
export class ButtonComponent {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('lg');
  readonly icon = input<ButtonIcon>('none');
  readonly iconName = input('');
  readonly full = input(false);
  readonly disabled = input(false);

  @HostBinding('attr.data-full')
  protected get fullAttribute(): string | null {
    return this.full() ? 'true' : null;
  }

  protected readonly iconSize = computed((): string => ICON_SIZE_BY_BUTTON_SIZE[this.size()]);
}
