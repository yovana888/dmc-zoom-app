import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  phosphorCheckSquare,
  phosphorListBullets,
  phosphorQuestion,
  phosphorSparkle,
} from '@ng-icons/phosphor-icons/regular';
import { ModalMessageComponent } from '@shared/components/molecules/modal-message/modal-message.component';
import { SummaryExpressResponse } from '../../infrastructure/domain/interfaces/summary.interface';

export const SUMMARY_MODAL_ID = 'summary-express';

@Component({
  selector: 'app-summary-modal',
  templateUrl: './summary-modal.component.html',
  styleUrl: './summary-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModalMessageComponent, NgIcon],
  providers: [
    provideIcons({ phosphorSparkle, phosphorListBullets, phosphorCheckSquare, phosphorQuestion }),
  ],
})
export class SummaryModalComponent {
  readonly summary = input<SummaryExpressResponse | null>(null);

  protected readonly modalId = SUMMARY_MODAL_ID;
}
