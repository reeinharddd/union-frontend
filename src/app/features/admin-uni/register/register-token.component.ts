import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiClientService } from '../../../core/services/base/api-client.service';

@Component({
  selector: 'app-adminUni-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register-token.component.html',
})
export class AdminUniRegisterComponent {
  tokenForm: FormGroup;
  tieneToken: boolean | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiClient: ApiClientService,
  ) {
    this.tokenForm = this.fb.group({
      token: ['', [Validators.required]],
    });
  }

  seleccionarOpcion(opcion: boolean) {
    this.tieneToken = opcion;
  }

  onSubmit() {
    if (this.tokenForm.invalid || this.isLoading) return;

    this.isLoading = true;
    const token = this.tokenForm.value.token;

    this.apiClient.get(`/tokens-iniciales-acceso?token_acceso=${token}`).subscribe({
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
          this.router.navigate(['/register/institucion/datos-personales'], {
            queryParams: {
              token_id: tokenEncontrado.id,
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
      error: error => {
        this.isLoading = false;
        alert(error.status === 404 ? 'Token no existe' : 'Error del servidor');
      },
    });
  }
}
