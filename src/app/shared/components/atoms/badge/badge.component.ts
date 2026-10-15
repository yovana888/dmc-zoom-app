import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BadgeVariant } from './badge.type';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  readonly variant = input<BadgeVariant>('filled');
}
