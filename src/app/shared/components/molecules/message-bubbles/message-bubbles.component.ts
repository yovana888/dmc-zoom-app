import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostBinding,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { NumberValuesEnum } from '@core/enums/list/number.enum';
import { AvatarComponent } from '@shared/components/atoms/avatar/avatar.component';
import { MessageSender } from './message-bubbles.type';

const AGENT_IMAGE = 'logo/dmc-ia.svg';

@Component({
  selector: 'app-message-bubbles',
  templateUrl: 'message-bubbles.component.html',
  styleUrl: 'message-bubbles.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AvatarComponent],
})
export class MessageBubblesComponent implements OnInit {
  readonly sender = input<MessageSender>('agent');
  readonly image = input('');
  readonly showTime = input(true);
  readonly username = input('');

  protected readonly time = signal('');

  @HostBinding('attr.data-sender')
  protected get senderAttribute(): MessageSender {
    return this.sender();
  }

  protected readonly avatarImage = computed((): string => {
    if (this.image()) {
      return this.image();
    }

    return this.sender() === 'agent' ? AGENT_IMAGE : '';
  });

  protected readonly userInitials = computed((): string => this.resolveInitials(this.username()));

  ngOnInit(): void {
    this.time.set(this.formatTime(new Date()));
  }

  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(NumberValuesEnum.TWO, '0');
    const minutes = date.getMinutes().toString().padStart(NumberValuesEnum.TWO, '0');

    return `${hours}:${minutes}`;
  }

  private resolveInitials(username: string): string {
    const parts = username
      .trim()
      .split(/\s+/)
      .filter((part) => part.length > 0);

    if (parts.length >= NumberValuesEnum.TWO) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }

    return (parts[0] ?? '').slice(0, NumberValuesEnum.TWO).toUpperCase();
  }
}
