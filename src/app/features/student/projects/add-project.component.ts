import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-proyecto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule],
  templateUrl: './add-project.component.html',
})
export class AddProyectoComponent implements OnInit {
  proyectoForm: FormGroup;
  creador_id: number = 0;
  universidad_id: number = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
    this.proyectoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(200)]],
      descripcion: ['', Validators.required],
      estado_verificacion: ['', [Validators.required, Validators.maxLength(50)]],
      vista_publica: [false],
    });
  }

  goToAddProject() {
    this.router.navigate(['/student/Addprojects']);
  }
  ngOnInit() {
    // Simula obtener los datos desde un backend
    this.obtenerDatosUsuarioDesdeBD();
  }

  obtenerDatosUsuarioDesdeBD() {
    // ⚠️ Aquí deberías hacer una llamada HTTP real para obtener creador_id y universidad_id
    // Por ejemplo: this.userService.getProfile().subscribe(...)
    // Aquí lo simulamos:
    this.creador_id = 123;
    this.universidad_id = 456;
  }

  onSubmit() {
    if (this.proyectoForm.valid && this.creador_id && this.universidad_id) {
      const proyectoData = {
        ...this.proyectoForm.value,
        creador_id: this.creador_id,
        universidad_id: this.universidad_id,
      };

      // Simular almacenamiento temporal
      localStorage.setItem('newProyectoData', JSON.stringify(proyectoData));

      // Redirigir a otra vista (como resumen o lista)
      this.router.navigate(['/proyectos/resumen']);
    } else {
      this.proyectoForm.markAllAsTouched();
      alert('Por favor completa todos los campos.');
    }
  }
}
