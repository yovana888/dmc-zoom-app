import { AbstractControl } from '@angular/forms';
import { ValidateKey } from '@core/enums/modules/validators.enum';

interface ControlErrorDetail {
  requiredLength?: number;
  min?: number;
  max?: number;
  lengthExpected?: number;
}

type ErrorMessageBuilder = (fieldName: string, error: ControlErrorDetail) => string | null;

const ERROR_MESSAGE_BY_KEY: Partial<Record<ValidateKey, ErrorMessageBuilder>> = {
  [ValidateKey.MIN_LENGTH_CUSTOM]: (fieldName, error): string | null =>
    error.requiredLength
      ? `${fieldName} debe tener al menos ${error.requiredLength} caracteres`
      : null,
  [ValidateKey.MAX_LENGTH_CUSTOM]: (fieldName, error): string | null =>
    error.requiredLength
      ? `${fieldName} debe tener como máximo ${error.requiredLength} caracteres`
      : null,
  [ValidateKey.MIN]: (fieldName, error): string | null =>
    error.min !== undefined ? `${fieldName} debe ser mayor o igual a ${error.min}` : null,
  [ValidateKey.MAX]: (fieldName, error): string | null =>
    error.max !== undefined ? `${fieldName} debe ser menor o igual a ${error.max}` : null,
  [ValidateKey.MIN_MAX_RANGE]: (fieldName, error): string | null =>
    error.min !== undefined ? `${fieldName} debe ser mayor o igual a ${error.min}` : null,
  [ValidateKey.PHONE_COUNTRY_PATTERN]: (fieldName, error): string | null =>
    error.lengthExpected !== undefined
      ? `${fieldName} debe tener ${error.lengthExpected} dígitos`
      : null,
};

export function getControlErrorMessage(
  control: AbstractControl | null,
  label: string | null = null,
): string | null {
  if (!control?.errors) {
    return null;
  }

  const fieldName = label?.replace('*', '') || 'Este campo';
  const [errorKey] = Object.keys(control.errors) as ValidateKey[];

  if (!errorKey) {
    return null;
  }

  const detail = control.errors[errorKey] as ControlErrorDetail;
  const message = ERROR_MESSAGE_BY_KEY[errorKey]?.(fieldName, detail);

  return message ?? `${fieldName} es inválido`;
}
