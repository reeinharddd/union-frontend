import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '@app/core/services/event/event.service';
import { UniversityService } from '@app/core/services/university/university.service';
import { UserService } from '@app/core/services/user/user.service';
import { forkJoin } from 'rxjs';

interface DashboardStats {
  totalUsers: number;
  totalUniversities: number;
  totalEvents: number;
  activeEvents: number;
  recentUsers: number;
  studentsCount: number;
  graduatesCount: number;
  adminsCount: number;
}

interface RecentActivity {
  id: number;
  type: 'user' | 'event' | 'university' | 'system';
  icon: string;
  title: string;
  description: string;
  time: string;
  user?: string;
}

interface DashboardUser {
  id: number;
  nombre: string;
  correo: string;
  role: { id: number; nombre: string };
  fechaCreacion: string;
}

interface DashboardEvent {
  id: number;
  titulo: string;
  fechaInicio: string;
  fechaCreacion: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-8">
      <!-- Page Header -->
      <div class="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="mb-2 text-3xl font-bold">Panel de Administración</h1>
            <p class="text-blue-100">Bienvenido al centro de control de UniON</p>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold">{{ getCurrentTime() }}</div>
            <div class="text-blue-100">{{ getCurrentDate() }}</div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="rounded-xl bg-white p-6 shadow-lg">
        <h2 class="mb-4 text-xl font-bold text-gray-900">Acciones Rápidas</h2>
        <div class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          <button
            (click)="navigateTo('/admin/users')"
            class="group flex flex-col items-center rounded-lg bg-blue-50 p-4 transition-colors hover:bg-blue-100"
          >
            <svg
              class="mb-2 h-8 w-8 text-blue-600 group-hover:text-blue-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            <span class="text-sm font-medium text-gray-700">Nuevo Usuario</span>
          </button>

          <button
            (click)="navigateTo('/admin/universities')"
            class="group flex flex-col items-center rounded-lg bg-green-50 p-4 transition-colors hover:bg-green-100"
          >
            <svg
              class="mb-2 h-8 w-8 text-green-600 group-hover:text-green-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              ></path>
            </svg>
            <span class="text-sm font-medium text-gray-700">Nueva Universidad</span>
          </button>

          <button
            (click)="navigateTo('/admin/events')"
            class="group flex flex-col items-center rounded-lg bg-purple-50 p-4 transition-colors hover:bg-purple-100"
          >
            <svg
              class="mb-2 h-8 w-8 text-purple-600 group-hover:text-purple-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            <span class="text-sm font-medium text-gray-700">Nuevo Evento</span>
          </button>

          <button
            (click)="navigateTo('/admin/backups-admin')"
            class="bg-orange-50 hover:bg-orange-100 group flex flex-col items-center rounded-lg p-4 transition-colors"
          >
            <svg
              class="text-orange-600 group-hover:text-orange-700 mb-2 h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
              ></path>
            </svg>
            <span class="text-sm font-medium text-gray-700">Backup</span>
          </button>

          <button
            (click)="navigateTo('/admin/reports')"
            class="group flex flex-col items-center rounded-lg bg-red-50 p-4 transition-colors hover:bg-red-100"
          >
            <svg
              class="mb-2 h-8 w-8 text-red-600 group-hover:text-red-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              ></path>
            </svg>
            <span class="text-sm font-medium text-gray-700">Reportes</span>
          </button>

          <button
            (click)="navigateTo('/admin/settings')"
            class="group flex flex-col items-center rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100"
          >
            <svg
              class="mb-2 h-8 w-8 text-gray-600 group-hover:text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
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
            <span class="text-sm font-medium text-gray-700">Configuración</span>
          </button>
        </div>
      </div>

