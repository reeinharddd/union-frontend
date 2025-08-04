import { Component } from '@angular/core';

@Component({
  selector: 'app-users-detail',
  standalone: true,
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Detalle de Usuario</h1>

      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600">Detalls del usuario seleccionado...</p>
      </div>
    </div>
  `
})
export class UsersDetailComponent {}
