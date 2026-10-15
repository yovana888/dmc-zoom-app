import { ChangeDetectionStrategy, Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { phosphorCheck } from '@ng-icons/phosphor-icons/regular';
import { NumberValuesEnum } from '@core/enums/list/number.enum';

let nextFieldId = 0;

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon],
  providers: [
    provideIcons({ phosphorCheck }),
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
})
export class CheckboxComponent implements ControlValueAccessor {
  readonly label = input('');

  protected readonly checked = signal(false);
  protected readonly disabled = signal(false);
  protected readonly fieldId = CheckboxComponent.createFieldId();

  private onChange: (value: boolean) => void = (): void => undefined;
  private onTouched: () => void = (): void => undefined;

  writeValue(value: boolean | null): void {
    this.checked.set(!!value);
  }

  registerOnChange(onChange: (value: boolean) => void): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected onToggle(event: Event): void {
    const nextValue = this.readChecked(event);

    if (nextValue === null) {
      return;
    }

    this.checked.set(nextValue);
    this.onChange(nextValue);
  }

  protected onBlur(): void {
    this.onTouched();
  }

  private readChecked(event: Event): boolean | null {
    const target = event.target;

    if (target instanceof HTMLInputElement) {
      return target.checked;
    }

    return null;
  }

  private static createFieldId(): string {
    nextFieldId += NumberValuesEnum.ONE;

    return `checkbox-${nextFieldId}`;
  }
}
