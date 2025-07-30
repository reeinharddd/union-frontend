import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ForumService } from '../forum.service';


@Component({
  selector: 'app-forum-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './forum-form.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForumFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private forumService = inject(ForumService);
  private route = inject(ActivatedRoute);
  forumId?: number;

  form = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required]
  });

  ngOnInit() {
    this.forumId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.forumId) {
      this.forumService.getById(this.forumId).subscribe(foro => {
        this.form.patchValue({
          nombre: foro.nombre,
          descripcion: foro.descripcion
        });
      });
    }
  }

  guardar() {
    let data: any = {
      nombre: String(this.form.value.nombre || ''),
      descripcion: String(this.form.value.descripcion || '')
    };
    // Solo agregar el id si es edición
    if (this.forumId) {
      data = { ...data, id: this.forumId };
      this.forumService.update(this.forumId, data).subscribe({
        next: () => this.router.navigate(['/admin/foros']),
        error: err => {
          console.error('Error actualizando foro:', err);
        }
      });
    } else {
      // En creación nunca enviar el id
      this.forumService.create(data).subscribe({
        next: () => this.router.navigate(['/admin/foros']),
        error: err => {
          console.error('Error creando foro:', err);
        }
      });
    }
  }

  volver() {
    this.router?.navigate(['/admin/foros']);
  }
}