      <!-- Additional Module Actions -->
      <div class="rounded-xl bg-white p-6 shadow-lg">
        <h2 class="mb-4 text-xl font-bold text-gray-900">Módulos Adicionales</h2>
        <div class="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          <button
            (click)="navigateTo('/admin/forums')"
            class="bg-teal-50 hover:bg-teal-100 group flex flex-col items-center rounded-lg p-4 transition-colors"
          >
            <svg
              class="text-teal-600 group-hover:text-teal-700 mb-2 h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              ></path>
            </svg>
            <span class="text-sm font-medium text-gray-700">Foros</span>
          </button>

          <button
            (click)="navigateTo('/admin/opportunities')"
            class="bg-indigo-50 hover:bg-indigo-100 group flex flex-col items-center rounded-lg p-4 transition-colors"
          >
            <svg
              class="text-indigo-600 group-hover:text-indigo-700 mb-2 h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0l4 4-4 4"
              ></path>
            </svg>
            <span class="text-sm font-medium text-gray-700">Oportunidades</span>
          </button>

          <button
            (click)="navigateTo('/admin/proyectos')"
            class="bg-pink-50 hover:bg-pink-100 group flex flex-col items-center rounded-lg p-4 transition-colors"
          >
            <svg
              class="text-pink-600 group-hover:text-pink-700 mb-2 h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              ></path>
            </svg>
            <span class="text-sm font-medium text-gray-700">Proyectos</span>
          </button>

          <button
            (click)="navigateTo('/admin/conversations')"
            class="group flex flex-col items-center rounded-lg bg-yellow-50 p-4 transition-colors hover:bg-yellow-100"
          >
            <svg
              class="mb-2 h-8 w-8 text-yellow-600 group-hover:text-yellow-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z"
              ></path>
            </svg>
            <span class="text-sm font-medium text-gray-700">Conversaciones</span>
          </button>

          <button
            (click)="navigateTo('/admin/tags')"
            class="bg-emerald-50 hover:bg-emerald-100 group flex flex-col items-center rounded-lg p-4 transition-colors"
          >
            <svg
              class="text-emerald-600 group-hover:text-emerald-700 mb-2 h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              ></path>
            </svg>
            <span class="text-sm font-medium text-gray-700">Etiquetas</span>
          </button>

          <button
            (click)="navigateTo('/admin/profile')"
            class="bg-cyan-50 hover:bg-cyan-100 group flex flex-col items-center rounded-lg p-4 transition-colors"
          >
            <svg
              class="text-cyan-600 group-hover:text-cyan-700 mb-2 h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
            <span class="text-sm font-medium text-gray-700">Mi Perfil</span>
          </button>
        </div>
      </div>

