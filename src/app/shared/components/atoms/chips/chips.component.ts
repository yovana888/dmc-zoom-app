import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { ChipIcon, ChipStyle } from './chips.type';

@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrl: './chips.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon],
})
export class ChipsComponent {
  readonly style = input<ChipStyle>('filled');
  readonly icon = input<ChipIcon>('none');
  readonly iconName = input('');
  readonly image = input('');
  readonly imageAlt = input('');
  readonly disabled = input(false);
}
