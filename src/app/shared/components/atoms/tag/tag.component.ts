import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TagVariant } from './tag.type';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrl: './tag.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagComponent {
  readonly variant = input<TagVariant>('new');
}
