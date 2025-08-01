import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  selector: 'app-student-register2',
  templateUrl: './student-register2.component.html',
})
export class StudentRegister2Component {
  registerForm: FormGroup;
  isLoading = false;
  token: string = '';
  usuario_id: number = 0;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
    });

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

      // Preparar datos completos: token + datos básicos del formulario
      const completeFormData = {
        token: this.token,
        usuario_id: this.usuario_id,
        fullName: this.registerForm.value.fullName,
        correo: this.registerForm.value.correo,
      };

      // console.log('=== DATOS DEL FORMULARIO 2 ===');
      // console.log('Token:', this.token);
      // console.log('Usuario ID:', this.usuario_id);
      // console.log('Nombre completo:', this.registerForm.value.fullName);
      // console.log('Email:', this.registerForm.value.email);
      // console.log('Datos completos a enviar:', completeFormData);

      // Simular procesamiento
      setTimeout(() => {
        this.isLoading = false;

        // Navegar al siguiente paso con token + usuario_id + datos básicos
        this.router.navigate(['/register/estudiante/step3'], {
          queryParams: {
            token: this.token,
            usuario_id: this.usuario_id,
            fullName: completeFormData.fullName,
            correo: completeFormData.correo,
          },
        });
      }, 1500);
    } else {
      this.registerForm.markAllAsTouched();
      console.error('Formulario inválido');
    }
  }
}
