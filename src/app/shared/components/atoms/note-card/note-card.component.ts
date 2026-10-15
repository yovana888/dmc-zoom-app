import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { phosphorX } from '@ng-icons/phosphor-icons/regular';
import { NoteCardTone } from './note-card.type';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrl: './note-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon],
  providers: [provideIcons({ phosphorX })],
})
export class NoteCardComponent {
  readonly text = input('');
  readonly tone = input<NoteCardTone>('blue');

  readonly remove = output<void>();
}
