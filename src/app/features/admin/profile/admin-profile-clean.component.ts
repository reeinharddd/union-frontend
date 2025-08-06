import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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

interface AdminActivity {
  id: number;
  action: string;
  description: string;
  timestamp: string;
  module: string;
  icon: string;
}

interface SystemStats {
  usersManaged: number;
  eventsCreated: number;
  universitiesAdded: number;
  reportsGenerated: number;
}

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-8">
      <!-- Admin Profile Header -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white shadow-lg">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-6">
            <div class="relative">
              <div class="h-24 w-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span class="text-3xl font-bold">{{ getInitials() }}</span>
              </div>
              <div class="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            <div>
              <h1 class="text-3xl font-bold mb-2">{{ profile()?.nombre || 'Administrador' }}</h1>
              <p class="text-white/90 text-lg mb-3">{{ profile()?.correo }}</p>
              <div class="flex items-center space-x-3">
                <span class="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                  <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                  Super Admin
                </span>
                <span class="bg-green-500/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                  <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4"></path>
                  </svg>
                  Activo
                </span>
              </div>
            </div>
          </div>
          <div class="text-right">
            <button
              (click)="toggleEditMode()"
              class="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-lg text-white font-medium transition-all">
              <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              {{ isEditing() ? 'Cancelar' : 'Editar Perfil' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Admin Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div class="flex items-center">
            <div class="p-3 bg-blue-100 rounded-lg">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a1.5 1.5 0 001.5-1.5V7.5A1.5 1.5 0 0021 6h-2.25A1.5 1.5 0 0016.5 7.5v11.25"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Usuarios Gestionados</p>
              <p class="text-2xl font-bold text-gray-900">{{ adminStats().usersManaged }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div class="flex items-center">
            <div class="p-3 bg-green-100 rounded-lg">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Eventos Creados</p>
              <p class="text-2xl font-bold text-gray-900">{{ adminStats().eventsCreated }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div class="flex items-center">
            <div class="p-3 bg-purple-100 rounded-lg">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Universidades</p>
              <p class="text-2xl font-bold text-gray-900">{{ adminStats().universitiesAdded }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
          <div class="flex items-center">
            <div class="p-3 bg-orange-100 rounded-lg">
              <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm text-gray-600">Reportes</p>
              <p class="text-2xl font-bold text-gray-900">{{ adminStats().reportsGenerated }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Profile Form -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <svg class="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Información Personal
            </h2>

            @if (isLoading()) {
              <div class="flex items-center justify-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span class="ml-3 text-gray-600">Cargando perfil...</span>
              </div>
            } @else {
              <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
                <div class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Nombre completo *
                      </label>
                      <input
                        type="text"
                        formControlName="nombre"
                        [readonly]="!isEditing()"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        [class.bg-gray-50]="!isEditing()"
                        placeholder="Ingresa tu nombre completo"
                      />
                      @if (profileForm.get('nombre')?.errors && profileForm.get('nombre')?.touched) {
                        <p class="mt-1 text-sm text-red-600">El nombre es requerido</p>
                      }
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Correo electrónico *
                      </label>
                      <input
                        type="email"
                        formControlName="correo"
                        [readonly]="!isEditing()"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        [class.bg-gray-50]="!isEditing()"
                        placeholder="correo@ejemplo.com"
                      />
                      @if (profileForm.get('correo')?.errors && profileForm.get('correo')?.touched) {
                        <p class="mt-1 text-sm text-red-600">Ingresa un correo válido</p>
                      }
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      formControlName="telefono"
                      [readonly]="!isEditing()"
                      class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      [class.bg-gray-50]="!isEditing()"
                      placeholder="Número de teléfono"
                    />
                  </div>

                  @if (isEditing()) {
                    <div class="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                      <button
                        type="button"
                        (click)="toggleEditMode()"
                        class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        [disabled]="profileForm.invalid || isSaving()"
                        class="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        @if (isSaving()) {
                          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Guardando...
                        } @else {
                          Guardar Cambios
                        }
                      </button>
                    </div>
                  }
                </div>
              </form>
            }
          </div>
        </div>

        <!-- Management Panel -->
        <div class="space-y-6">
          <!-- Quick Access Management -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <svg class="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              Acceso Rápido
            </h3>
            <div class="space-y-3">
              <button
                (click)="navigateToModule('users')"
                class="w-full flex items-center p-3 text-left hover:bg-blue-50 rounded-lg transition-colors group">
                <div class="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a1.5 1.5 0 001.5-1.5V7.5A1.5 1.5 0 0021 6h-2.25A1.5 1.5 0 0016.5 7.5v11.25"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="font-medium text-gray-900">Gestionar Usuarios</p>
                  <p class="text-sm text-gray-600">Administrar cuentas y permisos</p>
                </div>
                <svg class="w-5 h-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>

              <button
                (click)="navigateToModule('universities')"
                class="w-full flex items-center p-3 text-left hover:bg-green-50 rounded-lg transition-colors group">
                <div class="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="font-medium text-gray-900">Universidades</p>
                  <p class="text-sm text-gray-600">Gestionar instituciones</p>
                </div>
                <svg class="w-5 h-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>

              <button
                (click)="navigateToModule('reports')"
                class="w-full flex items-center p-3 text-left hover:bg-orange-50 rounded-lg transition-colors group">
                <div class="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="font-medium text-gray-900">Reportes</p>
                  <p class="text-sm text-gray-600">Analíticas y estadísticas</p>
                </div>
                <svg class="w-5 h-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>

              <button
                (click)="navigateToModule('settings')"
                class="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors group">
                <div class="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                  <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="font-medium text-gray-900">Configuración</p>
                  <p class="text-sm text-gray-600">Ajustes del sistema</p>
                </div>
                <svg class="w-5 h-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 class="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <svg class="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Actividad Reciente
            </h3>
            <div class="space-y-4">
              @for (activity of recentActivity(); track activity.id) {
                <div class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div class="p-2 bg-indigo-100 rounded-lg">
                    <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900">{{ activity.action }}</p>
                    <p class="text-sm text-gray-600">{{ activity.description }}</p>
                    <p class="text-xs text-gray-500 mt-1">{{ activity.timestamp }}</p>
                  </div>
                </div>
              } @empty {
                <div class="text-center py-6">
                  <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p class="text-gray-500 text-sm">No hay actividad reciente</p>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProfileComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly profile = signal<AdminProfile | null>(null);
  readonly isLoading = signal(true);
  readonly isEditing = signal(false);
  readonly isSaving = signal(false);
  readonly adminStats = signal<SystemStats>({
    usersManaged: 247,
    eventsCreated: 18,
    universitiesAdded: 12,
    reportsGenerated: 45
  });
  readonly recentActivity = signal<AdminActivity[]>([]);

  profileForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForm();
    this.loadProfile();
    this.loadRecentActivity();
  }

  private initializeForm(): void {
    this.profileForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['']
    });
  }

  private loadProfile(): void {
    this.isLoading.set(true);

    // Simular carga de perfil
    setTimeout(() => {
      const mockProfile: AdminProfile = {
        id: 1,
        nombre: 'Esteban Beltrán',
        correo: 'esteban@gmail.com',
        telefono: '+57 300 123 4567',
        rol_id: 1,
        created_at: '2024-01-15T10:30:00Z',
        last_login: '2024-01-20T14:22:00Z'
      };

      this.profile.set(mockProfile);
      this.updateFormValues(mockProfile);
      this.isLoading.set(false);
    }, 1000);
  }

  private updateFormValues(profile: AdminProfile): void {
    this.profileForm.patchValue({
      nombre: profile.nombre,
      correo: profile.correo,
      telefono: profile.telefono || ''
    });
  }

  private loadRecentActivity(): void {
    const mockActivity: AdminActivity[] = [
      {
        id: 1,
        action: 'Nuevo usuario creado',
        description: 'Se registró un nuevo estudiante en la Universidad Nacional',
        timestamp: 'Hace 15 minutos',
        module: 'users',
        icon: 'person_add'
      },
      {
        id: 2,
        action: 'Evento publicado',
        description: 'Webinar "Futuro de la IA" programado para el 25 de enero',
        timestamp: 'Hace 1 hora',
        module: 'events',
        icon: 'event'
      },
      {
        id: 3,
        action: 'Universidad agregada',
        description: 'Universidad de los Andes añadida al sistema',
        timestamp: 'Hace 2 horas',
        module: 'universities',
        icon: 'school'
      },
      {
        id: 4,
        action: 'Backup completado',
        description: 'Respaldo automático del sistema ejecutado exitosamente',
        timestamp: 'Hace 3 horas',
        module: 'system',
        icon: 'backup'
      }
    ];

    this.recentActivity.set(mockActivity);
  }

  toggleEditMode(): void {
    const currentEditState = this.isEditing();
    this.isEditing.set(!currentEditState);

    if (!currentEditState) {
      // Entering edit mode - update form with current values
      if (this.profile()) {
        this.updateFormValues(this.profile()!);
      }
    } else {
      // Exiting edit mode - reset form
      this.profileForm.reset();
      if (this.profile()) {
        this.updateFormValues(this.profile()!);
      }
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid && !this.isSaving()) {
      this.isSaving.set(true);

      const formValue = this.profileForm.value;

      // Simular guardado
      setTimeout(() => {
        const updatedProfile: AdminProfile = {
          ...this.profile()!,
          ...formValue
        };

        this.profile.set(updatedProfile);
        this.isEditing.set(false);
        this.isSaving.set(false);

        // Mostrar mensaje de éxito (podrías usar un toast service)
        alert('Perfil actualizado exitosamente');
      }, 2000);
    }
  }

  getInitials(): string {
    const profile = this.profile();
    if (!profile?.nombre) return 'A';

    const names = profile.nombre.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return profile.nombre[0].toUpperCase();
  }

  navigateToModule(module: string): void {
    this.router.navigate([`/admin/${module}`]);
  }
}
