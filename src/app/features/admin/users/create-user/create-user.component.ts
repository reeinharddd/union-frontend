import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '@app/core/services/user/user.service';
import { CreateUserRequest } from '@app/core/models/user/user.interface';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="mx-auto max-w-5xl rounded-3xl border border-gray-200 bg-white p-8 shadow-md">
      <h2 class="mb-8 flex items-center gap-2 text-3xl font-bold text-gray-800">
        <span>🧑‍💻</span> Crear Nuevo Usuario
      </h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-8">
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
            <label class="mb-1 block font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              class="admin-input"
              formControlName="contrasena"
              placeholder="********"
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
            class="bg-orange-500 hover:bg-orange-600 inline-flex items-center gap-2 rounded-2xl px-6 py-2 font-semibold shadow transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span>➕ </span> Crear Usuario
          </button>
        </div>
      </form>
    </div>
  `,
})
export class UserFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);

  @Output() userCreated = new EventEmitter<void>();

  form = this.fb.group({
    nombre: [null, Validators.required],
    correo: [null, [Validators.required, Validators.email]],
    contrasena: [null, Validators.required],
    telefono: [null],
    github_url: [null],
    linkedin_url: [null],
    //biografia: [null],
    cv_url: [null],
    universidad_id: [null],
    rol_id: [null, Validators.required],
    cv_publico: [false],
    is_active: [true],
    is_verified: [false],
  });

  onSubmit() {
    if (this.form.invalid) return;

    const payload: CreateUserRequest = this.form.value;
    this.userService.create(payload).subscribe(() => {
      this.userCreated.emit();
      this.form.reset();
    });
  }
}
