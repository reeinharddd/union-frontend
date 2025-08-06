import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiClientService } from '@app/core/services/base/api-client.service';
import { UserService } from '@app/core/services/user/user.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  selector: 'app-adminUni-register-personal-data',
  templateUrl: './register-personalData.component.html',
})
export class AdminUniRegister2Component {
  registerForm: FormGroup;
  token: string = '';
  usuario_id: number | null = null;
  tokenId: number | null = null; // Agregamos esta variable para almacenar el ID del token

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private apiClient: ApiClientService, // Inyectamos el ApiClientService
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.usuario_id = params['usuario_id'];
      this.tokenId = params['token_id']; // Asumimos que también recibes el ID del token

      // if (!this.token || !this.usuario_id || !this.tokenId) {
      //   this.router.navigate(['/register/promotor']);
      // }
    });
  }

  onSubmit() {
    if (this.registerForm.valid && this.token && this.usuario_id && this.tokenId) {
      const userData = {
        nombre: this.registerForm.value.nombre,
        correo: this.registerForm.value.correo,
        contrasena: this.registerForm.value.contrasena,
      };

      // Actualiza el usuario
      this.userService.update(this.usuario_id, userData).subscribe({
        next: userResponse => {
          console.log('Usuario actualizado:', userResponse);

          // Preparamos los datos para actualizar el token
          const updateTokenData = {
            usado: true,
            // Puedes agregar más campos si es necesario
          };

          // Actualizamos el token usando el endpoint que mencionaste
          this.apiClient
            .put(`/tokens-iniciales-acceso/${this.tokenId}`, updateTokenData)
            .subscribe({
              next: (tokenResponse: any) => {
                console.info('Token marcado como usado:', tokenResponse);
                this.router.navigate(['/login']);
              },
              error: tokenError => {
                console.error('Error al actualizar el token:', tokenError);
                // Aunque falló la actualización del token, el usuario ya está registrado
                this.router.navigate(['/login']);
              },
            });
        },
        error: userError => {
          console.error('Error al actualizar el usuario:', userError);
          alert('Error al registrar el usuario. Inténtalo de nuevo.');
        },
      });
    } else {
      alert('Por favor, completa todos los campos correctamente.');
    }
  }
}
