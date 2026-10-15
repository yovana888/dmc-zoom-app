import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

interface RadioOption {
  writeValue(value: string | null): void;
}

type RadioGroupKey = AbstractControl | string;

@Injectable({ providedIn: 'root' })
export class RadioButtonRegistry {
  private readonly groups = new Map<RadioGroupKey, Set<RadioOption>>();

  add(key: RadioGroupKey, option: RadioOption): void {
    const group = this.groups.get(key) ?? new Set<RadioOption>();

    group.add(option);
    this.groups.set(key, group);
  }

  remove(key: RadioGroupKey, option: RadioOption): void {
    const group = this.groups.get(key);

    if (!group) {
      return;
    }

    group.delete(option);

    if (group.size === 0) {
      this.groups.delete(key);
    }
  }

  select(key: RadioGroupKey, value: string): void {
    this.groups.get(key)?.forEach((option): void => option.writeValue(value));
  }
}
