import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-tab',
  templateUrl: 'tab.component.html',
  styleUrl: 'tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon],
})
export class TabComponent {
  readonly selected = input(false);
  readonly disabled = input(false);
  readonly iconName = input('');

  protected readonly iconColor = computed((): string =>
    this.disabled() ? 'var(--light-greyscale-disabled-text)' : 'var(--light-greyscale-icons)',
  );
}
