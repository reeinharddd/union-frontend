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

  // Datos recibidos de los pasos anteriores
  token: string = '';
  usuario_id: number = 0;
  universidad_id: number = 0; // Agregar universidad_id para usar en userData
  fullName: string = '';
  email: string = '';
  academicProgram: string = '';
  interests: string[] = [];

  // Servicios inyectados
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiClient = inject(ApiClientService);

  constructor(private fb: FormBuilder) {
    this.passwordForm = this.fb.group(
      {
        password: [
          '',
          [Validators.required, Validators.minLength(8), this.createPasswordStrengthValidator()],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator },
    );

    // Recibir todos los datos de los pasos anteriores
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.usuario_id = params['usuario_id'] || 0;
      this.universidad_id = params['universidad_id'] || 0;
      this.fullName = params['fullName'];
      this.email = params['email'];
      this.academicProgram = params['academicProgram'];
      this.interests = params['interests'] ? JSON.parse(params['interests']) : [];

      // También intentar recuperar de localStorage si no vienen por params
      if (!this.token) {
        const savedData = localStorage.getItem('completeRegistrationData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          this.token = parsedData.token || '';
          this.usuario_id = parsedData.usuario_id || 0;
          this.universidad_id = parsedData.universidad_id || 0;
          this.fullName = parsedData.fullName || '';
          this.email = parsedData.email || '';
          this.academicProgram = parsedData.academicProgram || '';
          this.interests = parsedData.interests || [];
        }
      }

      console.log('=== DATOS COMPLETOS RECIBIDOS EN STEP 4 ===');
      console.log('Token:', this.token);
      console.log('Usuario ID:', this.usuario_id);
      console.log('Nombre:', this.fullName);
      console.log('Email:', this.email);
      console.log('Programa académico:', this.academicProgram);
      console.log('Intereses:', this.interests);

      // Validar que tenemos los datos necesarios
      if (!this.token || !this.fullName || !this.email) {
        console.error('Faltan datos obligatorios, redirigiendo al inicio');
        this.router.navigate(['/register/estudiante']);
      }
    });
  }

  // Validador personalizado para coincidencia de contrasenas
  passwordMatchValidator(formGroup: FormGroup): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Validador personalizado para fortaleza de contrasena
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

  // Verificar fortaleza de contrasena en tiempo real
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
      console.log('=== INICIANDO REGISTRO COMPLETO ===');

      // Primero buscar el token para obtener el usuario_id
      this.apiClient.get(`/tokens-iniciales-acceso?token_acceso=${this.token}`).subscribe({
        next: (tokenSearchResponse: any) => {
          console.log('Respuesta de búsqueda del token:', tokenSearchResponse);

          let tokenEncontrado = null;
          if (Array.isArray(tokenSearchResponse)) {
            tokenEncontrado = tokenSearchResponse.find((t: any) => t.token_acceso === this.token);
          } else if (tokenSearchResponse && tokenSearchResponse.token_acceso === this.token) {
            tokenEncontrado = tokenSearchResponse;
          }

          if (tokenEncontrado && tokenEncontrado.usuario_id) {
            // Datos para actualizar el usuario existente
            const userData = {
              nombre: this.fullName,
              correo: this.email,
              contrasena: this.passwordForm.value.password,
              // Agregar otros campos que el estudiante pueda completar
              // carrera se podría guardar en biografia o en un campo dedicado
              biografia: this.academicProgram, // Temporalmente guardar la carrera aquí
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
                      alert(
                        'Usuario actualizado, pero hubo un problema con el token. Contacta al administrador.',
                      );
                      this.router.navigate(['/login']);
                    },
                  });
              },
              error: (userError: any) => {
                console.error('Error al actualizar el usuario:', userError);

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
            alert('Token inválido. Por favor contacta al administrador.');
            this.router.navigate(['/register/estudiante']);
          }
        },
        error: (tokenSearchError: any) => {
          console.error('Error al buscar el token:', tokenSearchError);
          alert('Error al validar el token. Por favor intenta nuevamente.');
        },
      });
    } else {
      this.passwordForm.markAllAsTouched();
      console.error('Formulario de contrasena inválido');
    }
  }
}
