import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  template: `
    <div class="p-6">
      <div class="mb-6 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Reportes del Sistema</h1>
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div class="rounded-lg bg-white p-6 shadow">
          <h3 class="mb-2 text-lg font-semibold">Reportes de Usuarios</h3>
          <p class="text-sm text-gray-600">Estadísticas y reportes sobre usuarios del sistema</p>
          <button
            class="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700"
          >
            Ver Reportes
          </button>
        </div>

        <div class="rounded-lg bg-white p-6 shadow">
          <h3 class="mb-2 text-lg font-semibold">Reportes de Contenido</h3>
          <p class="text-sm text-gray-600">Reportes de contenido inapropiado y moderación</p>
          <button
            class="mt-4 rounded-lg bg-accent-600 px-4 py-2 text-white transition-colors hover:bg-accent-700"
          >
            Ver Reportes
          </button>
        </div>

        <div class="rounded-lg bg-white p-6 shadow">
          <h3 class="mb-2 text-lg font-semibold">Reportes de Actividad</h3>
          <p class="text-sm text-gray-600">Métricas de actividad y uso de la plataforma</p>
          <button
            class="mt-4 rounded-lg bg-secondary-600 px-4 py-2 text-white transition-colors hover:bg-secondary-700"
          >
            Ver Reportes
          </button>
        </div>
      </div>
    </div>
  `,
})
export class AdminReportsComponent {}
