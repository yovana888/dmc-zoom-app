import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { phosphorX } from '@ng-icons/phosphor-icons/regular';
import { Router } from '@angular/router';
import { ButtonComponent } from '@shared/components/atoms/button/button.component';
import { ModalAlertService } from '@shared/services/modal-alert/modal-alert.service';
import { ModalAlertData } from './modal-alert.interface';

@Component({
  selector: 'app-modal-alert',
  templateUrl: 'modal-alert.component.html',
  styleUrl: 'modal-alert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent, NgIcon],
  providers: [provideIcons({ phosphorX })],
})
export class ModalAlertComponent implements OnInit, OnDestroy {
  readonly modalAlertData = input<ModalAlertData | null>(null);

  private readonly modalAlertService = inject(ModalAlertService);
  private readonly router = inject(Router);

  protected readonly buttonLabel = computed(
    (): string => this.modalAlertData()?.nameButton || 'Entendido',
  );

  protected readonly image = computed((): string => this.modalAlertData()?.pathImage ?? '');

  ngOnInit(): void {
    document.body.classList.add('modal-open');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('modal-open');
  }

  protected handleCloseModal(): void {
    const pathRedirect = this.modalAlertData()?.pathRedirect;

    if (pathRedirect) {
      void this.router.navigateByUrl(pathRedirect);
    }

    this.modalAlertService.closeModal();
  }
}
