import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth/auth.service';
import { ToastService } from '@app/core/services/ui/toast.service';
import { LoadingService } from '@app/core/services/ui/loading.service';
import { RegisterRequest } from '@app/core/models/auth/auth.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly loadingService = inject(LoadingService);
  private readonly fb = inject(FormBuilder);

  readonly isLoading = this.loadingService.isLoading;
  readonly registerError = signal<string | null>(null);

  readonly registerForm: FormGroup = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      name: [''],
      address: [''],
    },
    { validators: this.passwordMatchValidator },
  );

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.registerError.set(null);
      const { ...userData } = this.registerForm.value;
      const registerData: RegisterRequest = userData;

      this.authService.register(registerData).subscribe({
        next: () => {
          this.toastService.showSuccess('¡Cuenta creada exitosamente! Bienvenido a Union.');
          this.authService.navigateByRole();
        },
        error: error => {
          const errorMessage =
            error.error?.message || 'Error al crear la cuenta. Por favor intenta de nuevo.';
          this.registerError.set(errorMessage);
          this.toastService.showError(errorMessage);
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      this.registerForm.get(key)?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string | null {
    const field = this.registerForm.get(fieldName);
    if (field?.touched && field?.errors) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} es requerido`;
      if (field.errors['email']) return 'Email inválido';
      if (field.errors['minlength'])
        return `${this.getFieldLabel(fieldName)} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['passwordMismatch']) return 'Las contraseñas no coinciden';
    }
    return null;
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      email: 'Email',
      password: 'Contraseña',
      confirmPassword: 'Confirmar contraseña',
      name: 'Nombre',
      address: 'Dirección',
    };
    return labels[fieldName] || fieldName;
  }
}
