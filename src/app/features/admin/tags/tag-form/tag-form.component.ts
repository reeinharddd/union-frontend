import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TagService } from '../tag.service';

@Component({
  selector: 'app-tag-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './tag-form.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagFormComponent {
  private route = inject(ActivatedRoute);
  tagId: number | null = null;

  ngOnInit() {
    this.tagId = Number(this.route.snapshot.paramMap.get('id')) || null;
    if (this.tagId) {
      this.tagService.getById(this.tagId).subscribe(tag => {
        if (tag) {
          this.form.patchValue(tag);
        }
      });
    }
  }
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private tagService = inject(TagService);

  form = this.fb.group({
    nombre: ['']
  });

  guardar() {
    if (this.form.valid) {
      const data = { nombre: this.form.value.nombre };
      if (this.tagId) {
        this.tagService.update(this.tagId, data).subscribe({
          next: () => {
            this.router.navigate(['/admin/tags']);
          },
          error: err => {
            console.error('Error actualizando tag:', err);
          }
        });
      } else {
        this.tagService.create(data).subscribe({
          next: () => {
            this.router.navigate(['/admin/tags']);
          },
          error: err => {
            console.error('Error creando tag:', err);
          }
        });
      }
    }
  }

  volver() {
    this.router.navigate(['/admin/tags']);
  }
}
