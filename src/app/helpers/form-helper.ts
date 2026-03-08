import { FormGroup } from '@angular/forms';

export function isInvalid(form: FormGroup, controlName: string): boolean {
  const control = form.get(controlName);
  return !!(control?.invalid && (control?.dirty || control?.touched));
}

export function getError(form: FormGroup, controlName: string): string {
  const control = form.get(controlName);

  if (!control || !control.errors) return '';

  if (control.errors['required']) {
    return 'Este campo es requerido';
  }

  return '';
}
