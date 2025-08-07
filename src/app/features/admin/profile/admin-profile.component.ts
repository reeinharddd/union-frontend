import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
      <!-- Admin Header -->
      <div class="mb-8 text-center">
        <div
          class="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
        >
          <span class="text-2xl font-bold text-white">EB</span>
        </div>

        <h1 class="mb-2 text-3xl font-bold text-gray-900">Esteban Beltrán</h1>
        <p class="mb-6 text-lg text-gray-600">Administrador del Sistema</p>

        <!-- Stats Cards -->
        <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div class="rounded-lg bg-blue-50 p-6 text-center">
            <div class="mb-2 text-3xl font-bold text-blue-600">247</div>
            <div class="text-sm text-gray-600">Usuarios Gestionados</div>
          </div>
          <div class="rounded-lg bg-green-50 p-6 text-center">
            <div class="mb-2 text-3xl font-bold text-green-600">18</div>
            <div class="text-sm text-gray-600">Eventos Creados</div>
          </div>
          <div class="rounded-lg bg-purple-50 p-6 text-center">
            <div class="mb-2 text-3xl font-bold text-purple-600">12</div>
            <div class="text-sm text-gray-600">Universidades</div>
          </div>
        </div>
      </div>

      <!-- Admin Functions Grid -->
      <div class="mb-8">
        <h2 class="mb-6 text-center text-xl font-bold text-gray-900">Gestión Administrativa</h2>
        <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
          <!-- Usuarios -->
          <button
            (click)="navigateToModule('users')"
            class="group rounded-lg border border-gray-200 p-4 transition-all hover:border-blue-300 hover:bg-blue-50"
          >
            <div class="mb-3 text-blue-600 transition-transform group-hover:scale-110">
              <svg class="mx-auto h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a1.5 1.5 0 001.5-1.5V7.5A1.5 1.5 0 0021 6h-2.25A1.5 1.5 0 0016.5 7.5v11.25"
                ></path>
              </svg>
            </div>
            <div class="text-sm font-medium text-gray-900">Usuarios</div>
          </button>

          <!-- Universidades -->
          <button
            (click)="navigateToModule('universities')"
            class="group rounded-lg border border-gray-200 p-4 transition-all hover:border-green-300 hover:bg-green-50"
          >
            <div class="mb-3 text-green-600 transition-transform group-hover:scale-110">
              <svg class="mx-auto h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                ></path>
              </svg>
            </div>
            <div class="text-sm font-medium text-gray-900">Universidades</div>
          </button>

          <!-- Eventos -->
          <button
            (click)="navigateToModule('events')"
            class="group rounded-lg border border-gray-200 p-4 transition-all hover:border-purple-300 hover:bg-purple-50"
          >
            <div class="mb-3 text-purple-600 transition-transform group-hover:scale-110">
              <svg class="mx-auto h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <div class="text-sm font-medium text-gray-900">Eventos</div>
          </button>

          <!-- Reportes -->
          <button
            (click)="navigateToModule('reports')"
            class="hover:bg-orange-50 hover:border-orange-300 group rounded-lg border border-gray-200 p-4 transition-all"
          >
            <div class="text-orange-600 mb-3 transition-transform group-hover:scale-110">
              <svg class="mx-auto h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
            </div>
            <div class="text-sm font-medium text-gray-900">Reportes</div>
          </button>

          <!-- Foros -->
          <button
            (click)="navigateToModule('forums')"
            class="hover:bg-indigo-50 hover:border-indigo-300 group rounded-lg border border-gray-200 p-4 transition-all"
          >
            <div class="text-indigo-600 mb-3 transition-transform group-hover:scale-110">
              <svg class="mx-auto h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
            </div>
            <div class="text-sm font-medium text-gray-900">Foros</div>
          </button>

          <!-- Oportunidades -->
          <button
            (click)="navigateToModule('opportunities')"
            class="group rounded-lg border border-gray-200 p-4 transition-all hover:border-yellow-300 hover:bg-yellow-50"
          >
            <div class="mb-3 text-yellow-600 transition-transform group-hover:scale-110">
              <svg class="mx-auto h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0l4 4-4 4"
                ></path>
              </svg>
            </div>
            <div class="text-sm font-medium text-gray-900">Oportunidades</div>
          </button>

          <!-- Proyectos -->
          <button
            (click)="navigateToModule('proyectos')"
            class="group rounded-lg border border-gray-200 p-4 transition-all hover:border-red-300 hover:bg-red-50"
          >
            <div class="mb-3 text-red-600 transition-transform group-hover:scale-110">
              <svg class="mx-auto h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                ></path>
              </svg>
            </div>
            <div class="text-sm font-medium text-gray-900">Proyectos</div>
          </button>

          <!-- Configuración -->
          <button
            (click)="navigateToModule('settings')"
            class="group rounded-lg border border-gray-200 p-4 transition-all hover:border-gray-300 hover:bg-gray-50"
          >
            <div class="mb-3 text-gray-600 transition-transform group-hover:scale-110">
              <svg class="mx-auto h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                ></path>
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
            </div>
            <div class="text-sm font-medium text-gray-900">Configuración</div>
          </button>
        </div>
      </div>

      <!-- Additional Admin Functions -->
      <div class="mb-8">
        <h3 class="mb-4 text-center text-lg font-semibold text-gray-900">Funciones Adicionales</h3>
        <div class="grid grid-cols-2 gap-4 md:grid-cols-3">
          <!-- Conversaciones -->
          <button
            (click)="navigateToModule('conversations')"
            class="hover:bg-teal-50 hover:border-teal-300 rounded-lg border border-gray-200 p-3 text-sm transition-all"
          >
            <div class="text-teal-600 mb-2">
              <svg class="mx-auto h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h2m-4 9h4v-3H7v3z"
                ></path>
              </svg>
            </div>
            <div class="font-medium text-gray-900">Conversaciones</div>
          </button>

          <!-- Backups -->
          <button
            (click)="navigateToModule('backups-admin')"
            class="hover:bg-cyan-50 hover:border-cyan-300 rounded-lg border border-gray-200 p-3 text-sm transition-all"
          >
            <div class="text-cyan-600 mb-2">
              <svg class="mx-auto h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                ></path>
              </svg>
            </div>
            <div class="font-medium text-gray-900">Backups</div>
          </button>

          <!-- Roles -->
          <button
            (click)="navigateToModule('roles')"
            class="hover:bg-pink-50 hover:border-pink-300 rounded-lg border border-gray-200 p-3 text-sm transition-all"
          >
            <div class="text-pink-600 mb-2">
              <svg class="mx-auto h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                ></path>
              </svg>
            </div>
            <div class="font-medium text-gray-900">Roles</div>
          </button>

          <!-- Tags -->
          <button
            (click)="navigateToModule('tags')"
            class="hover:bg-lime-50 hover:border-lime-300 rounded-lg border border-gray-200 p-3 text-sm transition-all"
          >
            <div class="text-lime-600 mb-2">
              <svg class="mx-auto h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                ></path>
              </svg>
            </div>
            <div class="font-medium text-gray-900">Tags</div>
          </button>

          <!-- Shared -->
          <button
            (click)="navigateToModule('shared')"
            class="hover:bg-amber-50 hover:border-amber-300 rounded-lg border border-gray-200 p-3 text-sm transition-all"
          >
            <div class="text-amber-600 mb-2">
              <svg class="mx-auto h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                ></path>
              </svg>
            </div>
            <div class="font-medium text-gray-900">Compartidos</div>
          </button>

          <!-- Dashboard -->
          <button
            (click)="navigateToModule('dashboard')"
            class="rounded-lg border border-gray-200 p-3 text-sm transition-all hover:border-blue-300 hover:bg-blue-50"
          >
            <div class="mb-2 text-blue-600">
              <svg class="mx-auto h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
            </div>
            <div class="font-medium text-gray-900">Dashboard</div>
          </button>
        </div>
      </div>

      <!-- Dashboard Button -->
      <div class="text-center">
        <button
          (click)="navigateToModule('dashboard')"
          class="transform rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 font-medium text-white shadow-lg transition-all hover:scale-105 hover:from-blue-700 hover:to-purple-700"
        >
          <svg class="mr-2 inline h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            ></path>
          </svg>
          Ver Dashboard Completo
        </button>
      </div>
    </div>
  `,
})
export class AdminProfileComponent {
  private readonly router = inject(Router);

  navigateToModule(module: string): void {
    this.router.navigate([`/admin/${module}`]);
  }
}
