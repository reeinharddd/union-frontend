import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiClientService } from '../../../core/services/base/api-client.service';

@Component({
  selector: 'app-promoter-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register-token.component.html',
})
export class PromotorRegisterComponent {
  tokenForm: FormGroup;
  tieneToken: boolean | null = null; // ✅ Nueva propiedad

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private apiClient: ApiClientService,
  ) {
    this.tokenForm = this.fb.group({
      token: ['', [Validators.required]],
    });
  }

  // ✅ Método para seleccionar si tiene token
  seleccionarOpcion(opcion: boolean) {
    this.tieneToken = opcion;
  }

  onSubmit() {
    if (this.tokenForm.valid) {
      const token = this.tokenForm.value.token;

      this.apiClient.get(`/tokens-iniciales-acceso?token-acceso?token_acceso=${token}`).subscribe({
        next: (response: any) => {
          let tokenEncontrado = null;

          if (Array.isArray(response)) {
            tokenEncontrado = response.find((t: any) => t.token_acceso === token);
          } else if (response && response.token_acceso === token) {
            tokenEncontrado = response;
          }

          if (tokenEncontrado && !tokenEncontrado.usado) {
            this.router.navigate(['/register/promotor/datos-personales'], {
              queryParams: {
                token: token,
                usuario_id: tokenEncontrado.usuario_id,
              },
            });
          } else if (tokenEncontrado && tokenEncontrado.usado) {
            alert('El token ya ha sido usado');
          } else {
            alert('El token no existe en la base de datos');
          }
        },
        error: (error: any) => {
          console.error('Token no encontrado:', error);
          alert('El token no existe en la base de datos');
        },
      });
    } else {
      Object.keys(this.tokenForm.controls).forEach(key => {
        this.tokenForm.get(key)?.markAsTouched();
      });
    }
  }
}
