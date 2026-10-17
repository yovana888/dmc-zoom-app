import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { phosphorX } from '@ng-icons/phosphor-icons/regular';
import { ButtonComponent } from '@shared/components/atoms/button/button.component';
import { ModalMessageService } from '@shared/services/modal-message/modal-message.service';
import { ModalMessageSize } from './modal-message.type';

@Component({
  selector: 'app-modal-message',
  templateUrl: 'modal-message.component.html',
  styleUrl: 'modal-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, NgIcon],
  providers: [provideIcons({ phosphorX })],
})
export class ModalMessageComponent implements AfterViewInit {
  readonly id = input('modal-message');
  readonly size = input<ModalMessageSize>('md');
  readonly nameButtonClose = input('');
  readonly nameButtonAction = input('Entendido');
  readonly title = input('');
  readonly scrollable = input(false);

  readonly clickButtonAction = output<void>();
  readonly clickButtonClose = output<void>();

  private readonly modalMessageService = inject(ModalMessageService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly opened = signal(false);
  protected readonly titleId = computed((): string => `${this.id()}-title`);
  protected readonly bodyId = computed((): string => `${this.id()}-body`);

  ngAfterViewInit(): void {
    this.modalMessageService.activeModal$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((activeId) => this.syncOpen(activeId === this.id()));

    this.destroyRef.onDestroy(() => {
      if (this.opened()) {
        document.body.classList.remove('modal-open');
      }
    });
  }

  protected onClose(): void {
    this.clickButtonClose.emit();
    this.modalMessageService.close();
  }

  protected onAction(): void {
    this.clickButtonAction.emit();
  }

  private syncOpen(isOpen: boolean): void {
    this.opened.set(isOpen);
    document.body.classList.toggle('modal-open', isOpen);
  }
}
