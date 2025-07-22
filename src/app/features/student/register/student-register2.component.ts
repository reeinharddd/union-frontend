import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({    
      standalone: true,
imports: [CommonModule, ReactiveFormsModule, RouterLink],
  selector: 'app-student-register2',
  templateUrl: './student-register2.component.html',
})
export class StudentRegister2Component {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      termsAccepted: [false, Validators.requiredTrue]
    }, { validator: this.passwordMatchValidator });
  }

  // Validador personalizado para contraseñas
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      
      // Simulación de llamada API (reemplazar con tu lógica real)
      setTimeout(() => {
        console.log('Datos enviados:', this.registerForm.value);
        this.isLoading = false;
        
        // Redirigir al dashboard después de registro exitoso
        //this.router.navigate(['/student/dashboard']);
      }, 1500);
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}