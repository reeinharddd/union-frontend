import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoginRequest } from '@app/core/models/auth/auth.interface';
import { AuthService } from '@app/core/services/auth/auth.service';
import { LoadingService } from '@app/core/services/ui/loading.service';
import { ToastService } from '@app/core/services/ui/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly loadingService = inject(LoadingService);
  private readonly fb = inject(FormBuilder);

  readonly isLoading = this.loadingService.isLoading;
  readonly loginError = signal<string | null>(null);

  readonly loginForm: FormGroup = this.fb.group({
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loginError.set(null);
      const credentials: LoginRequest = this.loginForm.value;

      console.log('Attempting login with:', credentials);

      this.authService.login(credentials).subscribe({
        next: response => {
          console.log('Login successful:', response);
          this.toastService.showSuccess('¡Bienvenido de nuevo!');

          // Pequeño delay para asegurar que todo se configure correctamente
          setTimeout(() => {
            this.authService.navigateByRole();
          }, 100);
        },
        error: error => {
          console.error('Login failed:', error);
          this.loginError.set('Credenciales inválidas. Por favor intenta de nuevo.');
          this.toastService.showError('Error al iniciar sesión');
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string | null {
    const field = this.loginForm.get(fieldName);
    if (field?.touched && field?.errors) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['correo']) return 'Email inválido';
      if (field.errors['minlength'])
        return `${fieldName} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
    }
    return null;
  }
}
