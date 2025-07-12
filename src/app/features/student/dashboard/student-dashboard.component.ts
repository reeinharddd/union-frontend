/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnInit } from '@angular/core';
import { EventService } from '@app/core/services/event/event.service';
import { OpportunityService } from '@app/core/services/opportunity/opportunity.service';
import { AuthService } from '@app/core/services/auth/auth.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Welcome Header -->
      <div class="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl shadow-hover p-6 text-white">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold">¡Hola, {{ getUserName() }}! 👋</h1>
            <p class="text-primary-100 mt-1">Bienvenido de vuelta a Union</p>
          </div>
          <div class="hidden md:block">
            <div class="p-4 bg-white/20 rounded-lg backdrop-blur">
              <span class="text-3xl">🎓</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow-soft p-6 border-l-4 border-blue-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-neutral-600">Mis Cursos</p>
              <p class="text-2xl font-bold text-text-base">{{ studentStats().enrolledCourses }}</p>
            </div>
            <span class="text-2xl">📚</span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-soft p-6 border-l-4 border-green-500">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-neutral-600">Eventos Próximos</p>
              <p class="text-2xl font-bold text-text-base">{{ studentStats().upcomingEvents }}</p>
            </div>
            <span class="text-2xl">📅</span>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-soft p-6 border-l-4 border-purple-500">
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
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Recent Activities -->
        <div class="lg:col-span-2 bg-white rounded-lg shadow-soft p-6">
          <h3 class="text-lg font-semibold text-text-base mb-4 flex items-center">
            <span class="mr-2">📊</span>
            Mi Actividad Reciente
          </h3>
          <div class="space-y-4">
            @for (activity of recentActivities(); track activity.id) {
              <div class="flex items-start space-x-3 p-3 bg-neutral-50 rounded-lg">
                <div class="p-2 bg-primary-100 rounded-full flex-shrink-0">
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
          <button class="w-full mt-4 py-2 text-sm text-primary-600 hover:text-primary-700 font-medium">
            Ver toda la actividad →
          </button>
        </div>

        <!-- Quick Actions -->
        <div class="bg-white rounded-lg shadow-soft p-6">
          <h3 class="text-lg font-semibold text-text-base mb-4 flex items-center">
            <span class="mr-2">⚡</span>
            Acciones Rápidas
          </h3>
          <div class="space-y-3">
            <button class="w-full p-3 border border-border rounded-lg hover:bg-primary-50 hover:border-primary-300 transition-colors text-left group">
              <div class="flex items-center space-x-3">
                <span class="text-xl group-hover:scale-110 transition-transform">📚</span>
                <span class="text-sm font-medium">Ver Mis Cursos</span>
              </div>
            </button>
            
            <button class="w-full p-3 border border-border rounded-lg hover:bg-secondary-50 hover:border-secondary-300 transition-colors text-left group">
              <div class="flex items-center space-x-3">
                <span class="text-xl group-hover:scale-110 transition-transform">📅</span>
                <span class="text-sm font-medium">Explorar Eventos</span>
              </div>
            </button>
            
            <button class="w-full p-3 border border-border rounded-lg hover:bg-accent-50 hover:border-accent-300 transition-colors text-left group">
              <div class="flex items-center space-x-3">
                <span class="text-xl group-hover:scale-110 transition-transform">💼</span>
                <span class="text-sm font-medium">Buscar Oportunidades</span>
              </div>
            </button>
            
            <button class="w-full p-3 border border-border rounded-lg hover:bg-info-50 hover:border-info-300 transition-colors text-left group">
              <div class="flex items-center space-x-3">
                <span class="text-xl group-hover:scale-110 transition-transform">👥</span>
                <span class="text-sm font-medium">Conectar con Estudiantes</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Upcoming Events -->
      <div class="bg-white rounded-lg shadow-soft p-6">
        <h3 class="text-lg font-semibold text-text-base mb-4 flex items-center">
          <span class="mr-2">📅</span>
          Próximos Eventos
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (event of upcomingEvents(); track event.id) {
            <div class="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div class="flex items-start justify-between mb-2">
                <h4 class="font-semibold text-text-base text-sm">{{ event.titulo }}</h4>
                <span class="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                  {{ event.tipo }}
                </span>
              </div>
              <p class="text-xs text-text-muted mb-3 line-clamp-2">{{ event.descripcion }}</p>
              <div class="flex items-center justify-between text-xs text-neutral-500">
                <span>📍 {{ formatDate(event.fecha_inicio) }}</span>
                <button class="text-primary-600 hover:text-primary-700 font-medium">
                  Ver más
                </button>
              </div>
            </div>
          } @empty {
            <div class="col-span-full text-center py-8 text-neutral-500">
              <span class="text-4xl mb-2 block">📅</span>
              <p>No hay eventos próximos</p>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class StudentDashboardComponent implements OnInit {
  private readonly eventService = inject(EventService);
  private readonly opportunityService = inject(OpportunityService);
  private readonly authService = inject(AuthService);

  readonly studentStats = signal({
    enrolledCourses: 4,
    upcomingEvents: 0,
    newOpportunities: 0
  });

  readonly recentActivities = signal([
    {
      id: 1,
      icon: '📚',
      title: 'Nuevo curso inscrito',
      description: 'Te inscribiste en "Desarrollo Web Avanzado"',
      time: 'Hace 2 horas'
    },
    {
      id: 2,
      icon: '💬',
      title: 'Nuevo mensaje',
      description: 'Carlos te envió un mensaje sobre el proyecto final',
      time: 'Hace 4 horas'
    },
    {
      id: 3,
      icon: '🏆',
      title: 'Insignia desbloqueada',
      description: 'Completaste el módulo de JavaScript',
      time: 'Ayer'
    }
  ]);

  readonly upcomingEvents = signal<any[]>([]);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  getUserName(): string {
    const user = this.authService.currentUser();
    return user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'Estudiante';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  private loadDashboardData(): void {
    // Cargar eventos próximos
    this.eventService.getAll().subscribe(events => {
      const now = new Date();
      const upcoming = events
        .filter(event => new Date(event.fecha_inicio) > now)
        .slice(0, 6);
      
      this.upcomingEvents.set(upcoming);
      this.studentStats.update(stats => ({
        ...stats,
        upcomingEvents: upcoming.length
      }));
    });

    // Cargar oportunidades
    this.opportunityService.getAll().subscribe(opportunities => {
      const now = new Date();
      const newOpportunities = opportunities
        .filter(opp => new Date(opp.fecha_limite) > now)
        .length;
      
      this.studentStats.update(stats => ({
        ...stats,
        newOpportunities
      }));
    });
  }
}