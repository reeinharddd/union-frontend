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
    <div class="page-container space-y-6 animate-fade-in">
      <!-- Header elegante -->
      <div class="admin-header">
        <div class="flex items-center space-x-6">
          <div class="relative">
            <div class="h-20 w-20 bg-gradient-warm rounded-2xl flex items-center justify-center shadow-glow">
              <span class="text-white text-2xl font-bold">{{ getInitials() }}</span>
            </div>
            <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-white flex items-center justify-center">
              <i class="material-icons text-white text-xs">check</i>
            </div>
          </div>
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-white mb-2">{{ profile()?.nombre || 'Cargando...' }}</h1>
            <p class="text-white/90 text-lg mb-3">{{ profile()?.correo }}</p>
            <div class="flex items-center space-x-3">
              <span class="badge-primary">
                <i class="material-icons text-sm mr-1">admin_panel_settings</i>
                Administrador del Sistema
              </span>
              <span class="badge bg-white/20 text-white">
                <i class="material-icons text-sm mr-1">verified</i>
                Verificado
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Estadísticas modernas -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <i class="material-icons text-success group-hover:scale-110 transition-transform">trending_up</i>
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
            <i class="material-icons text-info group-hover:scale-110 transition-transform">history</i>
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
            <i class="material-icons text-primary group-hover:scale-110 transition-transform">shield</i>
          </div>
        </div>
      </div>

      <!-- Formulario moderno -->
      <div class="card animate-slide-up">
        <div class="card-header">
          <h2 class="text-xl font-bold text-gradient flex items-center">
            <i class="material-icons mr-3 text-primary">edit</i>
            Información Personal
          </h2>
          <p class="text-neutral-600 mt-1">Mantén tu información actualizada</p>
        </div>

        <form [formGroup]="profileForm" (ngSubmit)="onSubmit()" class="card-body space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Nombre -->
            <div class="space-y-2">
              <label for="nombre" class="form-label flex items-center">
                <i class="material-icons text-sm mr-2 text-primary">person</i>
                Nombre completo
              </label>
              <input
                id="nombre"
                type="text"
                formControlName="nombre"
                class="form-input"
                placeholder="Ingresa tu nombre completo"
              />
              @if (profileForm.get('nombre')?.errors?.['required'] && profileForm.get('nombre')?.touched) {
                <p class="form-error">
                  <i class="material-icons text-xs mr-1">error</i>
                  El nombre es requerido
                </p>
              }
            </div>

            <!-- Email -->
            <div class="space-y-2">
              <label for="correo" class="form-label flex items-center">
                <i class="material-icons text-sm mr-2 text-primary">email</i>
                Correo electrónico
              </label>
              <input
                id="correo"
                type="email"
                formControlName="correo"
                class="form-input"
                placeholder="correo@ejemplo.com"
              />
              @if (profileForm.get('correo')?.errors?.['required'] && profileForm.get('correo')?.touched) {
                <p class="form-error">
                  <i class="material-icons text-xs mr-1">error</i>
                  El correo es requerido
                </p>
              }
              @if (profileForm.get('correo')?.errors?.['email'] && profileForm.get('correo')?.touched) {
                <p class="form-error">
                  <i class="material-icons text-xs mr-1">error</i>
                  Ingresa un correo válido
                </p>
              }
            </div>

            <!-- Teléfono -->
            <div class="space-y-2 lg:col-span-2">
              <label for="telefono" class="form-label flex items-center">
                <i class="material-icons text-sm mr-2 text-primary">phone</i>
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
          <div class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-neutral-200">
            <button
              type="button"
              (click)="resetForm()"
              class="btn-outline sm:order-1"
            >
              <i class="material-icons text-sm mr-2">refresh</i>
              Cancelar
            </button>
            <button
              type="submit"
              [disabled]="profileForm.invalid || isLoading()"
              class="btn-primary sm:order-2"
            >
              @if (isLoading()) {
                <div class="loading-spinner mr-2"></div>
                <span>Guardando...</span>
              } @else {
                <i class="material-icons text-sm mr-2">save</i>
                <span>Guardar cambios</span>
              }
            </button>
          </div>
        </form>
      </div>

            <button
              type="submit"
              [disabled]="!profileForm.valid || isLoading()"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              @if (isLoading()) {
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              }
              {{ isLoading() ? 'Guardando...' : 'Guardar cambios' }}
            </button>
          </div>

      <!-- Actividad reciente -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900 flex items-center">
            <i class="material-icons mr-2">history</i>
            Actividad Reciente
          </h2>
        </div>
        <div class="p-6">
          <div class="space-y-4">
            <div class="flex items-start space-x-3">
              <div class="p-2 bg-green-100 rounded-lg">
                <i class="material-icons text-green-600 text-sm">check_circle</i>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">Sesión iniciada</p>
                <p class="text-sm text-gray-500">Hace 2 horas</p>
              </div>
            </div>
            <div class="flex items-start space-x-3">
              <div class="p-2 bg-blue-100 rounded-lg">
                <i class="material-icons text-blue-600 text-sm">people</i>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">Revisión de usuarios</p>
                <p class="text-sm text-gray-500">Hace 4 horas</p>
              </div>
            </div>
            <div class="flex items-start space-x-3">
              <div class="p-2 bg-purple-100 rounded-lg">
                <i class="material-icons text-purple-600 text-sm">backup</i>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">Respaldo programado</p>
                <p class="text-sm text-gray-500">Ayer</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProfileComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);

  // Signals
  readonly profile = signal<AdminProfile | null>(null);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  // Form
  profileForm: FormGroup;

  constructor() {
    this.profileForm = this.fb.group({
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: [''],
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  private loadProfile(): void {
    const currentUser = this.authService.currentUser();
    if (!currentUser?.id) {
      this.error.set('No se pudo obtener la información del usuario');
      return;
    }

    this.isLoading.set(true);
    this.userService.getById(currentUser.id).subscribe({
      next: (user) => {
        const adminProfile: AdminProfile = {
          id: user.id,
          nombre: user.nombre,
          correo: user.correo,
          telefono: user.telefono,
          rol_id: user.rol_id,
          universidad_id: user.universidad_id,
          created_at: user.creado_en || new Date().toISOString(),
          last_login: user.last_login_at,
        };

        this.profile.set(adminProfile);
        this.profileForm.patchValue({
          nombre: user.nombre,
          correo: user.correo,
          telefono: user.telefono || '',
        });
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.error.set('Error al cargar el perfil');
        this.isLoading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (!this.profileForm.valid || !this.profile()?.id) return;

    this.isLoading.set(true);
    const formData = this.profileForm.value;

    this.userService.update(this.profile()!.id, formData).subscribe({
      next: (updatedUser) => {
        const updatedProfile: AdminProfile = {
          ...this.profile()!,
          ...updatedUser,
        };
        this.profile.set(updatedProfile);
        this.isLoading.set(false);

        // Mostrar mensaje de éxito (puedes agregar un toast service aquí)
        console.log('Perfil actualizado exitosamente');
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.error.set('Error al actualizar el perfil');
        this.isLoading.set(false);
      },
    });
  }

  resetForm(): void {
    const profile = this.profile();
    if (profile) {
      this.profileForm.patchValue({
        nombre: profile.nombre,
        correo: profile.correo,
        telefono: profile.telefono || '',
      });
    }
  }

  getInitials(): string {
    const name = this.profile()?.nombre || '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'No disponible';

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Hoy';
    if (diffDays === 2) return 'Ayer';
    if (diffDays <= 7) return `Hace ${diffDays} días`;

    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
