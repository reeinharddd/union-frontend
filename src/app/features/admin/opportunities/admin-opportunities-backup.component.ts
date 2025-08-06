import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface AdminOpportunity {
  id: number;
  title: string;
  description: string;
  type: 'scholarship' | 'exchange' | 'internship' | 'research' | 'conference' | 'workshop';
  university: {
    id: number;
    name: string;
    logo?: string;
  };
  requirements: string[];
  applicationDeadline: string;
  startDate: string;
  endDate?: string;
  location: string;
  capacity?: number;
  applicationsCount: number;
  status: 'active' | 'closed' | 'draft' | 'expired';
  createdAt: string;
  updatedAt: string;
  tags: string[];
  budget?: number;
  isInternational: boolean;
}

interface OpportunityStats {
  totalOpportunities: number;
  activeOpportunities: number;
  totalApplications: number;
  expiredOpportunities: number;
  averageApplications: number;
  internationalOpportunities: number;
  totalBudget: number;
  mostPopularType: string;
}

@Component({
  selector: 'app-admin-opportunities',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm p-6 border">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Gestión de Oportunidades</h1>
            <p class="text-gray-600 mt-1">Administra becas, intercambios, pasantías y oportunidades académicas</p>
          </div>
          <div class="flex space-x-3">
            <button
              (click)="refreshOpportunities()"
              class="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Actualizar
            </button>
            <button
              (click)="createOpportunity()"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Nueva Oportunidad
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Opportunities -->
        <div class="bg-white rounded-lg shadow-sm p-6 border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total Oportunidades</p>
              <p class="text-3xl font-bold text-gray-900">{{ opportunityStats().totalOpportunities }}</p>
              <div class="flex items-center mt-2">
                <span class="text-sm text-green-600">{{ opportunityStats().activeOpportunities }} activas</span>
              </div>
            </div>
            <div class="p-3 bg-blue-100 rounded-lg">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0l4 4-4 4"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Applications -->
        <div class="bg-white rounded-lg shadow-sm p-6 border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total Aplicaciones</p>
              <p class="text-3xl font-bold text-gray-900">{{ opportunityStats().totalApplications }}</p>
              <div class="flex items-center mt-2">
                <span class="text-sm text-gray-500">{{ opportunityStats().averageApplications }} promedio</span>
              </div>
            </div>
            <div class="p-3 bg-green-100 rounded-lg">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- International Opportunities -->
        <div class="bg-white rounded-lg shadow-sm p-6 border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Oportunidades Internacionales</p>
              <p class="text-3xl font-bold text-gray-900">{{ opportunityStats().internationalOpportunities }}</p>
              <div class="flex items-center mt-2">
                <span class="text-sm text-blue-600">Intercambios globales</span>
              </div>
            </div>
            <div class="p-3 bg-purple-100 rounded-lg">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Budget -->
        <div class="bg-white rounded-lg shadow-sm p-6 border">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Presupuesto Total</p>
              <p class="text-3xl font-bold text-gray-900">${{ getTotalBudgetInK() }}K</p>
              <div class="flex items-center mt-2">
                <span class="text-sm text-orange-600">En oportunidades activas</span>
              </div>
            </div>
            <div class="p-3 bg-orange-100 rounded-lg">
              <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm p-4 border">
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700">Buscar:</label>
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (input)="onSearch()"
              placeholder="Buscar oportunidades..."
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          </div>
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700">Tipo:</label>
            <select
              [(ngModel)]="typeFilter"
              (change)="onFilterChange()"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Todos</option>
              <option value="scholarship">Becas</option>
              <option value="exchange">Intercambios</option>
              <option value="internship">Pasantías</option>
              <option value="research">Investigación</option>
              <option value="conference">Conferencias</option>
              <option value="workshop">Talleres</option>
            </select>
          </div>
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700">Estado:</label>
            <select
              [(ngModel)]="statusFilter"
              (change)="onFilterChange()"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Todos</option>
              <option value="active">Activas</option>
              <option value="closed">Cerradas</option>
              <option value="draft">Borradores</option>
              <option value="expired">Expiradas</option>
            </select>
          </div>
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700 flex items-center">
              <input
                type="checkbox"
                [(ngModel)]="internationalFilter"
                (change)="onFilterChange()"
                class="mr-2">
              Solo Internacionales
            </label>
          </div>
          <div class="flex items-center space-x-2 ml-auto">
            <span class="text-sm text-gray-500">{{ filteredOpportunities().length }} de {{ opportunities().length }} oportunidades</span>
          </div>
        </div>
      </div>

      <!-- Opportunities Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        @for (opportunity of paginatedOpportunities(); track opportunity.id) {
          <div class="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow">
            <!-- Header -->
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-start justify-between">
                <div class="flex items-center space-x-3">
                  <div class="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="getTypeIcon(opportunity.type)"></path>
                    </svg>
                  </div>
                  <div class="min-w-0 flex-1">
                    <h3 class="text-lg font-semibold text-gray-900 truncate">{{ opportunity.title }}</h3>
                    <p class="text-sm text-gray-600">{{ opportunity.university.name }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  @if (opportunity.isInternational) {
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      Internacional
                    </span>
                  }
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" [ngClass]="getStatusClasses(opportunity.status)">
                    {{ getStatusText(opportunity.status) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6">
              <p class="text-sm text-gray-600 mb-4 line-clamp-3">{{ opportunity.description }}</p>

              <div class="space-y-3">
                <!-- Type and Location -->
                <div class="flex items-center justify-between text-sm">
                  <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                    {{ getTypeText(opportunity.type) }}
                  </span>
                  <span class="text-gray-500 flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    {{ opportunity.location }}
                  </span>
                </div>

                <!-- Dates -->
                <div class="flex items-center justify-between text-sm text-gray-600">
                  <span>Fecha límite: {{ formatDate(opportunity.applicationDeadline) }}</span>
                  <span>Inicio: {{ formatDate(opportunity.startDate) }}</span>
                </div>

                <!-- Applications and Capacity -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center text-sm text-gray-600">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    {{ opportunity.applicationsCount }} aplicaciones
                  </div>
                  @if (opportunity.capacity) {
                    <div class="flex items-center">
                      <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div class="bg-blue-600 h-2 rounded-full" [style.width.%]="getCapacityPercentage(opportunity.applicationsCount, opportunity.capacity)"></div>
                      </div>
                      <span class="text-xs text-gray-500">{{ opportunity.capacity }} cupos</span>
                    </div>
                  }
                </div>

                <!-- Budget -->
                @if (opportunity.budget) {
                  <div class="flex items-center text-sm text-green-600">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Presupuesto: ${{ formatBudget(opportunity.budget) }}
                  </div>
                }

                <!-- Tags -->
                @if (opportunity.tags.length > 0) {
                  <div class="flex flex-wrap gap-1">
                    @for (tag of opportunity.tags.slice(0, 3); track tag) {
                      <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {{ tag }}
                      </span>
                    }
                    @if (opportunity.tags.length > 3) {
                      <span class="text-xs text-gray-500">+{{ opportunity.tags.length - 3 }} más</span>
                    }
                  </div>
                }
              </div>
            </div>

            <!-- Actions -->
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div class="flex items-center justify-between">
                <div class="text-xs text-gray-500">
                  Actualizado {{ getTimeAgo(opportunity.updatedAt) }}
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    (click)="viewOpportunity(opportunity)"
                    class="text-blue-600 hover:text-blue-900 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                  <button
                    (click)="editOpportunity(opportunity)"
                    class="text-green-600 hover:text-green-900 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>
                  <button
                    (click)="deleteOpportunity(opportunity)"
                    class="text-red-600 hover:text-red-900 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        } @empty {
          <div class="col-span-full">
            <div class="text-center py-12">
              <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0l4 4-4 4"></path>
              </svg>
              <p class="text-gray-500 text-lg">No se encontraron oportunidades</p>
              <p class="text-gray-400 text-sm mt-1">Intenta ajustar los filtros de búsqueda</p>
            </div>
          </div>
        }
      </div>

      <!-- Pagination -->
      @if (filteredOpportunities().length > itemsPerPage) {
        <div class="bg-white rounded-lg shadow-sm border p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <p class="text-sm text-gray-700">
                Mostrando {{ (currentPage - 1) * itemsPerPage + 1 }} a {{ Math.min(currentPage * itemsPerPage, filteredOpportunities().length) }} de {{ filteredOpportunities().length }} resultados
              </p>
            </div>
            <div class="flex items-center space-x-2">
              <button
                (click)="previousPage()"
                [disabled]="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <span class="text-sm text-gray-700">Página {{ currentPage }} de {{ totalPages }}</span>
              <button
                (click)="nextPage()"
                [disabled]="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-md">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    .line-clamp-3 {
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminOpportunitiesComponent implements OnInit {
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly opportunities = signal<AdminOpportunity[]>([]);
  readonly filteredOpportunities = signal<AdminOpportunity[]>([]);
  readonly opportunityStats = signal<OpportunityStats>({
    totalOpportunities: 0,
    activeOpportunities: 0,
    totalApplications: 0,
    expiredOpportunities: 0,
    averageApplications: 0,
    internationalOpportunities: 0,
    totalBudget: 0,
    mostPopularType: ''
  });

  searchTerm = '';
  typeFilter = '';
  statusFilter = '';
  internationalFilter = false;
  currentPage = 1;
  itemsPerPage = 9;
  Math = Math;

  get totalPages(): number {
    return Math.ceil(this.filteredOpportunities().length / this.itemsPerPage);
  }

  get paginatedOpportunities(): () => AdminOpportunity[] {
    return () => {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredOpportunities().slice(start, end);
    };
  }

  ngOnInit(): void {
    this.loadOpportunities();
  }

  private loadOpportunities(): void {
    this.loading.set(true);

    // Simulate loading data
    setTimeout(() => {
      // Mock opportunities data
      const mockOpportunities: AdminOpportunity[] = [
        {
          id: 1,
          title: 'Beca de Excelencia Académica 2024',
          description: 'Programa de becas para estudiantes destacados en ingeniería y tecnología. Cubre matrícula completa y gastos de manutención.',
          type: 'scholarship',
          university: {
            id: 1,
            name: 'Universidad Tecnológica',
            logo: ''
          },
          requirements: ['Promedio mínimo 9.0', 'Carta de recomendación', 'Ensayo personal'],
          applicationDeadline: '2024-03-15T23:59:59Z',
          startDate: '2024-08-01T00:00:00Z',
          endDate: '2025-12-31T23:59:59Z',
          location: 'Ciudad de México, México',
          capacity: 50,
          applicationsCount: 34,
          status: 'active',
          createdAt: '2024-01-10T10:00:00Z',
          updatedAt: '2024-01-20T15:30:00Z',
          tags: ['Ingeniería', 'Tecnología', 'Excelencia'],
          budget: 500000,
          isInternational: false
        },
        {
          id: 2,
          title: 'Intercambio Académico Europa',
          description: 'Programa de intercambio con universidades europeas. Incluye estancia de un semestre en instituciones de prestigio.',
          type: 'exchange',
          university: {
            id: 2,
            name: 'Instituto Internacional',
            logo: ''
          },
          requirements: ['Nivel B2 en inglés', 'Promedio mínimo 8.5', 'Seguro médico'],
          applicationDeadline: '2024-02-28T23:59:59Z',
          startDate: '2024-09-01T00:00:00Z',
          endDate: '2025-01-31T23:59:59Z',
          location: 'Múltiples ciudades, Europa',
          capacity: 25,
          applicationsCount: 18,
          status: 'active',
          createdAt: '2024-01-05T09:00:00Z',
          updatedAt: '2024-01-18T11:45:00Z',
          tags: ['Intercambio', 'Europa', 'Semestre'],
          budget: 750000,
          isInternational: true
        },
        {
          id: 3,
          title: 'Conferencia IA y Futuro',
          description: 'Conferencia internacional sobre inteligencia artificial y su impacto en el futuro. Incluye talleres prácticos.',
          type: 'conference',
          university: {
            id: 3,
            name: 'Centro de Investigación',
            logo: ''
          },
          requirements: ['Estudiante activo', 'Interés en IA'],
          applicationDeadline: '2024-02-15T23:59:59Z',
          startDate: '2024-03-20T09:00:00Z',
          endDate: '2024-03-22T18:00:00Z',
          location: 'Guadalajara, México',
          capacity: 200,
          applicationsCount: 156,
          status: 'active',
          createdAt: '2024-01-01T08:00:00Z',
          updatedAt: '2024-01-15T14:20:00Z',
          tags: ['IA', 'Conferencia', 'Tecnología'],
          budget: 150000,
          isInternational: false
        }
      ];

      this.opportunities.set(mockOpportunities);
      this.applyFilters();

      // Mock stats
      const totalBudget = mockOpportunities.reduce((sum, opp) => sum + (opp.budget || 0), 0);
      const totalApplications = mockOpportunities.reduce((sum, opp) => sum + opp.applicationsCount, 0);

      this.opportunityStats.set({
        totalOpportunities: mockOpportunities.length,
        activeOpportunities: mockOpportunities.filter(o => o.status === 'active').length,
        totalApplications,
        expiredOpportunities: mockOpportunities.filter(o => o.status === 'expired').length,
        averageApplications: Math.round(totalApplications / mockOpportunities.length),
        internationalOpportunities: mockOpportunities.filter(o => o.isInternational).length,
        totalBudget,
        mostPopularType: 'scholarship'
      });

      this.loading.set(false);
    }, 1000);
  }

  private applyFilters(): void {
    let filtered = this.opportunities();

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(opportunity =>
        opportunity.title.toLowerCase().includes(term) ||
        opportunity.description.toLowerCase().includes(term) ||
        opportunity.university.name.toLowerCase().includes(term) ||
        opportunity.location.toLowerCase().includes(term)
      );
    }

    // Apply type filter
    if (this.typeFilter) {
      filtered = filtered.filter(opportunity => opportunity.type === this.typeFilter);
    }

    // Apply status filter
    if (this.statusFilter) {
      filtered = filtered.filter(opportunity => opportunity.status === this.statusFilter);
    }

    // Apply international filter
    if (this.internationalFilter) {
      filtered = filtered.filter(opportunity => opportunity.isInternational);
    }

    this.filteredOpportunities.set(filtered);
    this.currentPage = 1; // Reset to first page when filters change
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  refreshOpportunities(): void {
    this.loadOpportunities();
  }

  createOpportunity(): void {
    this.router.navigate(['/admin/opportunities/create']);
  }

  viewOpportunity(opportunity: AdminOpportunity): void {
    this.router.navigate(['/admin/opportunities', opportunity.id]);
  }

  editOpportunity(opportunity: AdminOpportunity): void {
    this.router.navigate(['/admin/opportunities', opportunity.id, 'edit']);
  }

  deleteOpportunity(opportunity: AdminOpportunity): void {
    if (confirm(`¿Estás seguro de que deseas eliminar la oportunidad "${opportunity.title}"?`)) {
      // Remove opportunity from list for now
      const updatedOpportunities = this.opportunities().filter(o => o.id !== opportunity.id);
      this.opportunities.set(updatedOpportunities);
      this.applyFilters();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  getStatusClasses(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'active':
        return 'Activa';
      case 'closed':
        return 'Cerrada';
      case 'draft':
        return 'Borrador';
      case 'expired':
        return 'Expirada';
      default:
        return status;
    }
  }

  getTypeText(type: string): string {
    switch (type) {
      case 'scholarship':
        return 'Beca';
      case 'exchange':
        return 'Intercambio';
      case 'internship':
        return 'Pasantía';
      case 'research':
        return 'Investigación';
      case 'conference':
        return 'Conferencia';
      case 'workshop':
        return 'Taller';
      default:
        return type;
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'scholarship':
        return 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z';
      case 'exchange':
        return 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4';
      case 'internship':
        return 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0l4 4-4 4';
      case 'research':
        return 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z';
      case 'conference':
        return 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15';
      case 'workshop':
        return 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z';
      default:
        return 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';
    }
  }

  getCapacityPercentage(applications: number, capacity: number): number {
    return Math.min((applications / capacity) * 100, 100);
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'hace unos minutos';
    } else if (diffInHours < 24) {
      return `hace ${diffInHours} horas`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `hace ${diffInDays} días`;
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getTotalBudgetInK(): string {
    return (this.opportunityStats().totalBudget / 1000).toFixed(0);
  }

  formatBudget(budget: number): string {
    return budget.toLocaleString();
  }
}
