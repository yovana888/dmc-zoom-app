import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { LinkIcon, LinkSize } from './link.type';

const ICON_SIZE_BY_LINK_SIZE: Record<LinkSize, string> = {
  md: '1.5rem',
  sm: '1rem',
};

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrl: './link.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon],
})
export class LinkComponent {
  readonly size = input<LinkSize>('md');
  readonly icon = input<LinkIcon>('none');
  readonly iconName = input('');
  readonly iconColor = input<string>();
  readonly strokeWidth = input<string | number>();
  readonly href = input<string>();
  readonly disabled = input(false);

  protected readonly iconSize = computed((): string => ICON_SIZE_BY_LINK_SIZE[this.size()]);
  protected readonly resolvedColor = computed((): string => this.iconColor() ?? 'currentColor');

  protected onClick(event: Event): void {
    if (this.disabled()) {
      event.preventDefault();
    }
  }
}
