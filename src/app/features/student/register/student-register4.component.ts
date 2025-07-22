import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-register4',
  standalone: true,
  templateUrl: './student-register4.component.html',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule],
})
export class StudentRegister4Component {
  passwordForm: FormGroup;
  passwordStrength = 0;
  hasUpperCase = false;
  hasLowerCase = false;
  hasNumber = false;
  hasSpecialChar = false;

  constructor(
    private fb: FormBuilder
  ) {
    this.passwordForm = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.createPasswordStrengthValidator()
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  // Validador personalizado para coincidencia de contraseñas
  passwordMatchValidator(formGroup: FormGroup): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Validador personalizado para fortaleza de contraseña
  createPasswordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumber = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      const valid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
      return !valid ? { strength: true } : null;
    };
  }

  // Verificar fortaleza de contraseña en tiempo real
  checkPasswordStrength() {
    const password = this.passwordForm.get('password')?.value;
    if (!password) {
      this.passwordStrength = 0;
      return;
    }

    // Longitud mínima
    this.passwordStrength = password.length >= 8 ? 1 : 0;

    // Caracteres requeridos
    this.hasUpperCase = /[A-Z]/.test(password);
    this.hasLowerCase = /[a-z]/.test(password);
    this.hasNumber = /[0-9]/.test(password);
    this.hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      // Aquí iría la lógica para registrar la contraseña
      console.log('Contraseña registrada:', this.passwordForm.value);
      
      // Redirigir al dashboard o siguiente paso
      // this.router.navigate(['/student/dashboard']);
    } else {
      this.passwordForm.markAllAsTouched();
    }
  }
}