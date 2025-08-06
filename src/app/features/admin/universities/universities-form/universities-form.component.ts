import { Component } from '@angular/core';

@Component({
  selector: 'app-universities-form',
  standalone: true,
  template: `
    <div class="p-6">
      <h1 class="mb-6 text-2xl font-bold text-gray-900">Formulario de Universidad</h1>

      <div class="rounded-lg bg-white p-6 shadow">
        <p class="text-gray-600">Componente para crear/editar universidades...</p>
      </div>
    </div>
  `,
})
export class UniversitiesFormComponent {}
