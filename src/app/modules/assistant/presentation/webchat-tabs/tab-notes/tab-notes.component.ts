import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NoteCardComponent } from '@shared/components/atoms/note-card/note-card.component';
import { NoteCardTone } from '@shared/components/atoms/note-card/note-card.type';
import { ChatInputComponent } from '../../../components/chat-input/chat-input.component';
import { NotesStore } from '../../../infrastructure/store/notes-store';

const NOTE_TONES: NoteCardTone[] = ['blue', 'cream', 'peach', 'mint'];

@Component({
  selector: 'app-tab-notes',
  templateUrl: './tab-notes.component.html',
  styleUrl: './tab-notes.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ChatInputComponent, NoteCardComponent],
})
export class TabNotesComponent {
  private readonly notesStore = inject(NotesStore);

  protected readonly notes = this.notesStore.notes;

  protected addNote(text: string): void {
    this.notesStore.add(text);
  }

  protected removeNote(uuid: string): void {
    this.notesStore.remove(uuid);
  }

  protected tone(uuid: string): NoteCardTone {
    const index = [...uuid].reduce((total, char) => total + char.charCodeAt(0), 0);
    return NOTE_TONES[index % NOTE_TONES.length];
  }
}
