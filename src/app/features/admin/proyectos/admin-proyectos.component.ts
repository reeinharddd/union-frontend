import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-proyectos',
  standalone: true,
  template: `
    <div class="p-6">
      <div class="mb-6 flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">Gestión de Proyectos</h1>
        <button
          class="rounded-lg bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700"
        >
          Nuevo Proyecto
        </button>
      </div>

      <div class="rounded-lg bg-white shadow">
        <div class="p-6">
          <p class="text-gray-600">Lista de proyectos en el sistema...</p>
          <div class="mt-4 space-y-2">
            <div class="rounded-lg border p-4">
              <h3 class="font-medium">Proyecto UniON</h3>
              <p class="text-sm text-gray-500">Estado: Activo</p>
            </div>
            <div class="rounded-lg border p-4">
              <h3 class="font-medium">Sistema de Gestión Académica</h3>
              <p class="text-sm text-gray-500">Estado: En Verificación</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminProyectosComponent {}
