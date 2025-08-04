import { Component } from '@angular/core';

@Component({
  selector: 'app-users-list',
  standalone: true,
  template: `
    <div class="p-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
        <button class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors">
          Nuevo Usuario
        </button>
      </div>

      <div class="bg-white rounded-lg shadow">
        <div class="p-6">
          <p class="text-gray-600">Lista de usuarios del sistema...</p>
          <div class="mt-4 space-y-2">
            <div class="p-4 border rounded-lg">
              <h3 class="font-medium">esteban&#64;gmail.com</h3>
              <p class="text-sm text-gray-500">Administrador</p>
            </div>
            <div class="p-4 border rounded-lg">
              <h3 class="font-medium">ana&#64;un.edu.mx</h3>
              <p class="text-sm text-gray-500">Estudiante</p>
            </div>
            <div class="p-4 border rounded-lg">
              <h3 class="font-medium">luis&#64;it.edu.mx</h3>
              <p class="text-sm text-gray-500">Profesor</p>
            </div>
            <div class="p-4 border rounded-lg">
              <h3 class="font-medium">erik&#64;gmail.com</h3>
              <p class="text-sm text-gray-500">Admin Universitario</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class UsersListComponent {}
