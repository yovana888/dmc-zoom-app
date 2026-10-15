import { ChangeDetectionStrategy, Component, computed, HostBinding, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { phosphorPlus, phosphorUser } from '@ng-icons/phosphor-icons/regular';
import { AvatarIndicator, AvatarSize, AvatarType } from './avatar.type';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon],
  providers: [provideIcons({ phosphorUser, phosphorPlus })],
})
export class AvatarComponent {
  readonly type = input<AvatarType>('empty');
  readonly size = input<AvatarSize>('32');
  readonly indicator = input<AvatarIndicator>('none');
  readonly src = input('');
  readonly alt = input('');
  readonly initials = input('');
  readonly addLabel = input('Agregar');

  @HostBinding('attr.data-size')
  protected get sizeAttribute(): AvatarSize {
    return this.size();
  }

  @HostBinding('attr.data-type')
  protected get typeAttribute(): AvatarType {
    return this.type();
  }

  protected readonly iconSize = computed((): string => this.resolveIconSize());

  protected readonly iconColor = computed((): string =>
    this.type() === 'add'
      ? 'var(--light-assents-accent1-primary)'
      : 'var(--light-greyscale-disabled-text)',
  );

  protected readonly showIndicator = computed(
    (): boolean => this.indicator() !== 'none' && this.type() !== 'add',
  );

  private resolveIconSize(): string {
    if (this.type() === 'add' && this.size() === '56') {
      return '1.5rem';
    }

    switch (this.size()) {
      case '24':
        return '0.75rem';
      case '32':
        return '1rem';
      case '48':
        return '1.5rem';
      default:
        return '2rem';
    }
  }
}