      @if (isLoading()) {
        <div class="flex items-center justify-center py-12">
          <div class="h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <span class="ml-3 text-gray-600">Cargando estadísticas...</span>
        </div>
      } @else {
        <!-- Main Stats Grid -->
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <!-- Total Users -->
          <div
            class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center">
                  <div class="rounded-lg bg-blue-100 p-3">
                    <i class="material-icons text-blue-600">people</i>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Total Usuarios</p>
                    <p class="text-2xl font-bold text-gray-900">
                      {{ stats().totalUsers | number }}
                    </p>
                  </div>
                </div>
                <div class="mt-4 flex items-center">
                  <span
                    class="flex items-center rounded-full bg-green-100 px-2 py-1 text-xs text-green-800"
                  >
                    <i class="material-icons mr-1 text-xs">trending_up</i>
                    +{{ stats().recentUsers }} nuevos esta semana
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Universities -->
          <div
            class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center">
                  <div class="rounded-lg bg-green-100 p-3">
                    <i class="material-icons text-green-600">school</i>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Universidades</p>
                    <p class="text-2xl font-bold text-gray-900">
                      {{ stats().totalUniversities | number }}
                    </p>
                  </div>
                </div>
                <div class="mt-4">
                  <span class="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                    Instituciones activas
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Events -->
          <div
            class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center">
                  <div class="rounded-lg bg-purple-100 p-3">
                    <i class="material-icons text-purple-600">event</i>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Eventos</p>
                    <p class="text-2xl font-bold text-gray-900">
                      {{ stats().totalEvents | number }}
                    </p>
                  </div>
                </div>
                <div class="mt-4">
                  <span class="rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-800">
                    {{ stats().activeEvents }} activos
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- System Health -->
          <div
            class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <div class="flex items-center">
                  <div class="bg-orange-100 rounded-lg p-3">
                    <i class="material-icons text-orange-600">monitoring</i>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-600">Estado del Sistema</p>
                    <p class="text-2xl font-bold text-green-600">Óptimo</p>
                  </div>
                </div>
                <div class="mt-4">
                  <span class="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                    99.9% uptime
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- User Distribution -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 class="mb-4 flex items-center text-lg font-semibold text-gray-900">
              <i class="material-icons mr-2 text-blue-600">pie_chart</i>
              Distribución de Usuarios
            </h3>
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="mr-3 h-3 w-3 rounded-full bg-blue-500"></div>
                  <span class="text-sm text-gray-600">Estudiantes</span>
                </div>
                <div class="text-right">
                  <span class="font-semibold text-gray-900">{{ stats().studentsCount }}</span>
                  <div class="text-xs text-gray-500">
                    {{ getPercentage(stats().studentsCount, stats().totalUsers) }}%
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="mr-3 h-3 w-3 rounded-full bg-green-500"></div>
                  <span class="text-sm text-gray-600">Graduados</span>
                </div>
                <div class="text-right">
                  <span class="font-semibold text-gray-900">{{ stats().graduatesCount }}</span>
                  <div class="text-xs text-gray-500">
                    {{ getPercentage(stats().graduatesCount, stats().totalUsers) }}%
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="mr-3 h-3 w-3 rounded-full bg-purple-500"></div>
                  <span class="text-sm text-gray-600">Administradores</span>
                </div>
                <div class="text-right">
                  <span class="font-semibold text-gray-900">{{ stats().adminsCount }}</span>
                  <div class="text-xs text-gray-500">
                    {{ getPercentage(stats().adminsCount, stats().totalUsers) }}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h3 class="mb-4 flex items-center text-lg font-semibold text-gray-900">
              <i class="material-icons mr-2 text-green-600">timeline</i>
              Actividad Reciente
            </h3>
            <div class="space-y-4">
              @for (activity of recentActivity(); track activity.id) {
                <div
                  class="flex items-start space-x-4 rounded-lg p-3 transition-colors hover:bg-gray-50"
                >
                  <div
                    class="rounded-lg p-2"
                    [ngClass]="{
                      'bg-blue-100': activity.type === 'user',
                      'bg-green-100': activity.type === 'university',
                      'bg-purple-100': activity.type === 'event',
                      'bg-orange-100': activity.type === 'system',
                    }"
                  >
                    <i
                      class="material-icons text-sm"
                      [ngClass]="{
                        'text-blue-600': activity.type === 'user',
                        'text-green-600': activity.type === 'university',
                        'text-purple-600': activity.type === 'event',
                        'text-orange-600': activity.type === 'system',
                      }"
                      >{{ activity.icon }}</i
                    >
                  </div>
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
                    <p class="text-sm text-gray-600">{{ activity.description }}</p>
                    <p class="mt-1 text-xs text-gray-500">{{ activity.time }}</p>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 class="mb-6 flex items-center text-lg font-semibold text-gray-900">
            <i class="material-icons text-orange-600 mr-2">flash_on</i>
            Acciones Rápidas
          </h3>
          <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
            <button
              (click)="quickAction('users')"
              class="group rounded-lg border border-gray-200 p-4 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50"
            >
              <div class="flex flex-col items-center space-y-2">
                <div class="rounded-lg bg-blue-100 p-3 transition-colors group-hover:bg-blue-200">
                  <i class="material-icons text-blue-600">people</i>
                </div>
                <span class="text-sm font-medium text-gray-900">Gestionar Usuarios</span>
              </div>
            </button>

