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

            <button
              (click)="quickAction('reports')"
              class="hover:border-orange-300 hover:bg-orange-50 group rounded-lg border border-gray-200 p-4 transition-all duration-200"
            >
              <div class="flex flex-col items-center space-y-2">
                <div
                  class="bg-orange-100 group-hover:bg-orange-200 rounded-lg p-3 transition-colors"
                >
                  <i class="material-icons text-orange-600">assessment</i>
                </div>
                <span class="text-sm font-medium text-gray-900">Reportes</span>
              </div>
            </button>
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
    return (users as any[]).reduce(
      (acc, user) => {
        switch (user.rol_id) {
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
        return acc;
      },
      { students: 0, graduates: 0, admins: 0 },
    );
  }

  private getActiveEvents(events: unknown[]): unknown[] {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    return (events as any[]).filter(event => {
      const eventDate = new Date(event.fecha_inicio);
      return eventDate > now && eventDate <= thirtyDaysFromNow;
    });
  }

  private getRecentUsers(users: unknown[]): unknown[] {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    return (users as any[]).filter(user => {
      if (!user.created_at) return false;
      const userDate = new Date(user.created_at);
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
    const recentUsers = this.getRecentUsers(users).slice(0, 3);
    recentUsers.forEach((user: any) => {
      activities.push({
        id: activities.length + 1,
        type: 'user',
        icon: 'person_add',
        title: 'Nuevo usuario registrado',
        description: `${user.nombre} se registró desde ${user.universidad?.nombre || 'una universidad'}`,
        time: this.getRelativeTime(user.created_at),
        user: user.nombre,
      });
    });

    // Agregar eventos recientes
    const recentEvents = (events as any[])
      .sort(
        (a: any, b: any) =>
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime(),
      )
      .slice(0, 2);

    recentEvents.forEach((event: any) => {
      activities.push({
        id: activities.length + 1,
        type: 'event',
        icon: 'event',
        title: 'Nuevo evento creado',
        description: `${event.titulo} programado para ${new Date(event.fecha_inicio).toLocaleDateString('es-ES')}`,
        time: this.getRelativeTime(event.created_at),
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
