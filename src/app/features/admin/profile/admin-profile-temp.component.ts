import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@app/core/services/auth/auth.service';
import { UserService } from '@app/core/services/user/user.service';

interface AdminProfile {
  id: number;
  nombre: string;
  correo: string;
  telefono?: string;
  rol_id: number;
  universidad_id?: number;
  created_at: string;
  last_login?: string;
}

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-container animate-fade-in space-y-6">
      <!-- Header elegante -->
      <div class="admin-header">
        <div class="flex items-center space-x-6">
          <div class="relative">
            <div
              class="bg-gradient-warm shadow-glow flex h-20 w-20 items-center justify-center rounded-2xl"
            >
              <span class="text-2xl font-bold text-white">{{ getInitials() }}</span>
            </div>
            <div
              class="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-success"
            >
              <i class="material-icons text-xs text-white">check</i>
            </div>
          </div>
          <div class="flex-1">
            <h1 class="mb-2 text-3xl font-bold text-white">
              {{ profile()?.nombre || 'Cargando...' }}
            </h1>
            <p class="mb-3 text-lg text-white/90">{{ profile()?.correo }}</p>
            <div class="flex items-center space-x-3">
              <span class="badge-primary">
                <i class="material-icons mr-1 text-sm">admin_panel_settings</i>
                Administrador del Sistema
              </span>
              <span class="badge bg-white/20 text-white">
                <i class="material-icons mr-1 text-sm">verified</i>
                Verificado
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Estadísticas modernas -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div class="stat-card group">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="stat-icon gradient-success">
                <i class="material-icons">login</i>
              </div>
              <div>
                <p class="stat-label">Último acceso</p>
                <p class="stat-value text-lg">{{ formatDate(profile()?.last_login) }}</p>
              </div>
            </div>
            <i class="material-icons text-success transition-transform group-hover:scale-110"
              >trending_up</i
            >
          </div>
        </div>

        <div class="stat-card group">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="stat-icon gradient-info">
                <i class="material-icons">schedule</i>
              </div>
              <div>
                <p class="stat-label">Miembro desde</p>
                <p class="stat-value text-lg">{{ formatDate(profile()?.created_at) }}</p>
              </div>
            </div>
            <i class="material-icons text-info transition-transform group-hover:scale-110"
              >history</i
            >
          </div>
        </div>

        <div class="stat-card group">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="stat-icon gradient-primary">
                <i class="material-icons">security</i>
              </div>
              <div>
                <p class="stat-label">Nivel de acceso</p>
                <p class="stat-value text-lg">Completo</p>
              </div>
            </div>
            <i class="material-icons text-primary transition-transform group-hover:scale-110"
              >shield</i
            >
          </div>
        </div>
      </div>

      <!-- Formulario moderno -->
      <div class="card animate-slide-up">
        <div class="card-header">
          <h2 class="text-gradient flex items-center text-xl font-bold">
            <i class="material-icons mr-3 text-primary">edit</i>
            Información Personal
          </h2>
          <p class="mt-1 text-neutral-600">Mantén tu información actualizada</p>
        </div>

        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="card-body space-y-6">
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <!-- Nombre -->
            <div class="space-y-2">
              <label for="nombre" class="form-label flex items-center">
                <i class="material-icons mr-2 text-sm text-primary">person</i>
                Nombre completo
              </label>
              <input
                id="nombre"
                type="text"
                formControlName="nombre"
                class="form-input"
                placeholder="Ingresa tu nombre completo"
              />
              @if (
                profileForm.get('nombre')?.errors?.['required'] &&
                profileForm.get('nombre')?.touched
              ) {
                <p class="form-error">
                  <i class="material-icons mr-1 text-xs">error</i>
                  El nombre es requerido
                </p>
              }
            </div>

            <!-- Email -->
            <div class="space-y-2">
              <label for="correo" class="form-label flex items-center">
                <i class="material-icons mr-2 text-sm text-primary">email</i>
                Correo electrónico
              </label>
              <input
                id="correo"
                type="email"
                formControlName="correo"
                class="form-input"
                placeholder="correo@ejemplo.com"
              />
              @if (
                profileForm.get('correo')?.errors?.['required'] &&
                profileForm.get('correo')?.touched
              ) {
                <p class="form-error">
                  <i class="material-icons mr-1 text-xs">error</i>
                  El correo es requerido
                </p>
              }
              @if (
                profileForm.get('correo')?.errors?.['email'] && profileForm.get('correo')?.touched
              ) {
                <p class="form-error">
                  <i class="material-icons mr-1 text-xs">error</i>
                  Ingresa un correo válido
                </p>
              }
            </div>

            <!-- Teléfono -->
            <div class="space-y-2 lg:col-span-2">
              <label for="telefono" class="form-label flex items-center">
                <i class="material-icons mr-2 text-sm text-primary">phone</i>
                Teléfono
              </label>
              <input
                id="telefono"
                type="tel"
                formControlName="telefono"
                class="form-input"
                placeholder="+52 123 456 7890"
              />
              <p class="form-help">Opcional - Formato internacional recomendado</p>
            </div>
          </div>

          <!-- Botones modernos -->
          <div
            class="flex flex-col justify-end space-y-3 border-t border-neutral-200 pt-6 sm:flex-row sm:space-x-4 sm:space-y-0"
          >
            <button type="button" (click)="resetForm()" class="btn-outline">
              <i class="material-icons mr-2 text-sm">refresh</i>
              Cancelar
            </button>
            <button
              type="submit"
              [disabled]="profileForm.invalid || isLoading()"
              class="btn-primary"
            >
              @if (isLoading()) {
                <div class="loading-spinner mr-2"></div>
                <span>Guardando...</span>
              } @else {
                <i class="material-icons mr-2 text-sm">save</i>
                <span>Guardar cambios</span>
              }
            </button>
          </div>
        </form>
      </div>

      <!-- Información adicional -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Actividad reciente -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-gradient flex items-center text-lg font-semibold">
              <i class="material-icons mr-2 text-primary">history</i>
              Actividad Reciente
            </h3>
          </div>
          <div class="card-body space-y-4">
            <div class="flex items-center space-x-3 rounded-lg bg-neutral-50 p-3">
              <div class="h-2 w-2 rounded-full bg-success"></div>
              <div class="flex-1">
                <p class="text-sm font-medium">Perfil actualizado</p>
                <p class="text-xs text-neutral-500">Hace 2 minutos</p>
              </div>
            </div>
            <div class="flex items-center space-x-3 rounded-lg bg-neutral-50 p-3">
              <div class="h-2 w-2 rounded-full bg-info"></div>
              <div class="flex-1">
                <p class="text-sm font-medium">Inicio de sesión</p>
                <p class="text-xs text-neutral-500">Hace 30 minutos</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Configuración rápida -->
        <div class="card">
          <div class="card-header">
            <h3 class="text-gradient flex items-center text-lg font-semibold">
              <i class="material-icons mr-2 text-primary">settings</i>
              Configuración Rápida
            </h3>
          </div>
          <div class="card-body space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">Notificaciones por email</span>
              <div class="relative h-6 w-12 rounded-full bg-primary">
                <div
                  class="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform"
                ></div>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium">Autenticación de dos factores</span>
              <div class="relative h-6 w-12 rounded-full bg-neutral-300">
                <div
                  class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);

  profile = signal<AdminProfile | null>(null);
  isLoading = signal(false);

  profileForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    correo: ['', [Validators.required, Validators.email]],
    telefono: [''],
  });

  ngOnInit() {
    this.loadProfile();
  }

  private loadProfile() {
    const currentUser = this.authService.currentUser();
    if (currentUser?.id) {
      this.userService.getById(currentUser.id).subscribe({
        next: profile => {
          this.profile.set(profile);
          this.profileForm.patchValue({
            nombre: profile.nombre,
            correo: profile.correo,
            telefono: profile.telefono || '',
          });
        },
        error: error => {
          console.error('Error loading profile:', error);
        },
      });
    }
  }

  onSubmit() {
    if (this.profileForm.valid && this.profile()) {
      this.isLoading.set(true);

      const formData = this.profileForm.value;
      const profileId = this.profile()!.id;

      this.userService.update(profileId, formData).subscribe({
        next: updatedProfile => {
          this.profile.set(updatedProfile);
          this.isLoading.set(false);
          // Profile updated successfully
        },
        error: error => {
          this.isLoading.set(false);
          console.error('Error updating profile:', error);
        },
      });
    }
  }

  resetForm() {
    if (this.profile()) {
      this.profileForm.patchValue({
        nombre: this.profile()!.nombre,
        correo: this.profile()!.correo,
        telefono: this.profile()!.telefono || '',
      });
    }
  }

  getInitials(): string {
    const profile = this.profile();
    if (!profile?.nombre) return 'A';

    const words = profile.nombre.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return words[0][0].toUpperCase();
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'No disponible';

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.ceil(diffDays / 7)} semanas`;
    if (diffDays < 365) return `Hace ${Math.ceil(diffDays / 30)} meses`;

    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