            <button
              (click)="quickAction('universities')"
              class="group rounded-lg border border-gray-200 p-4 transition-all duration-200 hover:border-green-300 hover:bg-green-50"
            >
              <div class="flex flex-col items-center space-y-2">
                <div class="rounded-lg bg-green-100 p-3 transition-colors group-hover:bg-green-200">
                  <i class="material-icons text-green-600">school</i>
                </div>
                <span class="text-sm font-medium text-gray-900">Universidades</span>
              </div>
            </button>

            <button
              (click)="quickAction('events')"
              class="group rounded-lg border border-gray-200 p-4 transition-all duration-200 hover:border-purple-300 hover:bg-purple-50"
            >
              <div class="flex flex-col items-center space-y-2">
                <div
                  class="rounded-lg bg-purple-100 p-3 transition-colors group-hover:bg-purple-200"
                >
                  <i class="material-icons text-purple-600">event</i>
                </div>
                <span class="text-sm font-medium text-gray-900">Eventos</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Management Modules Grid -->
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <!-- Users Management -->
          <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="flex items-center text-lg font-semibold text-gray-900">
                <svg
                  class="mr-2 h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0a1.5 1.5 0 001.5-1.5V7.5A1.5 1.5 0 0021 6h-2.25A1.5 1.5 0 0016.5 7.5v11.25"
                  ></path>
                </svg>
                Gestión de Usuarios
              </h3>
              <button
                (click)="navigateTo('/admin/users')"
                class="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Ver todos
              </button>
            </div>
            <p class="mb-4 text-sm text-gray-600">
              Administrar usuarios, roles y permisos del sistema
            </p>
            <div class="grid grid-cols-2 gap-3">
              <button
                (click)="navigateTo('/admin/users/list')"
                class="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
              >
                Lista de Usuarios
              </button>
              <button
                (click)="navigateTo('/admin/roles')"
                class="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
              >
                Gestión de Roles
              </button>
            </div>
          </div>

          <!-- Universities Management -->
          <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="flex items-center text-lg font-semibold text-gray-900">
                <svg
                  class="mr-2 h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  ></path>
                </svg>
                Universidades
              </h3>
              <button
                (click)="navigateTo('/admin/universities')"
                class="text-sm font-medium text-green-600 hover:text-green-700"
              >
                Ver todas
              </button>
            </div>
            <p class="mb-4 text-sm text-gray-600">Administrar instituciones educativas asociadas</p>
            <div class="grid grid-cols-2 gap-3">
              <button
                (click)="navigateTo('/admin/universities/list')"
                class="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-100"
              >
                Ver Universidades
              </button>
              <button
                (click)="navigateTo('/admin/universities/new')"
                class="rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-100"
              >
                Agregar Nueva
              </button>
            </div>
          </div>

          <!-- Events Management -->
          <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="flex items-center text-lg font-semibold text-gray-900">
                <svg
                  class="mr-2 h-6 w-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                Eventos
              </h3>
              <button
                (click)="navigateTo('/admin/events')"
                class="text-sm font-medium text-purple-600 hover:text-purple-700"
              >
                Ver todos
              </button>
            </div>
            <p class="mb-4 text-sm text-gray-600">Gestionar eventos y webinars de la plataforma</p>
            <div class="grid grid-cols-2 gap-3">
              <button
                (click)="navigateTo('/admin/events')"
                class="rounded-lg bg-purple-50 px-3 py-2 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-100"
              >
                Lista de Eventos
              </button>
              <button
                (click)="navigateTo('/admin/events')"
                class="rounded-lg bg-purple-50 px-3 py-2 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-100"
              >
                Crear Evento
              </button>
            </div>
          </div>

