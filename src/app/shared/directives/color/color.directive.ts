import { Directive, HostBinding, input } from '@angular/core';
import { ColorToken, colorVariable } from '../../constants/color-token.constants';

@Directive({
  selector: '[appColor]',
})
export class ColorDirective {
  readonly appColor = input<ColorToken>('--light-greyscale-text-primary');

  @HostBinding('style.color')
  protected get hostColor(): string {
    return colorVariable(this.appColor());
  }
}
