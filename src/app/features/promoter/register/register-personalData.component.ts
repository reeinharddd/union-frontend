import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '@app/core/services/user/user.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  selector: 'app-promoter-register-personal-data',
  templateUrl: './register-personalData.component.html',
})
export class PromotorRegister2Component {
  registerForm: FormGroup;
  token: string = '';
  usuario_id: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService, // Importa el servicio de usuario
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.usuario_id = params['usuario_id'];

      if (!this.token || !this.usuario_id) {
        this.router.navigate(['/register/promotor']); // Redirige si falta data
      }
    });
  }

  onSubmit() {
    if (this.registerForm.valid && this.token && this.usuario_id) {
      const userData = {
        nombre: this.registerForm.value.nombre,
        correo: this.registerForm.value.correo,
        contrasena: this.registerForm.value.contrasena,
      };

      // Actualiza el usuario usando el token como auth
      this.userService.update(this.usuario_id, userData).subscribe({
        next: response => {
          console.log('Usuario actualizado:', response);
          this.router.navigate(['/login']); // Redirige al login después de registrar
        },
        error: error => {
          console.error('Error al actualizar el usuario:', error);
          alert('Error al registrar el usuario. Inténtalo de nuevo.');
        },
      });
    } else {
      alert('Por favor, completa todos los campos correctamente.');
    }
  }
}
