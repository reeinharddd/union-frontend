import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProyectosService } from '../proyectos.service';

@Component({
  selector: 'app-proyectos-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './proyectos-form.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProyectosFormComponent {
  guardar() {
    if (this.form.invalid) return;
    const id = this.activatedRoute.snapshot?.params?.['id'];
    const data = this.form.value;
    if (id) {
      this.proyectosService.update(id, data).subscribe({
        next: () => this.router.navigate(['/admin/proyectos']),
        error: err => console.error('Error actualizando proyecto:', err)
      });
    }
  }
  private router = inject(Router);
  volver() {
    this.router.navigate(['/admin/proyectos']);
  }
  private fb = inject(FormBuilder);
  private activatedRoute = inject(ActivatedRoute);
  private proyectosService = inject(ProyectosService);

  form = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    creador_id: [null, Validators.required],
    universidad_id: [null, Validators.required],
    estado_verificacion: ['', Validators.required],
    vista_publica: [false]
  });

  constructor() {
    const id = this.activatedRoute.snapshot?.params?.['id'];
    if (id) {
      this.proyectosService.getById(id).subscribe(data => {
        this.form.patchValue(data);
      });
    }
  }
}