          <!-- Projects Management -->
          <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="flex items-center text-lg font-semibold text-gray-900">
                <svg
                  class="text-indigo-600 mr-2 h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  ></path>
                </svg>
                Proyectos
              </h3>
              <button
                (click)="navigateTo('/admin/proyectos')"
                class="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                Ver todos
              </button>
            </div>
            <p class="mb-4 text-sm text-gray-600">
              Supervisar proyectos colaborativos de estudiantes
            </p>
            <div class="grid grid-cols-2 gap-3">
              <button
                (click)="navigateTo('/admin/proyectos/list')"
                class="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              >
                Todos los Proyectos
              </button>
              <button
                (click)="navigateTo('/admin/proyectos/pending')"
                class="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              >
                Pendientes
              </button>
            </div>
          </div>

          <!-- Forums Management -->
          <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="flex items-center text-lg font-semibold text-gray-900">
                <svg
                  class="text-pink-600 mr-2 h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  ></path>
                </svg>
                Foros
              </h3>
              <button
                (click)="navigateTo('/admin/foros')"
                class="text-pink-600 hover:text-pink-700 text-sm font-medium"
              >
                Ver todos
              </button>
            </div>
            <p class="mb-4 text-sm text-gray-600">Moderar foros y discusiones académicas</p>
            <div class="grid grid-cols-2 gap-3">
              <button
                (click)="navigateTo('/admin/foros')"
                class="bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              >
                Lista de Foros
              </button>
              <button
                (click)="navigateTo('/admin/conversations')"
                class="bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              >
                Conversaciones
              </button>
            </div>
          </div>

          <!-- System Management -->
          <div class="rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
            <div class="mb-4 flex items-center justify-between">
              <h3 class="flex items-center text-lg font-semibold text-gray-900">
                <svg
                  class="text-orange-600 mr-2 h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
                Sistema
              </h3>
              <button
                (click)="navigateTo('/admin/settings')"
                class="text-orange-600 hover:text-orange-700 text-sm font-medium"
              >
                Configurar
              </button>
            </div>
            <p class="mb-4 text-sm text-gray-600">Configuración y mantenimiento del sistema</p>
            <div class="grid grid-cols-2 gap-3">
              <button
                (click)="navigateTo('/admin/backups')"
                class="bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              >
                Backups
              </button>
              <button
                (click)="navigateTo('/admin/reports')"
                class="bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              >
                Reportes
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class AdminDashboardComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly universityService = inject(UniversityService);
  private readonly eventService = inject(EventService);
  private readonly router = inject(Router);

  readonly isLoading = signal(true);
  readonly stats = signal<DashboardStats>({
    totalUsers: 0,
    totalUniversities: 0,
    totalEvents: 0,
    activeEvents: 0,
    recentUsers: 0,
    studentsCount: 0,
    graduatesCount: 0,
    adminsCount: 0,
  });

  readonly recentActivity = signal<RecentActivity[]>([]);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  private loadDashboardData(): void {
    this.isLoading.set(true);

    forkJoin({
      users: this.userService.getAll(),
      universities: this.universityService.getAll(),
      events: this.eventService.getAll(),
    }).subscribe({
      next: ({ users, universities, events }) => {
        // Asegurar que tenemos arrays válidos
        const usersArray = Array.isArray(users) ? users : [];
        const universitiesArray = Array.isArray(universities) ? universities : [];
        const eventsArray = Array.isArray(events) ? events : [];

        // Procesar usuarios por rol
        const usersByRole = this.groupUsersByRole(usersArray);

        // Calcular eventos activos (próximos 30 días)
        const activeEvents = this.getActiveEvents(eventsArray);

        // Usuarios recientes (última semana)
        const recentUsers = this.getRecentUsers(usersArray);

        const newStats = {
          totalUsers: usersArray.length,
          totalUniversities: universitiesArray.length,
          totalEvents: eventsArray.length,
          activeEvents: activeEvents.length,
          recentUsers: recentUsers.length,
          studentsCount: usersByRole.students,
          graduatesCount: usersByRole.graduates,
          adminsCount: usersByRole.admins,
        };

        this.stats.set(newStats);

        // Generar actividad reciente
        this.generateRecentActivity(usersArray, universitiesArray, eventsArray);

        this.isLoading.set(false);
      },
      error: error => {
        console.error('Error loading dashboard data:', error);
        this.isLoading.set(false);
      },
    });
  }

