
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../event.service';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-form.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventFormComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private eventService = inject(EventService);

  eventId = Number(this.route.snapshot.paramMap.get('id'));
  form = this.fb.group({
    titulo: [''],
    descripcion: [''],
    tipo: [''],
    creador_id: [0],
    universidad_id: [0],
    fecha_inicio: [''],
    fecha_fin: [''],
    enlace_acceso: ['']
  });

  ngOnInit() {
  if (this.eventId) {
    this.eventService.getById(this.eventId).subscribe(event => {
      if (event) {
        // Formatear fechas para los campos tipo date
        if (event.fecha_inicio) {
          event.fecha_inicio = event.fecha_inicio.split('T')[0];
        }
        if (event.fecha_fin) {
          event.fecha_fin = event.fecha_fin.split('T')[0];
        }
        this.form.patchValue(event);
      }
    });
  }
}

  guardar() {
  if (this.form.valid && this.eventId) {
    const data = {
      id: this.eventId,
      titulo: this.form.value.titulo,
      descripcion: this.form.value.descripcion,
      tipo: this.form.value.tipo,
      creador_id: this.form.value.creador_id ?? 0,
      universidad_id: this.form.value.universidad_id ?? 0,
      fecha_inicio: this.form.value.fecha_inicio,
      fecha_fin: this.form.value.fecha_fin,
      enlace_acceso: this.form.value.enlace_acceso
    };
    console.log('Datos enviados al backend:', data);
    this.eventService.update(this.eventId, data).subscribe({
      next: () => {
        this.router.navigate(['/admin/events']);
      },
      error: err => {
        console.error('Error actualizando evento:', err);
      }
    });
  }
}

  volver() {
this.router.navigate(['/admin/events']);  }
}
