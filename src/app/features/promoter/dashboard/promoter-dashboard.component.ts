import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '@app/core/services/auth/auth.service';
import { TokenService } from '@app/core/services/auth/token.service';
import { OpportunityService } from '@app/core/services/opportunity/opportunity.service';
import { PostulationService } from '@app/core/services/postulation/postulation.service';
import { UserService } from '@app/core/services/user/user.service';

@Component({
  selector: 'app-promoter-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Welcome Header -->
      <div
        class="rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white shadow-hover"
      >
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold">¡Hola, {{ getUserName() }}! 👋</h1>
            <p class="mt-1 text-primary-100">Panel de gestión de postulaciones</p>
          </div>
          <div class="hidden md:block">
            <div class="rounded-lg bg-white/20 p-4 backdrop-blur">
              <span class="text-3xl">📋</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div class="rounded-lg border-l-4 border-blue-500 bg-white p-6 shadow-soft">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-neutral-600">Oportunidades Activas</p>
              <p class="text-2xl font-bold text-text-base">
                {{ promoterStats().activeOpportunities }}
              </p>
            </div>
            <span class="text-2xl">💼</span>
          </div>
        </div>

        <div class="rounded-lg border-l-4 border-green-500 bg-white p-6 shadow-soft">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-neutral-600">Postulaciones Totales</p>
              <p class="text-2xl font-bold text-text-base">
                {{ promoterStats().totalPostulations }}
              </p>
            </div>
            <span class="text-2xl">📄</span>
          </div>
        </div>

        <div class="rounded-lg border-l-4 border-purple-500 bg-white p-6 shadow-soft">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-neutral-600">Postulaciones Nuevas</p>
              <p class="text-2xl font-bold text-text-base">{{ promoterStats().newPostulations }}</p>
            </div>
            <span class="text-2xl">🆕</span>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <!-- Recent Postulations -->
        <div class="rounded-lg bg-white p-6 shadow-soft lg:col-span-2">
          <h3 class="mb-4 flex items-center text-lg font-semibold text-text-base">
            <span class="mr-2">📊</span>
            Postulaciones Recientes
          </h3>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-neutral-500">
                    Estudiante
                  </th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-neutral-500">
                    Oportunidad
                  </th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-neutral-500">Fecha</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-neutral-500">Estado</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">
                @for (postulation of recentPostulations(); track postulation.id) {
                  <tr class="hover:bg-neutral-50">
                    <td class="whitespace-nowrap px-4 py-3 text-sm text-text-base">
                      {{ postulation.estudiante_nombre }}
                    </td>
                    <td class="px-4 py-3 text-sm text-text-base">
                      {{ postulation.oportunidad_titulo }}
                    </td>
                    <td class="px-4 py-3 text-sm text-neutral-500">
                      {{ formatDate(postulation.fecha_postulacion) }}
                    </td>
                    <td class="px-4 py-3">
                      <span
                        class="rounded-full px-2 py-1 text-xs font-medium"
                        [class.bg-yellow-100]="postulation.estado === 'pendiente'"
                        [class.text-yellow-800]="postulation.estado === 'pendiente'"
                        [class.bg-green-100]="postulation.estado === 'aceptada'"
                        [class.text-green-800]="postulation.estado === 'aceptada'"
                        [class.bg-red-100]="postulation.estado === 'rechazada'"
                        [class.text-red-800]="postulation.estado === 'rechazada'"
                      >
                        {{ postulation.estado | titlecase }}
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <button
            class="mt-4 w-full py-2 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Ver todas las postulaciones →
          </button>
        </div>

        <!-- Quick Actions -->
        <div class="rounded-lg bg-white p-6 shadow-soft">
          <h3 class="mb-4 flex items-center text-lg font-semibold text-text-base">
            <span class="mr-2">⚡</span>
            Acciones Rápidas
          </h3>
          <div class="space-y-3">
            <a
              href="promoter/opportunities/create"
              class="group block w-full rounded-lg border border-border p-3 text-left transition-colors hover:border-primary-300 hover:bg-primary-50"
            >
              <div class="flex items-center space-x-3">
                <span class="text-xl transition-transform group-hover:scale-110">➕</span>
                <span class="text-sm font-medium">Crear Oportunidad</span>
              </div>
            </a>

            <a
              href="promoter/postulation"
              class="group block w-full rounded-lg border border-border p-3 text-left transition-colors hover:border-primary-300 hover:bg-primary-50"
            >
              <div class="flex items-center space-x-3">
                <span class="text-xl transition-transform group-hover:scale-110">📋</span>
                <span class="text-sm font-medium">Gestionar Postulaciones</span>
              </div>
            </a>

            <!-- <button
              class="group w-full rounded-lg border border-border p-3 text-left transition-colors hover:border-accent-300 hover:bg-accent-50"
              (click)="navigateTo('view-students')"
            >
              <div class="flex items-center space-x-3">
                <span class="text-xl transition-transform group-hover:scale-110">👥</span>
                <span class="text-sm font-medium">Ver Estudiantes</span>
              </div>
            </button> -->
          </div>
        </div>
      </div>

      <!-- Opportunities Needing Review -->
      <div class="rounded-lg bg-white p-6 shadow-soft">
        <h3 class="mb-4 flex items-center text-lg font-semibold text-text-base">
          <span class="mr-2">⚠️</span>
          Oportunidades con Postulaciones Pendientes
        </h3>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          @for (opportunity of pendingOpportunities(); track opportunity.id) {
            <div class="rounded-lg border border-border p-4 transition-shadow hover:shadow-md">
              <h4 class="mb-2 text-sm font-semibold text-text-base">{{ opportunity.titulo }}</h4>
              <p class="mb-3 line-clamp-2 text-xs text-text-muted">{{ opportunity.descripcion }}</p>
              <div class="flex items-center justify-between text-xs text-neutral-500">
                <span>📋 {{ opportunity.postulaciones_pendientes }} postulaciones</span>
                <button
                  class="font-medium text-primary-600 hover:text-primary-700"
                  (click)="navigateTo('opportunity/' + opportunity.id)"
                >
                  Revisar
                </button>
              </div>
            </div>
          } @empty {
            <div class="col-span-full py-8 text-center text-neutral-500">
              <span class="mb-2 block text-4xl">🎉</span>
              <p>No hay postulaciones pendientes</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class PromoterDashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly tokenService = inject(TokenService);
  private readonly userService = inject(UserService);
  private readonly opportunityService = inject(OpportunityService);
  private readonly postulationService = inject(PostulationService);

  readonly promoterStats = signal({
    activeOpportunities: 0,
    totalPostulations: 0,
    newPostulations: 0,
  });

  readonly recentPostulations = signal<any[]>([]);
  readonly pendingOpportunities = signal<any[]>([]);
  userId: number | null = null;

  ngOnInit(): void {
    this.loadDashboardData();
  }

  getUserName(): string {
    const user = this.authService.currentUser();
    return user?.nombre?.split(' ')[0] || user?.correo?.split('@')[0] || 'Promotor';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date
      .toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
      .replace('.', ''); // Elimina el punto que algunos navegadores ponen en 'jul.'
  }

  navigateTo(route: string): void {
    // Implementa tu lógica de navegación aquí
    console.log('Navegar a:', route);
  }

  private loadDashboardData(): void {
    const userId = this.tokenService.getUserId()!;

    // Estadísticas de oportunidades activas
    this.opportunityService.getByPromoter(userId).subscribe(opportunities => {
      const activeOpportunities = opportunities.length;
      this.promoterStats.update(stats => ({
        ...stats,
        activeOpportunities: activeOpportunities,
      }));
    });

    // Cargar todas las postulaciones y enriquecerlas
    this.postulationService.getAll().subscribe(async postulations => {
      const recentPostulations = await Promise.all(
        postulations
          .sort((a, b) => new Date(b.fecha!).getTime() - new Date(a.fecha!).getTime())
          .slice(0, 5) // solo las 5 más recientes
          .map(async postulation => {
            const estudiante = await this.userService.getById(postulation.usuario_id).toPromise();
            const oportunidad = await this.opportunityService
              .getById(postulation.oportunidad_id)
              .toPromise();

            return {
              ...postulation,
              estudiante_nombre: estudiante?.nombre || 'Desconocido',
              oportunidad_titulo: oportunidad?.titulo || 'Sin título',
            };
          }),
      );

      this.recentPostulations.set(recentPostulations);

      this.promoterStats.update(stats => ({
        ...stats,
        totalPostulations: postulations.length,
        newPostulations: postulations.filter(p => p.estado === 'pendiente').length,
      }));
    });

    // Oportunidades con postulaciones pendientes
    this.opportunityService.getByPromoter(userId).subscribe(opportunities => {
      this.postulationService.getAll().subscribe(postulations => {
        const pendingOpportunities = opportunities.filter(op =>
          postulations.some(p => p.oportunidad_id === op.id && p.estado === 'pendiente'),
        );
        this.pendingOpportunities.set(pendingOpportunities);
      });
    });
  }
}
