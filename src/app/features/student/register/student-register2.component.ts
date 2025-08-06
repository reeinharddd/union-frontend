import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiClientService } from '../../../core/services/base/api-client.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule],
  selector: 'app-student-register2',
  templateUrl: './student-register2.component.html',
})
export class StudentRegister2Component {
  registerForm: FormGroup;
  isLoading = false;
  token: string = '';
  usuario_id: number = 0;
  passwordStrength = 0;
  hasUpperCase = false;
  hasLowerCase = false;
  hasNumber = false;
  hasSpecialChar = false;

  // Servicios inyectados
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiClient = inject(ApiClientService);

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
    const password = this.registerForm.get('password')?.value;
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

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group(
      {
        password: [
          '',
          [Validators.required, Validators.minLength(8), this.createPasswordStrengthValidator()],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator },
    );

    // Recibir el token y usuario_id del formulario anterior
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.usuario_id = params['usuario_id'] || 0;
      // console.log('Token recibido en formulario 2:', this.token);
      // console.log('Usuario ID recibido en formulario 2:', this.usuario_id);

      // Si no hay token, redirigir al primer paso
      if (!this.token) {
        console.error('No se recibió token, redirigiendo al primer paso');
        this.router.navigate(['/register/estudiante/step1']);
      }
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      console.log('=== INICIANDO REGISTRO COMPLETO ===');

      // Primero buscar el token para obtener el usuario_id
      this.apiClient.get(`/tokens-iniciales-acceso/token-acceso?token_acceso=${this.token}`).subscribe({
        next: (tokenSearchResponse: any) => {
          console.log('Respuesta de búsqueda del token:', tokenSearchResponse);

          let tokenEncontrado = null;
          if (Array.isArray(tokenSearchResponse)) {
            tokenEncontrado = tokenSearchResponse.find((t: any) => t.token_acceso === this.token);
          } else if (tokenSearchResponse && tokenSearchResponse.token_acceso === this.token) {
            tokenEncontrado = tokenSearchResponse;
          }

          if (tokenEncontrado && tokenEncontrado.usuario_id) {
            // Datos para actualizar el usuario existente solo con la contraseña
            const userData = {
              contrasena: this.registerForm.value.password,
            };

            console.log(
              'Datos a actualizar para usuario ID:',
              tokenEncontrado.usuario_id,
              userData,
            );

            // Actualizar el usuario existente
            this.apiClient.put(`/usuarios/${tokenEncontrado.usuario_id}`, userData).subscribe({
              next: (userResponse: any) => {
                console.info('Usuario actualizado exitosamente:', userResponse);

                // Marcar el token como usado
                const updateTokenData = { usado: true };

                this.apiClient
                  .put(`/tokens-iniciales-acceso/${tokenEncontrado.id}`, updateTokenData)
                  .subscribe({
                    next: (tokenResponse: any) => {
                      console.info('Token marcado como usado:', tokenResponse);
                      this.isLoading = false;

                      // Limpiar localStorage
                      localStorage.removeItem('registrationToken');
                      localStorage.removeItem('registrationData');
                      localStorage.removeItem('completeRegistrationData');
                      localStorage.removeItem('registrationUsuarioId');

                      // Mostrar mensaje de éxito y redirigir
                      alert('¡Registro completado exitosamente! Ya puedes iniciar sesión.');
                      this.router.navigate(['/login']);
                    },
                    error: (tokenError: any) => {
                      console.error('Error al actualizar el token:', tokenError);
                      this.isLoading = false;
                      alert(
                        'Usuario actualizado, pero hubo un problema con el token. Contacta al administrador.',
                      );
                      this.router.navigate(['/login']);
                    },
                  });
              },
              error: (userError: any) => {
                console.error('Error al actualizar el usuario:', userError);
                this.isLoading = false;

                // Manejar diferentes tipos de errores
                if (userError.status === 409) {
                  alert('Error: El correo electrónico ya está registrado.');
                } else if (userError.status === 400) {
                  alert('Error: Datos inválidos. Por favor verifica la información.');
                } else if (userError.status === 404) {
                  alert('Error: Usuario no encontrado. Contacta al administrador.');
                } else {
                  alert('Error en el servidor. Por favor intenta nuevamente.');
                }
              },
            });
          } else {
            console.error('Token no encontrado o sin usuario_id asociado');
            this.isLoading = false;
            alert('Token inválido. Por favor contacta al administrador.');
            this.router.navigate(['/register/estudiante']);
          }
        },
        error: (tokenSearchError: any) => {
          console.error('Error al buscar el token:', tokenSearchError);
          this.isLoading = false;
          alert('Error al validar el token. Por favor intenta nuevamente.');
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
      console.error('Formulario inválido');
    }
  }
}
