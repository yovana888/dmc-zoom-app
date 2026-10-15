import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  forwardRef,
  inject,
  Injector,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { NumberValuesEnum } from '@core/enums/list/number.enum';
import { getControlErrorMessage } from '@shared/helpers/get-errors-label';
import { merge } from 'rxjs';
import { InputIcon, InputType } from './input.type';

let nextFieldId = 0;

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor, OnInit {
  readonly label = input('');
  readonly placeholder = input('');
  readonly required = input(false);
  readonly type = input<InputType>('text');
  readonly icon = input<InputIcon>('none');
  readonly iconName = input('');
  readonly maxLength = input<number | null>(null);

  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly statusTick = signal(0);
  private control: AbstractControl | null = null;
  private onChange: (value: string) => void = (): void => undefined;
  private onTouched: () => void = (): void => undefined;

  protected readonly value = signal('');
  protected readonly disabled = signal(false);
  protected readonly fieldId = InputComponent.createFieldId();
  protected readonly helperId = `${this.fieldId}-helper`;

  protected readonly errorMessage = computed((): string | null => {
    this.statusTick();

    if (!this.control || !this.hasVisibleError(this.control)) {
      return null;
    }

    return getControlErrorMessage(this.control, this.label() || null);
  });

  protected readonly iconColor = computed((): string =>
    this.errorMessage() ? 'var(--light-system-error-error)' : 'var(--light-greyscale-icons)',
  );

  ngOnInit(): void {
    const ngControl = this.injector.get(NgControl, null, { optional: true, self: true });
    this.control = ngControl?.control ?? null;

    if (!this.control) {
      return;
    }

    merge(this.control.valueChanges, this.control.statusChanges)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.refreshStatus());
  }

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(onChange: (value: string) => void): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected onInput(event: Event): void {
    const nextValue = this.readValue(event);

    if (nextValue === null) {
      return;
    }

    this.value.set(nextValue);
    this.onChange(nextValue);
  }

  protected onBlur(): void {
    this.onTouched();
    this.refreshStatus();
  }

  private hasVisibleError(control: AbstractControl): boolean {
    return control.invalid && (control.touched || control.dirty);
  }

  private refreshStatus(): void {
    this.statusTick.update((tick): number => tick + NumberValuesEnum.ONE);
  }

  private readValue(event: Event): string | null {
    const target = event.target;

    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
      return target.value;
    }

    return null;
  }

  private static createFieldId(): string {
    nextFieldId += NumberValuesEnum.ONE;

    return `field-${nextFieldId}`;
  }
}
