import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { WebchatStore } from '@modules/assistant/infrastructure/store/webchat-store';
import { provideIcons } from '@ng-icons/core';
import { phosphorCopy, phosphorPaperPlaneTilt } from '@ng-icons/phosphor-icons/regular';
import { ButtonIconComponent } from '@shared/components/atoms/button-icon/button-icon.component';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonIconComponent],
  providers: [provideIcons({ phosphorCopy, phosphorPaperPlaneTilt })],
})
export class ChatInputComponent {
  readonly handleSendMessage = output<string>();

  protected readonly text = signal('');
  private readonly webchatStore = inject(WebchatStore);
  protected readonly isLoading = this.webchatStore.isLoading;

  protected onInput(event: Event): void {
    const target = event.target;

    if (target instanceof HTMLInputElement) {
      this.text.set(target.value);
    }
  }

  protected onEnter(event: Event): void {
    event.preventDefault();
    this.emitMessage();
  }

  protected emitMessage(): void {
    const value = this.text().trim();

    if (!value) {
      return;
    }

    this.handleSendMessage.emit(value);
    this.text.set('');
  }
}
