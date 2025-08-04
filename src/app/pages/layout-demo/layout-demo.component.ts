import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicLayoutComponent } from '@app/layouts/dynamic-layout/dynamic-layout.component';
import { LayoutConfigService } from '@app/core/services/layout/layout-config.service';
import { AuthService } from '@app/core/services/auth/auth.service';

@Component({
  selector: 'app-layout-demo',
  standalone: true,
  imports: [CommonModule, DynamicLayoutComponent],
  template: `
    <app-dynamic-layout>
      <div class="space-y-6">
        <!-- Header de la demostración -->
        <div class="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h1 class="text-2xl font-bold text-neutral-900 mb-4">
            Demostración del Sistema de Layout Dinámico
          </h1>
          <p class="text-neutral-600 mb-4">
            Este sistema adapta automáticamente la interfaz según el tipo de usuario:
          </p>

          <!-- Información del usuario actual -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 class="font-semibold text-blue-900 mb-2">Usuario Actual:</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span class="font-medium text-blue-800">Nombre:</span>
                <span class="text-blue-600 ml-2">{{ getCurrentUser()?.nombre || 'Usuario Demo' }}</span>
              </div>
              <div>
                <span class="font-medium text-blue-800">Rol:</span>
                <span class="text-blue-600 ml-2 capitalize">{{ getCurrentUserRole() }}</span>
              </div>
              <div>
                <span class="font-medium text-blue-800">Layout:</span>
                <span class="text-blue-600 ml-2">{{ getLayoutType() }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Configuraciones por rol -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          @for (roleInfo of roleConfigurations; track roleInfo.role) {
            <div class="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
              <div class="flex items-center mb-4">
                <div [class]="'h-3 w-3 rounded-full mr-3 ' + roleInfo.color"></div>
                <h3 class="text-lg font-semibold text-neutral-900 capitalize">
                  {{ roleInfo.displayName }}
                </h3>
                @if (getCurrentUserRole() === roleInfo.role) {
                  <span class="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Activo
                  </span>
                }
              </div>

              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-neutral-600">Sidebar Izquierdo:</span>
                  <span [class]="roleInfo.leftSidebar ? 'text-green-600' : 'text-red-600'">
                    {{ roleInfo.leftSidebar ? '✓ Visible' : '✗ Oculto' }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-neutral-600">Sidebar Derecho:</span>
                  <span [class]="roleInfo.rightSidebar ? 'text-green-600' : 'text-red-600'">
                    {{ roleInfo.rightSidebar ? '✓ Visible' : '✗ Oculto' }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-neutral-600">Tipo de Header:</span>
                  <span class="text-neutral-800 capitalize">{{ roleInfo.headerType }}</span>
                </div>
                <div class="text-neutral-600">
                  <span class="block mb-1">Navegación principal:</span>
                  <div class="text-xs text-neutral-500 space-y-1">
                    @for (item of roleInfo.mainNavigation; track item) {
                      <div class="flex items-center">
                        <span class="w-2 h-2 bg-neutral-300 rounded-full mr-2"></span>
                        {{ item }}
                      </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Instrucciones de uso -->
        <div class="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
          <h3 class="text-lg font-semibold text-neutral-900 mb-4">
            Cómo usar el Sistema de Layout Dinámico
          </h3>

          <div class="prose prose-sm text-neutral-600 max-w-none">
            <ol class="space-y-2 list-decimal list-inside">
              <li>
                <strong>Para Admin y Promoter:</strong> Solo sidebar izquierdo con opciones administrativas
              </li>
              <li>
                <strong>Para Student y University Admin:</strong> Ambos sidebars (izquierdo para navegación, derecho para información contextual)
              </li>
              <li>
                <strong>Headers dinámicos:</strong> Cada rol tiene su propio tipo de header con navegación específica
              </li>
              <li>
                <strong>Configuración automática:</strong> El sistema detecta el rol del usuario y aplica la configuración correspondiente
              </li>
            </ol>

            <div class="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p class="text-amber-800 text-sm">
                <strong>Nota:</strong> Para cambiar entre roles, actualiza el servicio AuthService con diferentes tipos de usuario
                para ver cómo cambia automáticamente la interfaz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </app-dynamic-layout>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `]
})
export class LayoutDemoComponent {
  private readonly authService = inject(AuthService);
  private readonly layoutConfigService = inject(LayoutConfigService);

  readonly roleConfigurations = [
    {
      role: 'admin',
      displayName: 'Administrador',
      color: 'bg-red-500',
      leftSidebar: true,
      rightSidebar: false,
      headerType: 'admin',
      mainNavigation: ['Dashboard', 'Usuarios', 'Universidades', 'Reportes', 'Sistema']
    },
    {
      role: 'promoter',
      displayName: 'Promotor',
      color: 'bg-purple-500',
      leftSidebar: true,
      rightSidebar: false,
      headerType: 'public',
      mainNavigation: ['Dashboard', 'Proyectos', 'Eventos', 'Estadísticas']
    },
    {
      role: 'student',
      displayName: 'Estudiante',
      color: 'bg-blue-500',
      leftSidebar: true,
      rightSidebar: true,
      headerType: 'student',
      mainNavigation: ['Feed', 'Mis Proyectos', 'Oportunidades', 'Perfil']
    },
    {
      role: 'university_admin',
      displayName: 'Admin Universidad',
      color: 'bg-green-500',
      leftSidebar: true,
      rightSidebar: true,
      headerType: 'university',
      mainNavigation: ['Dashboard', 'Estudiantes', 'Proyectos', 'Eventos', 'Configuración']
    }
  ];

  getCurrentUser() {
    return this.authService.currentUser();
  }

  getCurrentUserRole() {
    return this.layoutConfigService.getCurrentUserRole();
  }

  getLayoutType(): string {
    const config = this.layoutConfigService.getCurrentLayoutConfig();
    const sidebars = [];

    if (config.showLeftSidebar) sidebars.push('Izquierdo');
    if (config.showRightSidebar) sidebars.push('Derecho');

    return sidebars.length > 0 ? `Sidebar ${sidebars.join(' + ')}` : 'Sin Sidebars';
  }
}
