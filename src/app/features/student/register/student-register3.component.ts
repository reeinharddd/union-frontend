import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-student-register3',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule],
  templateUrl: './student-register3.component.html'
})
export class StudentRegister3Component {
  registerForm: FormGroup;
  interests: string[] = [];
  newInterest: string = '';

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      academicProgram: ['', Validators.required]
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
    if (this.registerForm.valid) {
      const data = {
        academicProgram: this.registerForm.value.academicProgram,
        interests: this.interests
      };
      console.log('Datos registrados:', data);
      // Aquí puedes redirigir o enviar al backend
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
