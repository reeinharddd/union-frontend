import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from '../event.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './event-detail.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetailComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private eventService = inject(EventService);

  form = this.fb.group({
    titulo: [''],
    descripcion: [''],
    tipo: [''],
    creador_id: [0],
    universidad_id: [0],
    fecha_inicio: [''],
    fecha_fin: [''],
    enlace_acceso: [''],
  });

  guardar() {
    if (this.form.valid) {
      const data = {
        titulo: this.form.value.titulo,
        descripcion: this.form.value.descripcion,
        tipo: this.form.value.tipo,
        creador_id: this.form.value.creador_id ?? 0,
        universidad_id: this.form.value.universidad_id ?? 0,
        fecha_inicio: this.form.value.fecha_inicio,
        fecha_fin: this.form.value.fecha_fin,
        enlace_acceso: this.form.value.enlace_acceso,
      };
      this.eventService.create(data).subscribe({
        next: () => {
          this.router.navigate(['/admin/events']);
        },
        error: err => {
          console.error('Error creando evento:', err);
        },
      });
    }
  }

  volver() {
    this.router.navigate(['/admin/events']);
  }
}
