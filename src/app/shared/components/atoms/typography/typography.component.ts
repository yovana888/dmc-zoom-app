import { ChangeDetectionStrategy, Component, HostBinding, input } from '@angular/core';
import { ColorDirective } from '../../../directives/color/color.directive';
import { TypographySize, TypographyWeight } from './typography.type';

@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrl: './typography.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: ColorDirective,
      inputs: ['appColor: color'],
    },
  ],
})
export class TypographyComponent {
  readonly size = input<TypographySize>('md');
  readonly weight = input<TypographyWeight>('regular');

  @HostBinding('attr.data-size')
  protected get sizeAttribute(): TypographySize {
    return this.size();
  }

  @HostBinding('attr.data-weight')
  protected get weightAttribute(): TypographyWeight {
    return this.weight();
  }
}
