import { Injectable, signal } from '@angular/core';
import { NumberValuesEnum } from '@core/enums/list/number.enum';
import { Note } from '../domain/entities/note.entity';

@Injectable({ providedIn: 'root' })
export class NotesStore {
  readonly notes = signal<Note[]>([]);

  add(text: string): void {
    const note: Note = {
      text,
      uuid: crypto.randomUUID(),
      hour: this.currentHour(),
    };
    this.notes.update((current) => [...current, note]);
  }

  remove(uuid: string): void {
    this.notes.update((current) => current.filter((note) => note.uuid !== uuid));
  }

  private currentHour(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(NumberValuesEnum.TWO, '0');
    const minutes = now.getMinutes().toString().padStart(NumberValuesEnum.TWO, '0');
    return `${hours}:${minutes}`;
  }
}
