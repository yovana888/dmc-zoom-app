import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { phosphorCaretLeft } from '@ng-icons/phosphor-icons/regular';
import { ButtonIconComponent } from '@shared/components/atoms/button-icon/button-icon.component';
import { ChipsComponent } from '@shared/components/atoms/chips/chips.component';

@Component({
  selector: 'app-assistant-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonIconComponent, ChipsComponent],
  providers: [provideIcons({ phosphorCaretLeft })],
})
export class HeaderComponent {
  readonly title = input('');
  readonly classNumber = input('');
}
