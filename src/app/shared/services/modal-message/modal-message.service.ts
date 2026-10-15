import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModalMessageService {
  private activeModalSubject = new BehaviorSubject<string | null>(null);
  activeModal$ = this.activeModalSubject.asObservable();

  /**
   * @param id : ID to modal to multiple modal in on the same page
   */
  open(id: string): void {
    this.activeModalSubject.next(id);
  }

  close(): void {
    this.activeModalSubject.next(null);
  }
}
