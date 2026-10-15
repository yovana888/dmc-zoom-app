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
import { AvatarType } from '@shared/components/atoms/avatar/avatar.type';
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

  protected readonly avatarType = computed((): AvatarType =>
    this.avatarImage() ? 'photo' : 'empty',
  );

  ngOnInit(): void {
    this.time.set(this.formatTime(new Date()));
  }

  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(NumberValuesEnum.TWO, '0');
    const minutes = date.getMinutes().toString().padStart(NumberValuesEnum.TWO, '0');

    return `${hours}:${minutes}`;
  }
}
