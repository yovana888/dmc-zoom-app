import {
  Injectable,
  createComponent,
  EnvironmentInjector,
  ApplicationRef,
  ComponentRef,
  inject,
  DOCUMENT,
} from '@angular/core';
import { ModalAlertComponent } from '@shared/components/molecules/modal-alert/modal-alert.component';
import { ModalAlertData } from '@shared/components/molecules/modal-alert/modal-alert.interface';

@Injectable({ providedIn: 'root' })
export class ModalAlertService {
  private componentRef: ComponentRef<ModalAlertComponent> | null = null;

  private document = inject(DOCUMENT);
  private appRef = inject(ApplicationRef);
  private injector = inject(EnvironmentInjector);

  openModal(data: ModalAlertData): void {
    this.componentRef = createComponent(ModalAlertComponent, {
      environmentInjector: this.injector,
    });

    this.componentRef.setInput('modalAlertData', data);

    this.appRef.attachView(this.componentRef.hostView);
    // eslint-disable-next-line
    const domElem = (this.componentRef.hostView as any).rootNodes[0] as HTMLElement;
    this.document.body.appendChild(domElem);
  }

  closeModal(): void {
    if (this.componentRef) {
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }
}
