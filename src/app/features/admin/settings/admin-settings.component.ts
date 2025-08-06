import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="mx-auto max-w-4xl space-y-6">
      <!-- Header -->
      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 class="flex items-center text-2xl font-bold text-gray-900">
          <i class="material-icons mr-3">settings</i>
          Configuración del Sistema
        </h1>
        <p class="mt-2 text-gray-600">Administra las configuraciones globales de la plataforma</p>
      </div>

      <!-- Configuración de Seguridad -->
      <div class="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div class="border-b border-gray-200 px-6 py-4">
          <h2 class="flex items-center text-lg font-semibold text-gray-900">
            <i class="material-icons mr-2 text-red-600">security</i>
            Seguridad
          </h2>
          <p class="mt-1 text-sm text-gray-600">Configuraciones de seguridad y autenticación</p>
        </div>

        <form [formGroup]="securityForm" class="space-y-6 p-6">
          <!-- Autenticación de dos factores -->
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <h3 class="text-sm font-medium text-gray-900">Autenticación de dos factores</h3>
              <p class="text-sm text-gray-500">Requiere código adicional para iniciar sesión</p>
            </div>
            <label class="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" formControlName="twoFactorEnabled" class="peer sr-only" />
              <div
                class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
              ></div>
            </label>
          </div>

          <!-- Tiempo de sesión -->
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">
              Tiempo de expiración de sesión (minutos)
            </label>
            <select
              formControlName="sessionTimeout"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            >
              <option value="15">15 minutos</option>
              <option value="30">30 minutos</option>
              <option value="60">1 hora</option>
              <option value="120">2 horas</option>
              <option value="480">8 horas</option>
            </select>
          </div>

          <!-- Notificaciones de login -->
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <h3 class="text-sm font-medium text-gray-900">Notificaciones de inicio de sesión</h3>
              <p class="text-sm text-gray-500">Recibir alertas por email al iniciar sesión</p>
            </div>
            <label class="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" formControlName="loginNotifications" class="peer sr-only" />
              <div
                class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
              ></div>
            </label>
          </div>

          <!-- Acceso API -->
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <h3 class="text-sm font-medium text-gray-900">Acceso a API externa</h3>
              <p class="text-sm text-gray-500">Permitir conexiones desde aplicaciones externas</p>
            </div>
            <label class="relative inline-flex cursor-pointer items-center">
              <input type="checkbox" formControlName="apiAccessEnabled" class="peer sr-only" />
              <div
                class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
              ></div>
            </label>
          </div>
        </form>
      </div>

      <!-- Configuración de Notificaciones -->
      <div class="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div class="border-b border-gray-200 px-6 py-4">
          <h2 class="flex items-center text-lg font-semibold text-gray-900">
            <i class="material-icons mr-2 text-blue-600">notifications</i>
            Notificaciones
          </h2>
          <p class="mt-1 text-sm text-gray-600">Configurar alertas y notificaciones del sistema</p>
        </div>

        <form [formGroup]="notificationForm" class="space-y-6 p-6">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <!-- Reportes por email -->
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h3 class="text-sm font-medium text-gray-900">Reportes por email</h3>
                <p class="text-sm text-gray-500">Resúmenes diarios y semanales</p>
              </div>
              <label class="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" formControlName="emailReports" class="peer sr-only" />
                <div
                  class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
                ></div>
              </label>
            </div>

            <!-- Alertas del sistema -->
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h3 class="text-sm font-medium text-gray-900">Alertas del sistema</h3>
                <p class="text-sm text-gray-500">Errores y fallos críticos</p>
              </div>
              <label class="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" formControlName="systemAlerts" class="peer sr-only" />
                <div
                  class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
                ></div>
              </label>
            </div>

            <!-- Actividad de usuarios -->
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h3 class="text-sm font-medium text-gray-900">Actividad de usuarios</h3>
                <p class="text-sm text-gray-500">Registros y nuevos usuarios</p>
              </div>
              <label class="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" formControlName="userActivity" class="peer sr-only" />
                <div
                  class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
                ></div>
              </label>
            </div>

            <!-- Actualizaciones de mantenimiento -->
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h3 class="text-sm font-medium text-gray-900">Mantenimiento</h3>
                <p class="text-sm text-gray-500">Actualizaciones programadas</p>
              </div>
              <label class="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" formControlName="maintenanceUpdates" class="peer sr-only" />
                <div
                  class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
                ></div>
              </label>
            </div>
          </div>
        </form>
      </div>

      <!-- Configuración del Sistema -->
      <div class="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div class="border-b border-gray-200 px-6 py-4">
          <h2 class="flex items-center text-lg font-semibold text-gray-900">
            <i class="material-icons mr-2 text-green-600">tune</i>
            Sistema
          </h2>
          <p class="mt-1 text-sm text-gray-600">Configuraciones avanzadas del sistema</p>
        </div>

        <form [formGroup]="systemForm" class="space-y-6 p-6">
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <!-- Auto backup -->
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h3 class="text-sm font-medium text-gray-900">Respaldo automático</h3>
                <p class="text-sm text-gray-500">Backup diario de la base de datos</p>
              </div>
              <label class="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" formControlName="autoBackup" class="peer sr-only" />
                <div
                  class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
                ></div>
              </label>
            </div>

            <!-- Modo debug -->
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h3 class="text-sm font-medium text-gray-900">Modo depuración</h3>
                <p class="text-sm text-gray-500">Logs detallados para desarrollo</p>
              </div>
              <label class="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" formControlName="debugMode" class="peer sr-only" />
                <div
                  class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
                ></div>
              </label>
            </div>

            <!-- Analytics -->
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h3 class="text-sm font-medium text-gray-900">Analíticas</h3>
                <p class="text-sm text-gray-500">Recopilar datos de uso</p>
              </div>
              <label class="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" formControlName="analyticsEnabled" class="peer sr-only" />
                <div
                  class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
                ></div>
              </label>
            </div>

            <!-- Modo mantenimiento -->
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h3 class="text-sm font-medium text-gray-900">Modo mantenimiento</h3>
                <p class="text-sm text-gray-500">Bloquear acceso temporalmente</p>
              </div>
              <label class="relative inline-flex cursor-pointer items-center">
                <input type="checkbox" formControlName="maintenanceMode" class="peer sr-only" />
                <div
                  class="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"
                ></div>
              </label>
            </div>
          </div>
        </form>
      </div>

      <!-- Botones de acción -->
      <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-gray-900">Acciones del Sistema</h3>
            <p class="text-sm text-gray-600">Operaciones administrativas críticas</p>
          </div>
          <div class="flex space-x-4">
            <button
              type="button"
              (click)="saveAllSettings()"
              [disabled]="isLoading()"
              class="flex items-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              @if (isLoading()) {
                <div class="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
              }
              {{ isLoading() ? 'Guardando...' : 'Guardar todo' }}
            </button>
            <button
              type="button"
              (click)="resetToDefaults()"
              class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Restablecer
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSettingsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  // Signals
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);

  // Forms
  securityForm: FormGroup;
  notificationForm: FormGroup;
  systemForm: FormGroup;

  constructor() {
    this.securityForm = this.fb.group({
      twoFactorEnabled: [false],
      sessionTimeout: [30],
      loginNotifications: [true],
      apiAccessEnabled: [false],
    });

    this.notificationForm = this.fb.group({
      emailReports: [true],
      systemAlerts: [true],
      userActivity: [false],
      maintenanceUpdates: [true],
    });

    this.systemForm = this.fb.group({
      autoBackup: [true],
      debugMode: [false],
      analyticsEnabled: [true],
      maintenanceMode: [false],
    });
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  private loadSettings(): void {
    // Aquí cargarías las configuraciones desde el backend
    // Por ahora usamos valores por defecto
  }

  saveAllSettings(): void {
    this.isLoading.set(true);

    // Simular guardado (aquí harías la llamada al backend)
    setTimeout(() => {
      this.isLoading.set(false);

      // Aquí podrías agregar un toast de éxito
    }, 1500);
  }
  resetToDefaults(): void {
    this.securityForm.patchValue({
      twoFactorEnabled: false,
      sessionTimeout: 30,
      loginNotifications: true,
      apiAccessEnabled: false,
    });

    this.notificationForm.patchValue({
      emailReports: true,
      systemAlerts: true,
      userActivity: false,
      maintenanceUpdates: true,
    });

    this.systemForm.patchValue({
      autoBackup: true,
      debugMode: false,
      analyticsEnabled: true,
      maintenanceMode: false,
    });

    // Aquí podrías agregar un toast de éxito
  }
}
