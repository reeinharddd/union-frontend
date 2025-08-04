import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-uni-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-6 space-y-6">
      <!-- Header del Dashboard -->
      <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold">Dashboard Administrativo Universitario</h1>
            <p class="text-blue-100 mt-1">Gestiona tu institución académica</p>
          </div>
          <div class="text-4xl">🏛️</div>
        </div>
      </div>

      <!-- Métricas principales -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-xl shadow-sm border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Estudiantes</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats().totalStudents }}</p>
            </div>
            <div class="text-2xl">👥</div>
          </div>
          <p class="text-xs text-green-600 mt-2">+5% este mes</p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Proyectos Pendientes</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats().pendingProjects }}</p>
            </div>
            <div class="text-2xl">📋</div>
          </div>
          <p class="text-xs text-orange-600 mt-2">5 requieren verificación</p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Eventos Activos</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats().totalEvents }}</p>
            </div>
            <div class="text-2xl">📅</div>
          </div>
          <p class="text-xs text-blue-600 mt-2">3 próximos</p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Oportunidades</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats().totalOpportunities }}</p>
            </div>
            <div class="text-2xl">💼</div>
          </div>
          <p class="text-xs text-purple-600 mt-2">2 nuevas hoy</p>
        </div>
      </div>

      <!-- Sección de actividades y acciones -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Actividad reciente -->
        <div class="bg-white rounded-xl shadow-sm border">
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">📊 Actividad Reciente</h3>
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span class="text-green-600 text-sm">✓</span>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">Proyecto verificado</p>
                  <p class="text-xs text-gray-600">"Sistema IoT" aprobado para Ana Torres</p>
                  <p class="text-xs text-gray-400">Hace 15 minutos</p>
                </div>
              </div>

              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span class="text-blue-600 text-sm">👤</span>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">Nuevo estudiante registrado</p>
                  <p class="text-xs text-gray-600">Carlos Mendez - Ing. Sistemas</p>
                  <p class="text-xs text-gray-400">Hace 1 hora</p>
                </div>
              </div>

              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span class="text-purple-600 text-sm">📅</span>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">Evento programado</p>
                  <p class="text-xs text-gray-600">Workshop Angular 17 - 15 Nov</p>
                  <p class="text-xs text-gray-400">Hace 2 horas</p>
                </div>
              </div>
            </div>
            <button class="mt-4 text-sm text-blue-600 hover:text-blue-800">
              Ver toda la actividad →
            </button>
          </div>
        </div>

        <!-- Acciones rápidas -->
        <div class="bg-white rounded-xl shadow-sm border">
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">⚡ Acciones Rápidas</h3>
            <div class="space-y-3">
              <button class="w-full flex items-center space-x-3 p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span class="text-blue-600">✓</span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">Verificar Proyectos</p>
                  <p class="text-sm text-gray-600">5 proyectos pendientes</p>
                </div>
              </button>

              <button class="w-full flex items-center space-x-3 p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span class="text-green-600">👥</span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">Aprobar Estudiantes</p>
                  <p class="text-sm text-gray-600">12 solicitudes pendientes</p>
                </div>
              </button>

              <button class="w-full flex items-center space-x-3 p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span class="text-purple-600">📅</span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">Crear Evento</p>
                  <p class="text-sm text-gray-600">Organizar actividad académica</p>
                </div>
              </button>

              <button class="w-full flex items-center space-x-3 p-3 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
                <div class="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span class="text-orange-600">💼</span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">Publicar Oportunidad</p>
                  <p class="text-sm text-gray-600">Becas, intercambios, programas</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Próximos eventos -->
      <div class="bg-white rounded-xl shadow-sm border">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">📅 Próximos Eventos</h3>
          <div class="text-center py-8">
            <div class="text-4xl mb-2">📅</div>
            <p class="text-gray-600">No hay eventos próximos</p>
            <button class="mt-2 text-blue-600 hover:text-blue-800 text-sm">
              Crear nuevo evento
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminUniDashboardComponent {
  // Estado local para estadísticas
  private readonly _stats = signal({
    totalStudents: 156,
    pendingProjects: 5,
    totalEvents: 3,
    totalOpportunities: 8,
  });

  readonly stats = this._stats.asReadonly();

  constructor() {
    // Cargar datos iniciales
    this.loadDashboardData();
  }

  private loadDashboardData() {
    // Aquí puedes cargar datos reales desde los servicios
    // Por ahora usamos datos de ejemplo
  }
}
