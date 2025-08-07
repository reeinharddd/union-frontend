import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '@app/core/services/user/user.service';
import { UpdateUserRequest, User } from '@app/core/models/user/user.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="mx-auto max-w-5xl rounded-3xl border border-gray-200 bg-white p-8 shadow-md">
      <h2 class="mb-8 flex items-center gap-2 text-3xl font-bold text-gray-800">
        <span>🛠️</span> Editar Usuario
      </h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-8" *ngIf="form">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label class="mb-1 block font-medium text-gray-700">Nombre</label>
            <input type="text" class="admin-input" formControlName="nombre" placeholder="Ray" />
          </div>

          <div>
            <label class="mb-1 block font-medium text-gray-700">Correo</label>
            <input
              type="email"
              class="admin-input"
              formControlName="correo"
              placeholder="ray@example.com"
            />
          </div>

          <div>
            <label class="mb-1 block font-medium text-gray-700">Teléfono</label>
            <input
              type="text"
              class="admin-input"
              formControlName="telefono"
              placeholder="123-456-7890"
            />
          </div>

          <div>
            <label class="mb-1 block font-medium text-gray-700">GitHub URL</label>
            <input
              type="text"
              class="admin-input"
              formControlName="github_url"
              placeholder="https://github.com/usuario"
            />
          </div>

          <div>
            <label class="mb-1 block font-medium text-gray-700">LinkedIn URL</label>
            <input
              type="text"
              class="admin-input"
              formControlName="linkedin_url"
              placeholder="https://linkedin.com/in/usuario"
            />
          </div>

          <div>
            <label class="mb-1 block font-medium text-gray-700">CV URL</label>
            <input
              type="text"
              class="admin-input"
              formControlName="cv_url"
              placeholder="https://example.com/cv"
            />
          </div>

          <div>
            <label class="mb-1 block font-medium text-gray-700">ID Universidad</label>
            <input
              type="number"
              class="admin-input"
              formControlName="universidad_id"
              placeholder="1"
            />
          </div>

          <div>
            <label class="mb-1 block font-medium text-gray-700">ID Rol</label>
            <input type="number" class="admin-input" formControlName="rol_id" placeholder="2" />
          </div>
        </div>

        <div class="mt-4 flex flex-wrap gap-8">
          <label class="flex items-center gap-3 text-sm font-medium text-gray-700">
            <input type="checkbox" formControlName="cv_publico" class="accent-orange-500" />
            CV Público
          </label>
          <label class="flex items-center gap-3 text-sm font-medium text-gray-700">
            <input type="checkbox" formControlName="is_active" class="accent-orange-500" />
            Activo
          </label>
          <label class="flex items-center gap-3 text-sm font-medium text-gray-700">
            <input type="checkbox" formControlName="is_verified" class="accent-orange-500" />
            Verificado
          </label>
        </div>

        <div class="pt-6">
          <button
            type="submit"
            class="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-2 font-semibold shadow transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span>💾</span> Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  `,
})
export class EditUserComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);

  userId!: number;

  form = this.fb.group({
    nombre: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    telefono: [''],
    github_url: [''],
    linkedin_url: [''],
    //biografia: [''],
    cv_url: [''],
    universidad_id: [null as number | null],
    rol_id: [null as number | null, Validators.required],
    cv_publico: [false],
    is_active: [true],
    is_verified: [false],
  });

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.userId) {
      this.userService.getById(this.userId).subscribe((user: User) => {
        this.form.patchValue({
          nombre: user.nombre,
          correo: user.correo,
          telefono: user.telefono,
          github_url: user.github_url,
          linkedin_url: user.linkedin_url,
          //biografia: user.biografia,
          cv_url: user.cv_url,
          universidad_id: user.universidad_id,
          rol_id: user.rol_id,
          cv_publico: user.cv_publico,
          is_active: user.is_active,
          is_verified: user.is_verified,
        });
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid || !this.userId) return;

    const payload: UpdateUserRequest = this.form.value;
    this.userService.update(this.userId, payload).subscribe(() => {
      console.log('✅ Usuario actualizado exitosamente');
    });
  }
}
