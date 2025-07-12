import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit } from '@angular/core';
import { UserService } from '@app/core/services/user/user.service';
import { UniversityService } from '@app/core/services/university/university.service';
import { EventService } from '@app/core/services/event/event.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="bg-white rounded-lg shadow-soft p-6">
        <h1 class="text-3xl font-bold text-text-base">Dashboard Administrativo</h1>
        <p class="text-text-muted mt-2">Vista general del sistema Union</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow-soft p-6 border-l-4 border-primary-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-neutral-600">Total Usuarios</p>
              <p class="text-3xl font-bold text-text-base">{{ stats().totalUsers }}</p>
            </div>
            <div class="p-3 bg-primary-100 rounded-full">
              <span class="text-2xl">👥</span>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-green-600">+12% este mes</span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-soft p-6 border-l-4 border-secondary-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-neutral-600">Universidades</p>
              <p class="text-3xl font-bold text-text-base">{{ stats().totalUniversities }}</p>
            </div>
            <div class="p-3 bg-secondary-100 rounded-full">
              <span class="text-2xl">🏛️</span>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-green-600">+2 nuevas</span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-soft p-6 border-l-4 border-accent-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-neutral-600">Eventos Activos</p>
              <p class="text-3xl font-bold text-text-base">{{ stats().totalEvents }}</p>
            </div>
            <div class="p-3 bg-accent-100 rounded-full">
              <span class="text-2xl">📅</span>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-blue-600">15 próximos</span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-soft p-6 border-l-4 border-info-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-neutral-600">Conexiones Hoy</p>
              <p class="text-3xl font-bold text-text-base">{{ stats().dailyConnections }}</p>
            </div>
            <div class="p-3 bg-info-100 rounded-full">
              <span class="text-2xl">🔗</span>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-xs text-green-600">+8% vs ayer</span>
          </div>
        </div>
      </div>

      <!-- Recent Activity and Quick Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Recent Activity -->
        <div class="bg-white rounded-lg shadow-soft p-6">
          <h3 class="text-lg font-semibold text-text-base mb-4">Actividad Reciente</h3>
          <div class="space-y-4">
            @for (activity of recentActivity(); track activity.id) {
              <div class="flex items-start space-x-3 p-3 hover:bg-neutral-50 rounded-lg transition-colors">
                <div class="p-2 bg-primary-100 rounded-full">
                  <span class="text-sm">{{ activity.icon }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-text-base">{{ activity.title }}</p>
                  <p class="text-xs text-text-muted">{{ activity.description }}</p>
                  <p class="text-xs text-neutral-500 mt-1">{{ activity.time }}</p>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-lg shadow-soft p-6">
          <h3 class="text-lg font-semibold text-text-base mb-4">Acciones Rápidas</h3>
          <div class="grid grid-cols-2 gap-4">
            <button class="p-4 border border-border rounded-lg hover:bg-primary-50 hover:border-primary-300 transition-colors group">
              <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">👤</div>
              <p class="text-sm font-medium text-text-base">Nuevo Usuario</p>
            </button>
            
            <button class="p-4 border border-border rounded-lg hover:bg-secondary-50 hover:border-secondary-300 transition-colors group">
              <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">🏛️</div>
              <p class="text-sm font-medium text-text-base">Nueva Universidad</p>
            </button>
            
            <button class="p-4 border border-border rounded-lg hover:bg-accent-50 hover:border-accent-300 transition-colors group">
              <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">📅</div>
              <p class="text-sm font-medium text-text-base">Crear Evento</p>
            </button>
            
            <button class="p-4 border border-border rounded-lg hover:bg-info-50 hover:border-info-300 transition-colors group">
              <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">📊</div>
              <p class="text-sm font-medium text-text-base">Ver Reportes</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly universityService = inject(UniversityService);
  private readonly eventService = inject(EventService);

  readonly stats = signal({
    totalUsers: 0,
    totalUniversities: 0,
    totalEvents: 0,
    dailyConnections: 42
  });

  readonly recentActivity = signal([
    {
      id: 1,
      icon: '👤',
      title: 'Nuevo usuario registrado',
      description: 'Ana García se registró desde Universidad Nacional',
      time: 'Hace 5 minutos'
    },
    {
      id: 2,
      icon: '📅',
      title: 'Evento creado',
      description: 'Hackathón de IA 2024 programado para el 15 de marzo',
      time: 'Hace 15 minutos'
    },
    {
      id: 3,
      icon: '🏛️',
      title: 'Universidad agregada',
      description: 'Universidad de los Andes se unió a la plataforma',
      time: 'Hace 1 hora'
    }
  ]);

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats(): void {
    // Cargar usuarios
    this.userService.getAll().subscribe(users => {
      this.stats.update(current => ({
        ...current,
        totalUsers: users.length
      }));
    });

    // Cargar universidades
    this.universityService.getAll().subscribe(universities => {
      this.stats.update(current => ({
        ...current,
        totalUniversities: universities.length
      }));
    });

    // Cargar eventos
    this.eventService.getAll().subscribe(events => {
      this.stats.update(current => ({
        ...current,
        totalEvents: events.length
      }));
    });
  }
}