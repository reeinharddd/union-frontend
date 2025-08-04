import { Component } from '@angular/core';

@Component({
  selector: 'app-universities-detail',
  standalone: true,
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Detalle de Universidad</h1>

      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600">Detalles de la universidad seleccionada...</p>
      </div>
    </div>
  `
})
export class UniversitiesDetailComponent {}
