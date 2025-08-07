import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectService } from '@app/core/services/project/project.service';

@Component({
  selector: 'app-admin-uni-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="space-y-6 p-6">
      <!-- Header del Dashboard -->
      <div class="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold">Dashboard Administrativo Universitario</h1>
            <p class="mt-1 text-blue-100">Gestiona tu institución académica</p>
          </div>
          <div class="text-4xl">🏛️</div>
        </div>
      </div>

      <!-- Métricas principales -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Estudiantes</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats().totalStudents }}</p>
            </div>
            <div class="text-2xl">👥</div>
          </div>
          <p class="mt-2 text-xs text-green-600">+5% este mes</p>
        </div>

        <div class="rounded-xl border bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Proyectos Pendientes</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats().pendingProjects }}</p>
            </div>
            <div class="text-2xl">📋</div>
          </div>
          <p class="text-orange-600 mt-2 text-xs">5 requieren verificación</p>
        </div>

        <div class="rounded-xl border bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Eventos Activos</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats().totalEvents }}</p>
            </div>
            <div class="text-2xl">📅</div>
          </div>
          <p class="mt-2 text-xs text-blue-600">3 próximos</p>
        </div>

        <div class="rounded-xl border bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Oportunidades</p>
              <p class="text-2xl font-bold text-gray-900">{{ stats().totalOpportunities }}</p>
            </div>
            <div class="text-2xl">💼</div>
          </div>
          <p class="mt-2 text-xs text-purple-600">2 nuevas hoy</p>
        </div>
      </div>

      <!-- Sección de actividades y acciones -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Actividad reciente -->
        <div class="rounded-xl border bg-white shadow-sm">
          <div class="p-6">
            <h3 class="mb-4 text-lg font-semibold text-gray-900">📊 Actividad Reciente</h3>
            <div class="space-y-4">
              <div class="flex items-start space-x-3">
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                  <span class="text-sm text-green-600">✓</span>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">Proyecto verificado</p>
                  <p class="text-xs text-gray-600">"Sistema IoT" aprobado para Ana Torres</p>
                  <p class="text-xs text-gray-400">Hace 15 minutos</p>
                </div>
              </div>

              <div class="flex items-start space-x-3">
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                  <span class="text-sm text-blue-600">👤</span>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">Nuevo estudiante registrado</p>
                  <p class="text-xs text-gray-600">Carlos Mendez - Ing. Sistemas</p>
                  <p class="text-xs text-gray-400">Hace 1 hora</p>
                </div>
              </div>

              <div class="flex items-start space-x-3">
                <div class="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                  <span class="text-sm text-purple-600">📅</span>
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
        <div class="rounded-xl border bg-white shadow-sm">
          <div class="p-6">
            <h3 class="mb-4 text-lg font-semibold text-gray-900">⚡ Acciones Rápidas</h3>
            <div class="space-y-3">
              <a
                href="/admin-uni/projects"
                class="flex w-full items-center space-x-3 rounded-lg bg-blue-50 p-3 text-left transition-colors hover:bg-blue-100"
              >
                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <span class="text-blue-600">✓</span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">Verificar Proyectos</p>
                  <p class="text-sm text-gray-600">
                    {{ stats().pendingProjects }} proyectos pendientes
                  </p>
                </div>
              </a>

              <!-- <button
                class="flex w-full items-center space-x-3 rounded-lg bg-green-50 p-3 text-left transition-colors hover:bg-green-100"
              >
                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <span class="text-green-600">👥</span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">Aprobar Estudiantes</p>
                  <p class="text-sm text-gray-600">12 solicitudes pendientes</p>
                </div>
              </button> -->

              <a
                href="/admin-uni/events"
                class="flex w-full items-center space-x-3 rounded-lg bg-purple-50 p-3 text-left transition-colors hover:bg-purple-100"
              >
                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <span class="text-purple-600">📅</span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">Crear Evento</p>
                  <p class="text-sm text-gray-600">Organizar actividad académica</p>
                </div>
              </a>

              <!-- <button
                class="bg-orange-50 hover:bg-orange-100 flex w-full items-center space-x-3 rounded-lg p-3 text-left transition-colors"
              >
                <div class="bg-orange-100 flex h-10 w-10 items-center justify-center rounded-lg">
                  <span class="text-orange-600">💼</span>
                </div>
                <div>
                  <p class="font-medium text-gray-900">Publicar Oportunidad</p>
                  <p class="text-sm text-gray-600">Becas, intercambios, programas</p>
                </div>
              </button> -->
            </div>
          </div>
        </div>
      </div>

      <!-- Próximos eventos -->
      <div class="rounded-xl border bg-white shadow-sm">
        <div class="p-6">
          <h3 class="mb-4 text-lg font-semibold text-gray-900">📅 Próximos Eventos</h3>
          <div class="py-8 text-center">
            <div class="mb-2 text-4xl">📅</div>
            <p class="text-gray-600">No hay eventos próximos</p>
            <button class="mt-2 text-sm text-blue-600 hover:text-blue-800">
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
    pendingProjects: 0, // Inicializado en 0
    totalEvents: 3,
    totalOpportunities: 8,
  });

  readonly stats = this._stats.asReadonly();

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    this.projectService.getAll().subscribe({
      next: projects => {
        const pendientes = projects.data.filter(
          p => p.estado_verificacion === 'pendiente', // ojo con la minúscula
        );

        this._stats.update(prev => ({
          ...prev,
          pendingProjects: pendientes.length,
        }));
      },
      error: err => {
        console.error('Error al cargar proyectos:', err);
      },
    });
  }
}
