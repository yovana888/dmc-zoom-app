import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon],
})
export class IconComponent {
  readonly icon = input.required<string>();
  readonly size = input<string>();
  readonly color = input<string>();
  readonly strokeWidth = input<string | number>();

  protected readonly resolvedSize = computed((): string => this.size() ?? '1em');
  protected readonly resolvedColor = computed((): string => this.color() ?? 'currentColor');
}
