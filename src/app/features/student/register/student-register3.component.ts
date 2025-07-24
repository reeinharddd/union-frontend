import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-student-register3',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule],
  templateUrl: './student-register3.component.html',
})
export class StudentRegister3Component implements OnDestroy {
  registerForm: FormGroup;
  interests: string[] = [];
  newInterest: string = '';
  token: string = '';
  usuario_id: number = 0;
  fullName: string = '';
  email: string = '';
  private queryParamsSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.registerForm = this.fb.group({
      academicProgram: ['', Validators.required],
    });

    // Recibir datos del formulario anterior
    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.usuario_id = params['usuario_id'] || 0;
      this.fullName = params['fullName'];
      this.email = params['email'];

      // Si viene token en query params, guardarlo en localStorage
      if (this.token) {
        localStorage.setItem('registrationToken', this.token);
        localStorage.setItem('registrationUsuarioId', this.usuario_id.toString());
      } else {
        // Si no viene, intentar recuperar de localStorage
        this.token = localStorage.getItem('registrationToken') || '';
        this.usuario_id = parseInt(localStorage.getItem('registrationUsuarioId') || '0');
      }

      // Si no hay fullName/email en params, intentar recuperar de localStorage
      if (!this.fullName || !this.email) {
        const savedData = localStorage.getItem('registrationData');
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          this.fullName = this.fullName || parsedData.fullName || '';
          this.email = this.email || parsedData.email || '';
        }
      }

      // console.log('=== DATOS RECIBIDOS EN FORMULARIO 3 ===');
      // console.log('Token:', this.token);
      // console.log('Usuario ID:', this.usuario_id);
      // console.log('Nombre completo:', this.fullName);
      // console.log('Email:', this.email);

      // Si no hay token, regresar a la página anterior
      if (!this.token) {
        console.error('No se recibió token, regresando a la página anterior');
        this.router.navigate(['/register/estudiante/step2']);
      }
    });
  }

  addInterest() {
    const trimmed = this.newInterest.trim();
    if (trimmed && !this.interests.includes(trimmed)) {
      this.interests.push(trimmed);
      this.newInterest = '';
    }
  }

  removeInterest(tag: string) {
    this.interests = this.interests.filter(i => i !== tag);
  }

  onSubmit() {
    if (this.registerForm.valid && this.token && this.fullName && this.email) {
      // Combinar todos los datos del proceso de registro
      const completeRegistrationData = {
        token: this.token,
        fullName: this.fullName,
        email: this.email,
        academicProgram: this.registerForm.value.academicProgram,
        interests: this.interests, // Se envía siempre, aunque esté vacío
      };

      // console.log('=== DATOS COMPLETOS DE REGISTRO ===');
      // console.log('Token:', this.token);
      // console.log('Datos personales:', { fullName: this.fullName, email: this.email });
      // console.log('Programa académico:', this.registerForm.value.academicProgram);
      // console.log('Intereses:', this.interests);
      // console.log('Datos completos para enviar:', completeRegistrationData);

      // Guardar todos los datos en localStorage para la siguiente página
      localStorage.setItem('completeRegistrationData', JSON.stringify(completeRegistrationData));

      // Navegar a la siguiente página del formulario con todos los datos
      this.router.navigate(['/register/estudiante/step4'], {
        queryParams: {
          token: this.token,
          usuario_id: this.usuario_id,
          fullName: this.fullName,
          email: this.email,
          academicProgram: this.registerForm.value.academicProgram,
          interests: JSON.stringify(this.interests),
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
      console.error('Formulario inválido o faltan datos obligatorios');

      // Verificar qué datos faltan
      if (!this.token) {
        console.error('Falta token - redirigiendo al primer paso');
        this.router.navigate(['/register/estudiante']);
      } else if (!this.fullName || !this.email) {
        console.error('Faltan datos personales - redirigiendo al segundo paso');
        this.router.navigate(['/register/estudiante/step2'], {
          queryParams: { token: this.token },
        });
      } else {
        console.error('Programa académico es requerido');
        alert('Por favor selecciona un programa académico.');
      }
    }
  }

  ngOnDestroy() {
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
  }
}
