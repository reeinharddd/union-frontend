import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

// Services
import { EventService } from '@app/core/services/event/event.service';
import { ForumService } from '@app/core/services/forum/forum.service';
import { OpportunityService } from '@app/core/services/opportunity/opportunity.service';
import { ProjectService } from '@app/core/services/project/project.service';
import { UniversityService } from '@app/core/services/university/university.service';
import { UserService } from '@app/core/services/user/user.service';

interface DashboardStats {
  totalUsers: number;
  totalUniversities: number;
  totalEvents: number;
  totalProjects: number;
  totalOpportunities: number;
  totalForums: number;
  activeEvents: number;
  recentUsers: number;
  studentsCount: number;
  graduatesCount: number;
  adminsCount: number;
  pendingProjects: number;
  verifiedProjects: number;
  virtualEvents: number;
  presentialEvents: number;
}

interface RecentActivity {
  id: number;
  type: 'user' | 'university' | 'event' | 'project' | 'forum' | 'opportunity' | 'system';
  icon: string;
  title: string;
  description: string;
  time: string;
  user?: string;
}

interface DashboardUser {
  id: number;
  nombre: string;
  email: string;
  fechaCreacion: string;
  role: {
    id: number;
    name: string;
  };
}

interface DashboardEvent {
  id: number;
  titulo: string;
  fechaInicio: string;
  fechaCreacion?: string;
  modalidad: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 p-4">
      <div class="mx-auto max-w-7xl space-y-6">
        <!-- Page Header -->
        <div
          class="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white shadow-lg"
        >
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
            <div class="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
              <div class="flex items-center">
                <div class="rounded-lg bg-blue-100 p-3">
                  <i class="material-icons text-2xl text-blue-600">people</i>
                </div>
                <div class="ml-4 flex-1">
                  <p class="text-sm font-medium text-gray-600">Total Usuarios</p>
                  <p class="text-2xl font-bold text-gray-900">{{ stats().totalUsers | number }}</p>
                  <div class="mt-2">
                    <span
                      class="flex items-center rounded-full bg-green-100 px-2 py-1 text-xs text-green-800"
                    >
                      <i class="material-icons mr-1 text-xs">trending_up</i>
                      +{{ stats().recentUsers }} nuevos
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Universities -->
            <div class="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
              <div class="flex items-center">
                <div class="rounded-lg bg-green-100 p-3">
                  <i class="material-icons text-2xl text-green-600">school</i>
                </div>
                <div class="ml-4 flex-1">
                  <p class="text-sm font-medium text-gray-600">Universidades</p>
                  <p class="text-2xl font-bold text-gray-900">
                    {{ stats().totalUniversities | number }}
                  </p>
                  <div class="mt-2">
                    <span class="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                      Instituciones activas
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Projects -->
            <div class="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
              <div class="flex items-center">
                <div class="bg-indigo-100 rounded-lg p-3">
                  <i class="material-icons text-indigo-600 text-2xl">work</i>
                </div>
                <div class="ml-4 flex-1">
                  <p class="text-sm font-medium text-gray-600">Proyectos</p>
                  <p class="text-2xl font-bold text-gray-900">
                    {{ stats().totalProjects | number }}
                  </p>
                  <div class="mt-2 flex space-x-2">
                    <span class="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                      {{ stats().pendingProjects }} pendientes
                    </span>
                    <span class="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                      {{ stats().verifiedProjects }} verificados
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Events -->
            <div class="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
              <div class="flex items-center">
                <div class="rounded-lg bg-purple-100 p-3">
                  <i class="material-icons text-2xl text-purple-600">event</i>
                </div>
                <div class="ml-4 flex-1">
                  <p class="text-sm font-medium text-gray-600">Eventos</p>
                  <p class="text-2xl font-bold text-gray-900">{{ stats().totalEvents | number }}</p>
                  <div class="mt-2 flex space-x-2">
                    <span class="rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-800">
                      {{ stats().activeEvents }} activos
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Secondary Stats Grid -->
          <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            <!-- Opportunities -->
            <div class="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
              <div class="flex items-center">
                <div class="bg-teal-100 rounded-lg p-3">
                  <i class="material-icons text-teal-600 text-2xl">business_center</i>
                </div>
                <div class="ml-4 flex-1">
                  <p class="text-sm font-medium text-gray-600">Oportunidades</p>
                  <p class="text-2xl font-bold text-gray-900">
                    {{ stats().totalOpportunities | number }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Forums -->
            <div class="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
              <div class="flex items-center">
                <div class="bg-pink-100 rounded-lg p-3">
                  <i class="material-icons text-pink-600 text-2xl">forum</i>
                </div>
                <div class="ml-4 flex-1">
                  <p class="text-sm font-medium text-gray-600">Foros</p>
                  <p class="text-2xl font-bold text-gray-900">{{ stats().totalForums | number }}</p>
                </div>
              </div>
            </div>

            <!-- Virtual Events -->
            <div class="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
              <div class="flex items-center">
                <div class="rounded-lg bg-blue-100 p-3">
                  <i class="material-icons text-2xl text-blue-600">videocam</i>
                </div>
                <div class="ml-4 flex-1">
                  <p class="text-sm font-medium text-gray-600">Eventos Virtuales</p>
                  <p class="text-2xl font-bold text-gray-900">
                    {{ stats().virtualEvents | number }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Presential Events -->
            <div class="rounded-xl bg-white p-6 shadow-lg transition-all hover:shadow-xl">
              <div class="flex items-center">
                <div class="bg-amber-100 rounded-lg p-3">
                  <i class="material-icons text-amber-600 text-2xl">place</i>
                </div>
                <div class="ml-4 flex-1">
                  <p class="text-sm font-medium text-gray-600">Eventos Presenciales</p>
                  <p class="text-2xl font-bold text-gray-900">
                    {{ stats().presentialEvents | number }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Charts and Activity Section -->
          <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <!-- User Distribution -->
            <div class="rounded-xl bg-white p-6 shadow-lg">
              <h3 class="mb-6 flex items-center text-lg font-semibold text-gray-900">
                <i class="material-icons mr-2 text-blue-600">pie_chart</i>
                Distribución de Usuarios
              </h3>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="mr-3 h-4 w-4 rounded-full bg-blue-500"></div>
                    <span class="text-sm font-medium text-gray-600">Estudiantes</span>
                  </div>
                  <div class="text-right">
                    <span class="text-lg font-bold text-gray-900">{{ stats().studentsCount }}</span>
                    <div class="text-xs text-gray-500">
                      {{ getPercentage(stats().studentsCount, stats().totalUsers) }}%
                    </div>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="mr-3 h-4 w-4 rounded-full bg-green-500"></div>
                    <span class="text-sm font-medium text-gray-600">Graduados</span>
                  </div>
                  <div class="text-right">
                    <span class="text-lg font-bold text-gray-900">{{
                      stats().graduatesCount
                    }}</span>
                    <div class="text-xs text-gray-500">
                      {{ getPercentage(stats().graduatesCount, stats().totalUsers) }}%
                    </div>
                  </div>
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <div class="mr-3 h-4 w-4 rounded-full bg-purple-500"></div>
                    <span class="text-sm font-medium text-gray-600">Administradores</span>
                  </div>
                  <div class="text-right">
                    <span class="text-lg font-bold text-gray-900">{{ stats().adminsCount }}</span>
                    <div class="text-xs text-gray-500">
                      {{ getPercentage(stats().adminsCount, stats().totalUsers) }}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="rounded-xl bg-white p-6 shadow-lg lg:col-span-2">
              <h3 class="mb-6 flex items-center text-lg font-semibold text-gray-900">
                <i class="material-icons mr-2 text-green-600">timeline</i>
                Actividad Reciente
              </h3>
              <div class="space-y-3">
                @if (recentActivity().length === 0) {
                  <div class="flex items-center justify-center py-8 text-gray-500">
                    <i class="material-icons mr-2">info</i>
                    No hay actividad reciente disponible
                  </div>
                } @else {
                  @for (activity of recentActivity(); track activity.id) {
                    <div
                      class="flex items-start space-x-3 rounded-lg p-3 transition-colors hover:bg-gray-50"
                    >
                      <div
                        class="rounded-lg p-2"
                        [ngClass]="{
                          'bg-blue-100': activity.type === 'user',
                          'bg-green-100': activity.type === 'university',
                          'bg-purple-100': activity.type === 'event',
                          'bg-indigo-100': activity.type === 'project',
                          'bg-pink-100': activity.type === 'forum',
                          'bg-teal-100': activity.type === 'opportunity',
                          'bg-orange-100': activity.type === 'system',
                        }"
                      >
                        <i
                          class="material-icons text-sm"
                          [ngClass]="{
                            'text-blue-600': activity.type === 'user',
                            'text-green-600': activity.type === 'university',
                            'text-purple-600': activity.type === 'event',
                            'text-indigo-600': activity.type === 'project',
                            'text-pink-600': activity.type === 'forum',
                            'text-teal-600': activity.type === 'opportunity',
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
                }
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="rounded-xl bg-white p-6 shadow-lg">
            <h3 class="mb-6 flex items-center text-lg font-semibold text-gray-900">
              <i class="material-icons text-orange-600 mr-2">flash_on</i>
              Acciones Rápidas
            </h3>
            <div class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              <button
                (click)="quickAction('users')"
                class="group flex flex-col items-center rounded-lg border border-gray-200 p-4 transition-all hover:border-blue-300 hover:bg-blue-50"
              >
                <div
                  class="mb-3 rounded-lg bg-blue-100 p-3 transition-colors group-hover:bg-blue-200"
                >
                  <i class="material-icons text-blue-600">people</i>
                </div>
                <span class="text-center text-sm font-medium text-gray-900">Usuarios</span>
              </button>

              <button
                (click)="quickAction('universities')"
                class="group flex flex-col items-center rounded-lg border border-gray-200 p-4 transition-all hover:border-green-300 hover:bg-green-50"
              >
                <div
                  class="mb-3 rounded-lg bg-green-100 p-3 transition-colors group-hover:bg-green-200"
                >
                  <i class="material-icons text-green-600">school</i>
                </div>
                <span class="text-center text-sm font-medium text-gray-900">Universidades</span>
              </button>

              <button
                (click)="quickAction('events')"
                class="group flex flex-col items-center rounded-lg border border-gray-200 p-4 transition-all hover:border-purple-300 hover:bg-purple-50"
              >
                <div
                  class="mb-3 rounded-lg bg-purple-100 p-3 transition-colors group-hover:bg-purple-200"
                >
                  <i class="material-icons text-purple-600">event</i>
                </div>
                <span class="text-center text-sm font-medium text-gray-900">Eventos</span>
              </button>

              <button
                (click)="quickAction('create-project')"
                class="hover:border-indigo-300 hover:bg-indigo-50 group flex flex-col items-center rounded-lg border border-gray-200 p-4 transition-all"
              >
                <div
                  class="bg-indigo-100 group-hover:bg-indigo-200 mb-3 rounded-lg p-3 transition-colors"
                >
                  <i class="material-icons text-indigo-600">work</i>
                </div>
                <span class="text-center text-sm font-medium text-gray-900">Proyectos</span>
              </button>

              <button
                (click)="quickAction('create-forum')"
                class="hover:border-pink-300 hover:bg-pink-50 group flex flex-col items-center rounded-lg border border-gray-200 p-4 transition-all"
              >
                <div
                  class="bg-pink-100 group-hover:bg-pink-200 mb-3 rounded-lg p-3 transition-colors"
                >
                  <i class="material-icons text-pink-600">forum</i>
                </div>
                <span class="text-center text-sm font-medium text-gray-900">Foros</span>
              </button>

              <button
                (click)="quickAction('manage-opportunities')"
                class="hover:border-teal-300 hover:bg-teal-50 group flex flex-col items-center rounded-lg border border-gray-200 p-4 transition-all"
              >
                <div
                  class="bg-teal-100 group-hover:bg-teal-200 mb-3 rounded-lg p-3 transition-colors"
                >
                  <i class="material-icons text-teal-600">business_center</i>
                </div>
                <span class="text-center text-sm font-medium text-gray-900">Oportunidades</span>
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent implements OnInit {
  // Inject services
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly universityService = inject(UniversityService);
  private readonly eventService = inject(EventService);
  private readonly projectService = inject(ProjectService);
  private readonly forumService = inject(ForumService);
  private readonly opportunityService = inject(OpportunityService);

  // Signals
  readonly isLoading = signal(false);
  readonly stats = signal<DashboardStats>({
    totalUsers: 0,
    totalUniversities: 0,
    totalEvents: 0,
    totalProjects: 0,
    totalOpportunities: 0,
    totalForums: 0,
    activeEvents: 0,
    recentUsers: 0,
    studentsCount: 0,
    graduatesCount: 0,
    adminsCount: 0,
    pendingProjects: 0,
    verifiedProjects: 0,
    virtualEvents: 0,
    presentialEvents: 0,
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
      projects: this.projectService.getAll(),
      forums: this.forumService.getForums(),
      opportunities: this.opportunityService.getAll(),
    }).subscribe({
      next: ({ users, universities, events, projects, forums, opportunities }) => {
        // Asegurar que tenemos arrays válidos
        const usersArray = Array.isArray(users) ? users : [];
        const universitiesArray = Array.isArray(universities) ? universities : [];
        const eventsArray = Array.isArray(events) ? events : [];

        // Manejar la respuesta de proyectos que puede ser un objeto con propiedades
        let projectsArray: unknown[] = [];
        if (projects && typeof projects === 'object' && 'data' in projects) {
          projectsArray = Array.isArray((projects as { data: unknown[] }).data)
            ? (projects as { data: unknown[] }).data
            : [];
        } else if (Array.isArray(projects)) {
          projectsArray = projects;
        }

        const forumsArray = Array.isArray(forums) ? forums : [];
        const opportunitiesArray = Array.isArray(opportunities) ? opportunities : [];

        // Procesar usuarios por rol
        const usersByRole = this.groupUsersByRole(usersArray);

        // Calcular eventos activos (próximos 30 días)
        const activeEvents = this.getActiveEvents(eventsArray);

        // Usuarios recientes (última semana)
        const recentUsers = this.getRecentUsers(usersArray);

        // Calcular proyectos pendientes y verificados
        const pendingProjects = this.getPendingProjects(projectsArray);
        const verifiedProjects = this.getVerifiedProjects(projectsArray);

        const newStats = {
          totalUsers: usersArray.length,
          totalUniversities: universitiesArray.length,
          totalEvents: eventsArray.length,
          totalProjects: projectsArray.length,
          totalOpportunities: opportunitiesArray.length,
          totalForums: forumsArray.length,
          activeEvents: activeEvents.length,
          recentUsers: recentUsers.length,
          studentsCount: usersByRole.students,
          graduatesCount: usersByRole.graduates,
          adminsCount: usersByRole.admins,
          pendingProjects: pendingProjects.length,
          verifiedProjects: verifiedProjects.length,
          virtualEvents: this.getVirtualEvents(eventsArray).length,
          presentialEvents: this.getPresentialEvents(eventsArray).length,
        };

        this.stats.set(newStats);

        // Generar actividad reciente
        this.generateRecentActivity(
          usersArray,
          universitiesArray,
          eventsArray,
          projectsArray,
          forumsArray,
          opportunitiesArray,
        );

        this.isLoading.set(false);
      },
      error: error => {
        console.error('Error loading dashboard data:', error);
        this.stats.set({
          totalUsers: 0,
          totalUniversities: 0,
          totalEvents: 0,
          totalProjects: 0,
          totalOpportunities: 0,
          totalForums: 0,
          activeEvents: 0,
          recentUsers: 0,
          studentsCount: 0,
          graduatesCount: 0,
          adminsCount: 0,
          pendingProjects: 0,
          verifiedProjects: 0,
          virtualEvents: 0,
          presentialEvents: 0,
        });
        this.recentActivity.set([]);
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
        if (user && user.role && user.role.id !== undefined && user.role.id !== null) {
          switch (user.role.id) {
            case 2:
              acc.students++;
              break;
            case 3:
              acc.graduates++;
              break;
            case 1:
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

    return (events as DashboardEvent[]).filter((event: DashboardEvent) => {
      if (!event.fechaInicio) return false;
      const eventDate = new Date(event.fechaInicio);
      return eventDate >= now && eventDate <= thirtyDaysFromNow;
    });
  }

  private getRecentUsers(users: unknown[]): unknown[] {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    return (users as DashboardUser[]).filter((user: DashboardUser) => {
      if (!user.fechaCreacion) return false;
      const creationDate = new Date(user.fechaCreacion);
      return creationDate >= oneWeekAgo;
    });
  }

  private getVirtualEvents(events: unknown[]): unknown[] {
    return (events as DashboardEvent[]).filter(
      (event: DashboardEvent) => event.modalidad === 'virtual' || event.modalidad === 'Virtual',
    );
  }

  private getPresentialEvents(events: unknown[]): unknown[] {
    return (events as DashboardEvent[]).filter(
      (event: DashboardEvent) =>
        event.modalidad === 'presencial' || event.modalidad === 'Presencial',
    );
  }

  private generateRecentActivity(
    users: unknown[],
    _universities: unknown[],
    events: unknown[],
  ): void {
    const activities: RecentActivity[] = [];

    // Agregar usuarios recientes
    const recentUsers = this.getRecentUsers(users).slice(0, 2) as DashboardUser[];
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

    // Agregar proyectos recientes
    const recentProjects = (projects as unknown[])
      .filter((project: unknown) => {
        const proj = project as { created_at?: string; fechaCreacion?: string };
        return proj.created_at || proj.fechaCreacion;
      })
      .sort((a: unknown, b: unknown) => {
        const projA = a as { created_at?: string; fechaCreacion?: string };
        const projB = b as { created_at?: string; fechaCreacion?: string };
        const dateA = new Date(projA.created_at || projA.fechaCreacion || 0).getTime();
        const dateB = new Date(projB.created_at || projB.fechaCreacion || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 2);

    recentProjects.forEach((project: unknown) => {
      const proj = project as {
        nombre?: string;
        titulo?: string;
        created_at?: string;
        fechaCreacion?: string;
      };
      activities.push({
        id: activities.length + 1,
        type: 'project',
        icon: 'work',
        title: 'Nuevo proyecto creado',
        description: `${proj.nombre || proj.titulo} fue creado`,
        time: this.getRelativeTime(proj.created_at || proj.fechaCreacion || ''),
      });
    });

    // Agregar eventos recientes
    const recentEvents = (events as DashboardEvent[])
      .sort(
        (a: DashboardEvent, b: DashboardEvent) =>
          new Date(b.fechaCreacion || 0).getTime() - new Date(a.fechaCreacion || 0).getTime(),
      )
      .slice(0, 1);

    recentEvents.forEach((event: DashboardEvent) => {
      activities.push({
        id: activities.length + 1,
        type: 'event',
        icon: 'event',
        title: 'Nuevo evento creado',
        description: `${event.titulo} programado para ${new Date(event.fechaInicio).toLocaleDateString('es-ES')}`,
        time: this.getRelativeTime(event.fechaCreacion || event.fechaInicio),
      });
    });

    // Ordenar todas las actividades por tiempo (más recientes primero)
    activities.sort((a, b) => {
      const timeA = this.parseRelativeTime(a.time);
      const timeB = this.parseRelativeTime(b.time);
      return timeA - timeB;
    });

    this.recentActivity.set(activities.slice(0, 8));
  }

  private parseRelativeTime(timeString: string): number {
    // Parsear tiempo relativo para ordenamiento (menor número = más reciente)
    if (timeString.includes('ahora')) return 0;
    if (timeString.includes('minuto')) return parseInt(timeString) || 1;
    if (timeString.includes('hora')) return (parseInt(timeString) || 1) * 60;
    if (timeString.includes('día')) return (parseInt(timeString) || 1) * 1440;
    return 10080; // 1 semana por defecto
  }

  private getRelativeTime(dateString: string): string {
    if (!dateString) return 'Hace poco';

    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Ahora mismo';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} minuto${diffInMinutes === 1 ? '' : 's'}`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours} hora${diffInHours === 1 ? '' : 's'}`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Hace ${diffInDays} día${diffInDays === 1 ? '' : 's'}`;

    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
      case 'create-user':
        this.router.navigate(['/admin/users']);
        break;
      case 'create-university':
        this.router.navigate(['/admin/universities']);
        break;
      case 'create-event':
        this.router.navigate(['/admin/eventos']);
        break;
      case 'create-project':
        this.router.navigate(['/admin/proyectos']);
        break;
      case 'create-forum':
        this.router.navigate(['/admin/foros']);
        break;
      case 'backup-now':
        this.router.navigate(['/admin/backups']);
        break;
      case 'pending-projects':
        this.router.navigate(['/admin/proyectos']);
        break;
      case 'manage-opportunities':
        this.router.navigate(['/admin/opportunities']);
        break;
    }
  }

  private getPendingProjects(projects: unknown[]): unknown[] {
    return projects.filter((project: unknown) => {
      const proj = project as { estado_verificacion?: string };
      return (
        proj.estado_verificacion === 'pendiente' ||
        proj.estado_verificacion === 'revision' ||
        !proj.estado_verificacion
      );
    });
  }

  private getVerifiedProjects(projects: unknown[]): unknown[] {
    return projects.filter((project: unknown) => {
      const proj = project as { estado_verificacion?: string };
      return proj.estado_verificacion === 'aprobado' || proj.estado_verificacion === 'verificado';
    });
  }
}
