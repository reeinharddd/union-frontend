import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface ReportData {
  id: number;
  title: string;
  type: 'users' | 'events' | 'universities' | 'projects' | 'general';
  value: number;
  previousValue?: number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  period: string;
  description?: string;
}

interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
  totalUniversities: number;
  activeUniversities: number;
  totalEvents: number;
  upcomingEvents: number;
  totalProjects: number;
  activeProjects: number;
  totalForums: number;
  totalOpportunities: number;
  systemUptime: number;
  avgResponseTime: number;
}

interface UserGrowthData {
  month: string;
  students: number;
  graduates: number;
  total: number;
}

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="rounded-lg border bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Reportes y Analytics</h1>
            <p class="mt-1 text-gray-600">
              Análisis detallado del sistema y métricas de rendimiento
            </p>
          </div>
          <div class="flex space-x-3">
            <button
              (click)="refreshReports()"
              class="rounded-lg border border-blue-600 px-4 py-2 text-blue-600 transition-colors hover:bg-blue-50"
            >
              <svg
                class="mr-2 inline h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                ></path>
              </svg>
              Actualizar
            </button>
            <button
              (click)="exportReport()"
              class="rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
            >
              <svg
                class="mr-2 inline h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              Exportar
            </button>
          </div>
        </div>
      </div>

      <!-- Time Period Filter -->
      <div class="rounded-lg border bg-white p-4 shadow-sm">
        <div class="flex items-center space-x-4">
          <label class="text-sm font-medium text-gray-700">Período de análisis:</label>
          <select
            [(ngModel)]="selectedPeriod"
            (change)="onPeriodChange()"
            class="rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Última semana</option>
            <option value="month">Último mes</option>
            <option value="quarter">Último trimestre</option>
            <option value="year">Último año</option>
          </select>
          <div class="ml-auto text-sm text-gray-500">
            Última actualización: {{ getLastUpdateTime() }}
          </div>
        </div>
      </div>

      <!-- Key Metrics -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <!-- Total Users -->
        <div class="rounded-lg border bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total de Usuarios</p>
              <p class="text-3xl font-bold text-gray-900">
                {{ systemMetrics().totalUsers | number }}
              </p>
              <div class="mt-2 flex items-center">
                <svg
                  class="h-4 w-4 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  ></path>
                </svg>
                <span class="ml-1 text-sm text-green-600"
                  >+{{ systemMetrics().newUsersThisMonth }} este mes</span
                >
              </div>
            </div>
            <div class="rounded-lg bg-blue-100 p-3">
              <svg
                class="h-8 w-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Active Universities -->
        <div class="rounded-lg border bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Universidades Activas</p>
              <p class="text-3xl font-bold text-gray-900">
                {{ systemMetrics().activeUniversities }}
              </p>
              <div class="mt-2 flex items-center">
                <span class="text-sm text-gray-500"
                  >de {{ systemMetrics().totalUniversities }} total</span
                >
              </div>
            </div>
            <div class="rounded-lg bg-green-100 p-3">
              <svg
                class="h-8 w-8 text-green-600"
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
            </div>
          </div>
        </div>

        <!-- Total Events -->
        <div class="rounded-lg border bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Eventos Realizados</p>
              <p class="text-3xl font-bold text-gray-900">{{ systemMetrics().totalEvents }}</p>
              <div class="mt-2 flex items-center">
                <span class="text-sm text-blue-600"
                  >{{ systemMetrics().upcomingEvents }} próximos</span
                >
              </div>
            </div>
            <div class="rounded-lg bg-purple-100 p-3">
              <svg
                class="h-8 w-8 text-purple-600"
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
            </div>
          </div>
        </div>

        <!-- System Performance -->
        <div class="rounded-lg border bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Tiempo de Respuesta</p>
              <p class="text-3xl font-bold text-gray-900">
                {{ systemMetrics().avgResponseTime }}ms
              </p>
              <div class="mt-2 flex items-center">
                <div class="flex items-center">
                  <div class="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                  <span class="text-sm text-green-600"
                    >{{ systemMetrics().systemUptime }}% uptime</span
                  >
                </div>
              </div>
            </div>
            <div class="bg-orange-100 rounded-lg p-3">
              <svg
                class="text-orange-600 h-8 w-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Report Summary -->
        <div class="rounded-lg border bg-white p-6 shadow-sm">
          <h3 class="mb-4 text-lg font-semibold text-gray-900">Resumen de Reportes</h3>
          <div class="space-y-4">
            @for (report of reportData(); track report.id) {
              <div
                class="flex items-center justify-between rounded-lg bg-gray-50 p-4 transition-colors hover:bg-gray-100"
              >
                <div class="flex items-center">
                  <div class="rounded-lg p-2" [ngClass]="getReportIconBg(report.type)">
                    <svg
                      class="h-5 w-5"
                      [ngClass]="getReportIconColor(report.type)"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        [attr.d]="getReportIcon(report.type)"
                      ></path>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900">{{ report.title }}</p>
                    <p class="text-xs text-gray-500">{{ report.period }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-lg font-bold text-gray-900">{{ report.value | number }}</span>
                  @if (report.change !== undefined) {
                    <div class="flex items-center justify-end">
                      @if (report.changeType === 'increase') {
                        <svg
                          class="mr-1 h-3 w-3 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                          ></path>
                        </svg>
                        <span class="text-xs font-medium text-green-600"
                          >+{{ report.change }}%</span
                        >
                      } @else if (report.changeType === 'decrease') {
                        <svg
                          class="mr-1 h-3 w-3 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                          ></path>
                        </svg>
                        <span class="text-xs font-medium text-red-600"
                          >-{{ Math.abs(report.change) }}%</span
                        >
                      }
                    </div>
                  }
                </div>
              </div>
            } @empty {
              <div class="py-6 text-center">
                <svg
                  class="mx-auto mb-2 h-12 w-12 text-gray-400"
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
                <p class="text-sm text-gray-500">No hay reportes disponibles</p>
              </div>
            }
          </div>
        </div>

        <!-- Activity Summary -->
        <div class="rounded-lg border bg-white p-6 shadow-sm">
          <h3 class="mb-4 text-lg font-semibold text-gray-900">Resumen de Actividad</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between rounded-lg bg-blue-50 p-4">
              <div class="flex items-center">
                <div class="rounded-lg bg-blue-100 p-2">
                  <svg
                    class="h-5 w-5 text-blue-600"
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
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">Proyectos Activos</p>
                  <p class="text-xs text-gray-600">
                    {{ systemMetrics().activeProjects }} de {{ systemMetrics().totalProjects }}
                  </p>
                </div>
              </div>
              <span class="text-lg font-bold text-blue-600"
                >{{
                  getPercentage(systemMetrics().activeProjects, systemMetrics().totalProjects)
                }}%</span
              >
            </div>

            <div class="flex items-center justify-between rounded-lg bg-green-50 p-4">
              <div class="flex items-center">
                <div class="rounded-lg bg-green-100 p-2">
                  <svg
                    class="h-5 w-5 text-green-600"
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
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">Foros Activos</p>
                  <p class="text-xs text-gray-600">Discusiones en curso</p>
                </div>
              </div>
              <span class="text-lg font-bold text-green-600">{{
                systemMetrics().totalForums
              }}</span>
            </div>

            <div class="bg-orange-50 flex items-center justify-between rounded-lg p-4">
              <div class="flex items-center">
                <div class="bg-orange-100 rounded-lg p-2">
                  <svg
                    class="text-orange-600 h-5 w-5"
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
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">Oportunidades</p>
                  <p class="text-xs text-gray-600">Ofertas publicadas</p>
                </div>
              </div>
              <span class="text-orange-600 text-lg font-bold">{{
                systemMetrics().totalOpportunities
              }}</span>
            </div>

            <div class="flex items-center justify-between rounded-lg bg-purple-50 p-4">
              <div class="flex items-center">
                <div class="rounded-lg bg-purple-100 p-2">
                  <svg
                    class="h-5 w-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm font-medium text-gray-900">Usuarios Activos</p>
                  <p class="text-xs text-gray-600">Conectados recientemente</p>
                </div>
              </div>
              <span class="text-lg font-bold text-purple-600">{{
                systemMetrics().activeUsers
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminReportsComponent implements OnInit {
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly systemMetrics = signal<SystemMetrics>({
    totalUsers: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
    totalUniversities: 0,
    activeUniversities: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    totalProjects: 0,
    activeProjects: 0,
    totalForums: 0,
    totalOpportunities: 0,
    systemUptime: 0,
    avgResponseTime: 0,
  });

  readonly reportData = signal<ReportData[]>([]);
  readonly userGrowthData = signal<UserGrowthData[]>([]);

  selectedPeriod = 'month';
  Math = Math;

  ngOnInit(): void {
    this.loadReports();
  }

  private loadReports(): void {
    this.loading.set(true);

    // Simulate loading data
    setTimeout(() => {
      // Mock system metrics
      this.systemMetrics.set({
        totalUsers: 1247,
        activeUsers: 892,
        newUsersThisMonth: 156,
        totalUniversities: 23,
        activeUniversities: 18,
        totalEvents: 87,
        upcomingEvents: 12,
        totalProjects: 234,
        activeProjects: 189,
        totalForums: 45,
        totalOpportunities: 67,
        systemUptime: 99.7,
        avgResponseTime: 245,
      });

      // Mock report data
      this.reportData.set([
        {
          id: 1,
          title: 'Crecimiento de Usuarios',
          type: 'users',
          value: 1247,
          previousValue: 1091,
          change: 14.3,
          changeType: 'increase',
          period: 'Último mes',
          description: 'Nuevos registros y activación de cuentas',
        },
        {
          id: 2,
          title: 'Eventos Organizados',
          type: 'events',
          value: 87,
          previousValue: 72,
          change: 20.8,
          changeType: 'increase',
          period: 'Último mes',
          description: 'Eventos creados por universidades',
        },
        {
          id: 3,
          title: 'Universidades Activas',
          type: 'universities',
          value: 18,
          previousValue: 16,
          change: 12.5,
          changeType: 'increase',
          period: 'Último mes',
          description: 'Universidades con actividad reciente',
        },
        {
          id: 4,
          title: 'Proyectos Colaborativos',
          type: 'projects',
          value: 234,
          previousValue: 198,
          change: 18.2,
          changeType: 'increase',
          period: 'Último mes',
          description: 'Proyectos activos y finalizados',
        },
      ]);

      this.loading.set(false);
    }, 1000);
  }

  refreshReports(): void {
    this.loadReports();
  }

  exportReport(): void {
    // TODO: Implement export functionality
    // Placeholder for future implementation
  }

  onPeriodChange(): void {
    this.loadReports();
  }

  viewDetailedReport(report: ReportData): void {
    this.router.navigate(['/admin/reports', report.id]);
  }

  getLastUpdateTime(): string {
    return new Date().toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getMaxValue(): number {
    const data = this.userGrowthData();
    if (data.length === 0) return 100;
    return Math.max(...data.map(d => d.total));
  }

  getPercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  }

  getReportIconBg(type: string): string {
    switch (type) {
      case 'users':
        return 'bg-blue-100';
      case 'events':
        return 'bg-purple-100';
      case 'universities':
        return 'bg-green-100';
      case 'projects':
        return 'bg-orange-100';
      default:
        return 'bg-gray-100';
    }
  }

  getReportIconColor(type: string): string {
    switch (type) {
      case 'users':
        return 'text-blue-600';
      case 'events':
        return 'text-purple-600';
      case 'universities':
        return 'text-green-600';
      case 'projects':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  }

  getReportIcon(type: string): string {
    switch (type) {
      case 'users':
        return 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z';
      case 'events':
        return 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z';
      case 'universities':
        return 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4';
      case 'projects':
        return 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z';
      default:
        return 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z';
    }
  }
}
