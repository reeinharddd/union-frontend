import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OpportunityService } from '../opportunity.service';

@Component({
  selector: 'app-opportunity-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './opportunity-form.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpportunityFormComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private opportunityService = inject(OpportunityService);
  private activatedRoute = inject(ActivatedRoute);
  constructor() {
    // Detectar si hay id en la ruta para edición
    const id = this.activatedRoute.snapshot?.params?.['id'];
    if (id) {
      this.opportunityService.getById(Number(id)).subscribe(data => {
        // Formatear fecha para el input type="date"
        if (data.fecha_limite) {
          data.fecha_limite = data.fecha_limite.slice(0, 10);
        }
        this.form.patchValue(data);
      });
    }
  }

  form = this.fb.group({
    titulo: ['', Validators.required],
    descripcion: ['', Validators.required],
    tipo: ['', Validators.required],
    universidad_id: [null],
    fecha_limite: ['', Validators.required],
  });

  ngOnInit() {
    // Detectar si hay id en la ruta para edición
    const id = this.activatedRoute.snapshot?.params?.['id'];
    if (id) {
      this.opportunityService.getById(Number(id)).subscribe(data => {
        // Formatear fecha para el input type="date"
        if (data.fecha_limite) {
          data.fecha_limite = data.fecha_limite.slice(0, 10);
        }
        this.form.patchValue(data);
      });
    }
  }
  guardar() {
    if (this.form.invalid) return;
    const raw = this.form.value;
    const { universidad_id, ...rest } = raw;
    const payload: any = {
      ...rest,
      fecha_limite: raw.fecha_limite ? new Date(raw.fecha_limite).toISOString().slice(0, 10) : null,
    };
    if (universidad_id !== null && universidad_id !== undefined && universidad_id !== '') {
      payload.universidad_id = Number(universidad_id);
    }
    const id = this.activatedRoute.snapshot?.params?.['id'];
    if (id) {
      this.opportunityService.update(Number(id), payload).subscribe({
        next: () => {
          this.router.navigate(['/admin/opportunities']);
        },
        error: () => {
          alert('Error al actualizar la oportunidad');
        },
      });
    } else {
      this.opportunityService.create(payload).subscribe({
        next: () => {
          this.router.navigate(['/admin/opportunities']);
        },
        error: () => {
          alert('Error al guardar la oportunidad');
        },
      });
    }
  }

  volver() {
    this.router.navigate(['/admin/opportunities']);
  }
}