  private groupUsersByRole(users: unknown[]): {
    students: number;
    graduates: number;
    admins: number;
  } {
    return (users as DashboardUser[]).reduce(
      (acc, user) => {
        // Verificar que user y user.role existan antes de acceder a las propiedades
        if (user && user.role && user.role.id !== undefined && user.role.id !== null) {
          switch (user.role.id) {
            case 2:
              acc.students++;
              break;
            case 3:
              acc.graduates++;
              break;
            case 1:
            case 9:
              acc.admins++;
              break;
          }
        }
        return acc;
      },
      { students: 0, graduates: 0, admins: 0 },
    );
  }

  private getActiveEvents(events: unknown[]): unknown[] {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return (events as DashboardEvent[]).filter(event => {
      const eventDate = new Date(event.fechaInicio);
      return eventDate > now && eventDate <= thirtyDaysFromNow;
    });
  }

  private getRecentUsers(users: unknown[]): unknown[] {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    return (users as DashboardUser[]).filter(user => {
      if (!user.fechaCreacion) return false;
      const userDate = new Date(user.fechaCreacion);
      return userDate > oneWeekAgo;
    });
  }

  private generateRecentActivity(
    users: unknown[],
    _universities: unknown[],
    events: unknown[],
  ): void {
    const activities: RecentActivity[] = [];

    // Agregar usuarios recientes
    const recentUsers = this.getRecentUsers(users).slice(0, 3) as DashboardUser[];
    recentUsers.forEach((user: DashboardUser) => {
      activities.push({
        id: activities.length + 1,
        type: 'user',
        icon: 'person_add',
        title: 'Nuevo usuario registrado',
        description: `${user.nombre} se registró recientemente`,
        time: this.getRelativeTime(user.fechaCreacion),
        user: user.nombre,
      });
    });

    // Agregar eventos recientes
    const recentEvents = (events as DashboardEvent[])
      .sort(
        (a: DashboardEvent, b: DashboardEvent) =>
          new Date(b.fechaCreacion || 0).getTime() - new Date(a.fechaCreacion || 0).getTime(),
      )
      .slice(0, 2);

    recentEvents.forEach((event: DashboardEvent) => {
      activities.push({
        id: activities.length + 1,
        type: 'event',
        icon: 'event',
        title: 'Nuevo evento creado',
        description: `${event.titulo} programado para ${new Date(event.fechaInicio).toLocaleDateString('es-ES')}`,
        time: this.getRelativeTime(event.fechaCreacion),
      });
    });

    // Actividad del sistema
    activities.push({
      id: activities.length + 1,
      type: 'system',
      icon: 'backup',
      title: 'Respaldo automático completado',
      description: 'Base de datos respaldada exitosamente',
      time: 'Hace 2 horas',
    });

    this.recentActivity.set(activities.slice(0, 6));
  }

  private getRelativeTime(dateString: string): string {
    if (!dateString) return 'Hace poco';

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));

    if (diffMinutes < 60) return `Hace ${diffMinutes} minutos`;
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    if (diffDays === 1) return 'Ayer';
    return `Hace ${diffDays} días`;
  }

  getCurrentTime(): string {
    return new Date().toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  getPercentage(value: number, total: number): number {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  }

  quickAction(action: string): void {
    switch (action) {
      case 'users':
        this.router.navigate(['/admin/users']);
        break;
      case 'universities':
        this.router.navigate(['/admin/universities']);
        break;
      case 'events':
        this.router.navigate(['/admin/eventos']);
        break;
      case 'reports':
        this.router.navigate(['/admin/reports']);
        break;
    }
  }
}
