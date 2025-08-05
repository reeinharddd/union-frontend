/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@app/core/services/auth/auth.service';
import { EventService } from '@app/core/services/event/event.service';
import { OpportunityService } from '@app/core/services/opportunity/opportunity.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <!-- Welcome Header -->
      <div
        class="rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white shadow-hover"
      >
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold">¡Hola, {{ getUserName() }}! 👋</h1>
            <p class="mt-1 text-primary-100">Bienvenido de vuelta a Union</p>
          </div>
          <div class="hidden md:block">
            <div class="rounded-lg bg-white/20 p-4 backdrop-blur">
              <span class="text-3xl">🎓</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div class="border-blue-500 rounded-lg border-l-4 bg-white p-6 shadow-soft">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-neutral-600">Mis Cursos</p>
              <p class="text-2xl font-bold text-text-base">{{ studentStats().enrolledCourses }}</p>
            </div>
            <span class="text-2xl">📚</span>
          </div>
        </div>

        <div class="border-green-500 rounded-lg border-l-4 bg-white p-6 shadow-soft">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-neutral-600">Eventos Próximos</p>
              <p class="text-2xl font-bold text-text-base">{{ studentStats().upcomingEvents }}</p>
            </div>
            <span class="text-2xl">📅</span>
          </div>
        </div>

        <div class="border-purple-500 rounded-lg border-l-4 bg-white p-6 shadow-soft">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-neutral-600">Oportunidades</p>
              <p class="text-2xl font-bold text-text-base">{{ studentStats().newOpportunities }}</p>
            </div>
            <span class="text-2xl">💼</span>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <!-- Recent Activities -->
        <div class="rounded-lg bg-white p-6 shadow-soft lg:col-span-2">
          <h3 class="mb-4 flex items-center text-lg font-semibold text-text-base">
            <span class="mr-2">📊</span>
            Mi Actividad Reciente
          </h3>
          <div class="space-y-4">
            @for (activity of recentActivities(); track activity.id) {
              <div class="flex items-start space-x-3 rounded-lg bg-neutral-50 p-3">
                <div class="flex-shrink-0 rounded-full bg-primary-100 p-2">
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
          <button
            class="mt-4 w-full py-2 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Ver toda la actividad →
          </button>
        </div>

        <!-- Quick Actions -->
        <div class="rounded-lg bg-white p-6 shadow-soft">
          <h3 class="mb-4 flex items-center text-lg font-semibold text-text-base">
            <span class="mr-2">⚡</span>
            Acciones Rápidas
          </h3>
          <div class="space-y-3">
            <button
              class="group w-full rounded-lg border border-border p-3 text-left transition-colors hover:border-primary-300 hover:bg-primary-50"
            >
              <div class="flex items-center space-x-3">
                <span class="text-xl transition-transform group-hover:scale-110">📚</span>
                <span class="text-sm font-medium">Ver Mis Cursos</span>
              </div>
            </button>

            <button
              class="group w-full rounded-lg border border-border p-3 text-left transition-colors hover:border-secondary-300 hover:bg-secondary-50"
            >
              <div class="flex items-center space-x-3">
                <span class="text-xl transition-transform group-hover:scale-110">📅</span>
                <span class="text-sm font-medium">Explorar Eventos</span>
              </div>
            </button>

            <a
              [routerLink]="['/student/opportunities']"
              class="group block w-full rounded-lg border border-border p-3 text-left transition-colors hover:border-primary-300 hover:bg-primary-50"
            >
              <div class="flex items-center space-x-3">
                <span class="text-xl transition-transform group-hover:scale-110">💼</span>
                <span class="text-sm font-medium">Buscar Oportunidades</span>
              </div>
            </a>

            <button
              class="group w-full rounded-lg border border-border p-3 text-left transition-colors hover:border-info-300 hover:bg-info-50"
            >
              <div class="flex items-center space-x-3">
                <span class="text-xl transition-transform group-hover:scale-110">👥</span>
                <span class="text-sm font-medium">Conectar con Estudiantes</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Upcoming Events -->
      <div class="rounded-lg bg-white p-6 shadow-soft">
        <h3 class="mb-4 flex items-center text-lg font-semibold text-text-base">
          <span class="mr-2">📅</span>
          Próximos Eventos
        </h3>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          @for (event of upcomingEvents(); track event.id) {
            <div class="rounded-lg border border-border p-4 transition-shadow hover:shadow-md">
              <div class="mb-2 flex items-start justify-between">
                <h4 class="text-sm font-semibold text-text-base">{{ event.titulo }}</h4>
                <span class="rounded-full bg-primary-100 px-2 py-1 text-xs text-primary-700">
                  {{ event.tipo }}
                </span>
              </div>
              <p class="mb-3 line-clamp-2 text-xs text-text-muted">{{ event.descripcion }}</p>
              <div class="flex items-center justify-between text-xs text-neutral-500">
                <span>📍 {{ formatDate(event.fecha_inicio) }}</span>
                <button class="font-medium text-primary-600 hover:text-primary-700">Ver más</button>
              </div>
            </div>
          } @empty {
            <div class="col-span-full py-8 text-center text-neutral-500">
              <span class="mb-2 block text-4xl">📅</span>
              <p>No hay eventos próximos</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class StudentDashboardComponent implements OnInit {
  private readonly eventService = inject(EventService);
  private readonly opportunityService = inject(OpportunityService);
  private readonly authService = inject(AuthService);

  readonly studentStats = signal({
    enrolledCourses: 4,
    upcomingEvents: 0,
    newOpportunities: 0,
  });

  readonly recentActivities = signal([
    {
      id: 1,
      icon: '📚',
      title: 'Nuevo curso inscrito',
      description: 'Te inscribiste en "Desarrollo Web Avanzado"',
      time: 'Hace 2 horas',
    },
    {
      id: 2,
      icon: '💬',
      title: 'Nuevo mensaje',
      description: 'Carlos te envió un mensaje sobre el proyecto final',
      time: 'Hace 4 horas',
    },
    {
      id: 3,
      icon: '🏆',
      title: 'Insignia desbloqueada',
      description: 'Completaste el módulo de JavaScript',
      time: 'Ayer',
    },
  ]);

  readonly upcomingEvents = signal<any[]>([]);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  getUserName(): string {
    const user = this.authService.currentUser();
    return user?.nombre?.split(' ')[0] || user?.correo?.split('@')[0] || 'Estudiante';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private loadDashboardData(): void {
    // Cargar eventos próximos
    this.eventService.getAll().subscribe(events => {
      const upcoming = events.filter((event: any) => new Date(event.fecha_inicio) > new Date());

      this.upcomingEvents.set(upcoming);
      this.studentStats.update(stats => ({
        ...stats,
        upcomingEvents: upcoming.length,
      }));
    });

    // Cargar oportunidades
    this.opportunityService.getAll().subscribe(opportunities => {
      const now = new Date();
      const newOpportunities = opportunities.filter(opp => new Date(opp.fecha_limite) > now).length;

      this.studentStats.update(stats => ({
        ...stats,
        newOpportunities,
      }));
    });
  }
}
