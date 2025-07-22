import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-student-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './student-register.component.html'
})
export class StudentRegisterComponent {
  tokenForm: FormGroup;
  router: any;

  constructor(private fb: FormBuilder) {
    this.tokenForm = this.fb.group({
      token: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.tokenForm.valid) {
      const token = this.tokenForm.value.token;
      console.log('Token enviado:', token);
      // Aquí agregas tu lógica
      //this.router.navigate(['/student-register2']);
    }else {
      //this.markFormGroupTouched();
    }
  }
}

