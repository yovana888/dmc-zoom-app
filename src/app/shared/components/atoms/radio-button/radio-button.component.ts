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
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NgControl,
} from '@angular/forms';
import { NumberValuesEnum } from '@core/enums/list/number.enum';
import { RadioButtonRegistry } from './radio-button.registry';

let nextFieldId = 0;

@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrl: './radio-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButtonComponent),
      multi: true,
    },
  ],
})
export class RadioButtonComponent implements ControlValueAccessor, OnInit {
  readonly label = input('');
  readonly name = input.required<string>();
  readonly value = input.required<string>();

  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly registry = inject(RadioButtonRegistry);
  private readonly selected = signal<string | null>(null);
  private groupKey: AbstractControl | string = '';

  protected readonly disabled = signal(false);
  protected readonly fieldId = RadioButtonComponent.createFieldId();
  protected readonly checked = computed((): boolean => this.selected() === this.value());

  private onChange: (value: string) => void = (): void => undefined;
  private onTouched: () => void = (): void => undefined;

  ngOnInit(): void {
    const ngControl = this.injector.get(NgControl, null, { optional: true, self: true });

    this.groupKey = ngControl?.control ?? this.name();
    this.registry.add(this.groupKey, this);
    this.destroyRef.onDestroy(() => this.registry.remove(this.groupKey, this));
  }

  writeValue(value: string | null): void {
    this.selected.set(value);
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

  protected onSelect(): void {
    this.registry.select(this.groupKey, this.value());
    this.onChange(this.value());
  }

  protected onBlur(): void {
    this.onTouched();
  }

  private static createFieldId(): string {
    nextFieldId += NumberValuesEnum.ONE;

    return `radio-${nextFieldId}`;
  }
}
