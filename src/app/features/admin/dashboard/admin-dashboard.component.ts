import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { EventService } from '@app/core/services/event/event.service';
import { UniversityService } from '@app/core/services/university/university.service';
import { UserService } from '@app/core/services/user/user.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="rounded-lg bg-white p-6 shadow-soft">
        <h1 class="text-3xl font-bold text-text-base">Dashboard Administrativo</h1>
        <p class="mt-2 text-text-muted">Vista general del sistema Union</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-lg border-l-4 border-primary-500 bg-white p-6 shadow-soft">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-neutral-600">Total Usuarios</p>
              <p class="text-3xl font-bold text-text-base">{{ stats().totalUsers }}</p>
            </div>
            <div class="rounded-full bg-primary-100 p-3">
              <span class="text-2xl">👥</span>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-green-600 text-xs">+12% este mes</span>
          </div>
        </div>

        <div class="rounded-lg border-l-4 border-secondary-500 bg-white p-6 shadow-soft">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-neutral-600">Universidades</p>
              <p class="text-3xl font-bold text-text-base">{{ stats().totalUniversities }}</p>
            </div>
            <div class="rounded-full bg-secondary-100 p-3">
              <span class="text-2xl">🏛️</span>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-green-600 text-xs">+2 nuevas</span>
          </div>
        </div>

        <div class="rounded-lg border-l-4 border-accent-500 bg-white p-6 shadow-soft">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-neutral-600">Eventos Activos</p>
              <p class="text-3xl font-bold text-text-base">{{ stats().totalEvents }}</p>
            </div>
            <div class="rounded-full bg-accent-100 p-3">
              <span class="text-2xl">📅</span>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-blue-600 text-xs">15 próximos</span>
          </div>
        </div>

        <div class="rounded-lg border-l-4 border-info-500 bg-white p-6 shadow-soft">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-neutral-600">Conexiones Hoy</p>
              <p class="text-3xl font-bold text-text-base">{{ stats().dailyConnections }}</p>
            </div>
            <div class="rounded-full bg-info-100 p-3">
              <span class="text-2xl">🔗</span>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-green-600 text-xs">+8% vs ayer</span>
          </div>
        </div>
      </div>

      <!-- Recent Activity and Quick Actions -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Recent Activity -->
        <div class="rounded-lg bg-white p-6 shadow-soft">
          <h3 class="mb-4 text-lg font-semibold text-text-base">Actividad Reciente</h3>
          <div class="space-y-4">
            @for (activity of recentActivity(); track activity.id) {
              <div
                class="flex items-start space-x-3 rounded-lg p-3 transition-colors hover:bg-neutral-50"
              >
                <div class="rounded-full bg-primary-100 p-2">
                  <span class="text-sm">{{ activity.icon }}</span>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium text-text-base">{{ activity.title }}</p>
                  <p class="text-xs text-text-muted">{{ activity.description }}</p>
                  <p class="mt-1 text-xs text-neutral-500">{{ activity.time }}</p>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="rounded-lg bg-white p-6 shadow-soft">
          <h3 class="mb-4 text-lg font-semibold text-text-base">Acciones Rápidas</h3>
          <div class="grid grid-cols-2 gap-4">
            <button
              class="group rounded-lg border border-border p-4 transition-colors hover:border-primary-300 hover:bg-primary-50"
            >
              <div class="mb-2 text-2xl transition-transform group-hover:scale-110">👤</div>
              <p class="text-sm font-medium text-text-base">Nuevo Usuario</p>
            </button>

            <button
              class="group rounded-lg border border-border p-4 transition-colors hover:border-secondary-300 hover:bg-secondary-50"
            >
              <div class="mb-2 text-2xl transition-transform group-hover:scale-110">🏛️</div>
              <p class="text-sm font-medium text-text-base">Nueva Universidad</p>
            </button>

            <button
              class="group rounded-lg border border-border p-4 transition-colors hover:border-accent-300 hover:bg-accent-50"
            >
              <div class="mb-2 text-2xl transition-transform group-hover:scale-110">📅</div>
              <p class="text-sm font-medium text-text-base">Crear Evento</p>
            </button>

            <button
              class="group rounded-lg border border-border p-4 transition-colors hover:border-info-300 hover:bg-info-50"
            >
              <div class="mb-2 text-2xl transition-transform group-hover:scale-110">📊</div>
              <p class="text-sm font-medium text-text-base">Ver Reportes</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminDashboardComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly universityService = inject(UniversityService);
  private readonly eventService = inject(EventService);

  readonly stats = signal({
    totalUsers: 0,
    totalUniversities: 0,
    totalEvents: 0,
    dailyConnections: 42,
  });

  readonly recentActivity = signal([
    {
      id: 1,
      icon: '👤',
      title: 'Nuevo usuario registrado',
      description: 'Ana García se registró desde Universidad Nacional',
      time: 'Hace 5 minutos',
    },
    {
      id: 2,
      icon: '📅',
      title: 'Evento creado',
      description: 'Hackathón de IA 2024 programado para el 15 de marzo',
      time: 'Hace 15 minutos',
    },
    {
      id: 3,
      icon: '🏛️',
      title: 'Universidad agregada',
      description: 'Universidad de los Andes se unió a la plataforma',
      time: 'Hace 1 hora',
    },
  ]);

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    // Cargar usuarios
    this.userService.getAll().subscribe(users => {
      this.stats.update(current => ({
        ...current,
        totalUsers: users.data?.length || 0,
      }));
    });

    // Cargar universidades
    this.universityService.getAll().subscribe(universities => {
      this.stats.update(current => ({
        ...current,
        totalUniversities: universities.length,
      }));
    });

    // Cargar eventos
    this.eventService.getAll().subscribe(events => {
      this.stats.update(current => ({
        ...current,
        totalEvents: events.data?.length || 0,
      }));
    });
  }
}
