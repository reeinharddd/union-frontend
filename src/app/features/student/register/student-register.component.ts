import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiClientService } from '../../../core/services/base/api-client.service';

@Component({
  selector: 'app-student-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './student-register.component.html',
})
export class StudentRegisterComponent {
  tokenForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiClient: ApiClientService,
  ) {
    this.tokenForm = this.fb.group({
      token: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.tokenForm.valid) {
      const token = this.tokenForm.value.token;
      // console.log('=== DEBUG INFO ===');
      // console.log('Token del formulario:', token);
      // console.log('URL completa:', `/tokens-iniciales-acceso?token_acceso=${token}`);
      // console.log('Formulario completo:', this.tokenForm.value);

      // Paso 1: Verificar que el token específico existe en la BD
      this.apiClient.get(`/tokens-iniciales-acceso/token-acceso?token_acceso=${token}`).subscribe({
        next: (response: any) => {
          // console.log('Respuesta del servidor:', response);

          // El backend debería retornar solo el token específico o un array con 1 elemento
          let tokenEncontrado = null;

          if (Array.isArray(response)) {
            // Si es array, buscar el token específico
            tokenEncontrado = response.find((t: any) => t.token_acceso === token);
          } else if (response && response.token_acceso === token) {
            // Si es un objeto único
            tokenEncontrado = response;
          }

          // console.info('Token específico encontrado:', tokenEncontrado);

          // Verificar si el token existe y no ha sido usado
          if (tokenEncontrado && !tokenEncontrado.usado) {
            // console.info('Token válido, navegando a la siguiente página');

            // Navegar a la siguiente parte del formulario con el token y el usuario_id
            this.router.navigate(['/register/estudiante/step2'], {
              queryParams: {
                token: token,
                usuario_id: tokenEncontrado.usuario_id,
              },
            });
          } else if (tokenEncontrado && tokenEncontrado.usado) {
            console.error('Token ya usado');
            alert('El token ya ha sido usado');
          } else {
            console.error('Token no encontrado');
            alert('El token no existe en la base de datos');
          }
        },
        error: (error: any) => {
          console.error('Token no encontrado:', error);
          alert('El token no existe en la base de datos');
        },
      });
    } else {
      console.error('Formulario inválido');
      // Marcar campos como touched para mostrar errores
      Object.keys(this.tokenForm.controls).forEach(key => {
        this.tokenForm.get(key)?.markAsTouched();
      });
    }
  }
}
