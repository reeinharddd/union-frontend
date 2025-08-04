import { Component } from '@angular/core';

@Component({
  selector: 'app-universities-list',
  standalone: true,
  template: `
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Gestión de Universidades</h1>
        <button class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors">
          Nueva Universidad
        </button>
      </div>

      <div class="bg-white rounded-lg shadow">
        <div class="p-6">
          <p class="text-gray-600">Lista de universidades del sistema...</p>
          <div class="mt-4 space-y-2">
            <div class="p-4 border rounded-lg">
              <h3 class="font-medium">Universidad Tecnológica de Tijuana</h3>
              <p class="text-sm text-gray-500">Dominio: un.edu.mx</p>
            </div>
            <div class="p-4 border rounded-lg">
              <h3 class="font-medium">Instituto Tecnológico</h3>
              <p class="text-sm text-gray-500">Dominio: it.edu.mx</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UniversitiesListComponent {}
