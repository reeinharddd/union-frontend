import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { University as UniversityModel } from '@app/core/models/university/university.interface';
import { UniversityService } from '@app/core/services/university/university.service';

interface University {
  id: number;
  nombre: string;
  dominio: string;
  pais: string;
  ciudad?: string;
  descripcion?: string;
  logo?: string;
  activa: boolean;
  fechaCreacion: string;
  totalUsuarios?: number;
  totalEventos?: number;
}

interface UniversityStats {
  total: number;
  active: number;
  inactive: number;
  totalUsers: number;
  totalEvents: number;
}

@Component({
  selector: 'app-admin-universities',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="rounded-lg border bg-white p-6 shadow-sm">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Gestión de Universidades</h1>
            <p class="mt-1 text-gray-600">
              Administrar instituciones educativas registradas en el sistema
            </p>
          </div>
          <div class="flex space-x-3">
            <button
              (click)="refreshUniversities()"
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
              (click)="openCreateUniversityModal()"
              class="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
              Nueva Universidad
            </button>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <div class="rounded-lg bg-blue-50 p-4">
            <div class="flex items-center">
              <div class="rounded-lg bg-blue-100 p-2">
                <svg
                  class="h-6 w-6 text-blue-600"
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
              <div class="ml-3">
                <p class="text-sm text-gray-600">Total</p>
                <p class="text-xl font-semibold text-gray-900">{{ universityStats().total }}</p>
              </div>
            </div>
          </div>

          <div class="rounded-lg bg-green-50 p-4">
            <div class="flex items-center">
              <div class="rounded-lg bg-green-100 p-2">
                <svg
                  class="h-6 w-6 text-green-600"
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
                <p class="text-sm text-gray-600">Activas</p>
                <p class="text-xl font-semibold text-gray-900">{{ universityStats().active }}</p>
              </div>
            </div>
          </div>

          <div class="rounded-lg bg-red-50 p-4">
            <div class="flex items-center">
              <div class="rounded-lg bg-red-100 p-2">
                <svg
                  class="h-6 w-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-gray-600">Inactivas</p>
                <p class="text-xl font-semibold text-gray-900">{{ universityStats().inactive }}</p>
              </div>
            </div>
          </div>

          <div class="rounded-lg bg-purple-50 p-4">
            <div class="flex items-center">
              <div class="rounded-lg bg-purple-100 p-2">
                <svg
                  class="h-6 w-6 text-purple-600"
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
              <div class="ml-3">
                <p class="text-sm text-gray-600">Usuarios</p>
                <p class="text-xl font-semibold text-gray-900">
                  {{ universityStats().totalUsers }}
                </p>
              </div>
            </div>
          </div>

          <div class="bg-orange-50 rounded-lg p-4">
            <div class="flex items-center">
              <div class="bg-orange-100 rounded-lg p-2">
                <svg
                  class="text-orange-600 h-6 w-6"
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
              <div class="ml-3">
                <p class="text-sm text-gray-600">Eventos</p>
                <p class="text-xl font-semibold text-gray-900">
                  {{ universityStats().totalEvents }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="rounded-lg border bg-white p-6 shadow-sm">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">Buscar universidad</label>
            <div class="relative">
              <input
                type="text"
                [(ngModel)]="searchTerm"
                (input)="filterUniversities()"
                placeholder="Nombre o dominio..."
                class="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
              <svg
                class="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">Filtrar por país</label>
            <select
              [(ngModel)]="selectedCountry"
              (change)="filterUniversities()"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los países</option>
              @for (country of getCountries(); track country) {
                <option [value]="country">{{ country }}</option>
              }
            </select>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">Estado</label>
            <select
              [(ngModel)]="selectedStatus"
              (change)="filterUniversities()"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="active">Activas</option>
              <option value="inactive">Inactivas</option>
            </select>
          </div>

          <div class="flex items-end">
            <button
              (click)="clearFilters()"
              class="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-600 transition-colors hover:bg-gray-50"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                ></path>
              </svg>
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      <!-- Universities Grid -->
      <div class="rounded-lg border bg-white shadow-sm">
        <div class="border-b border-gray-200 px-6 py-4">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Lista de Universidades</h2>
            <span class="text-sm text-gray-500"
              >{{ filteredUniversities().length }} universidad(es) encontrada(s)</span
            >
          </div>
        </div>

        @if (loading()) {
          <div class="flex items-center justify-center py-12">
            <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <span class="ml-3 text-gray-600">Cargando universidades...</span>
          </div>
        } @else {
          <div class="p-6">
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              @for (university of paginatedUniversities(); track university.id) {
                <div
                  class="rounded-xl border bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
                >
                  <!-- University Header -->
                  <div class="mb-4 flex items-start justify-between">
                    <div class="flex items-center space-x-3">
                      <div
                        class="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600"
                      >
                        @if (university.logo) {
                          <img
                            [src]="university.logo"
                            [alt]="university.nombre"
                            class="h-full w-full rounded-lg object-cover"
                          />
                        } @else {
                          <span class="text-lg font-bold text-white">{{
                            getInitials(university.nombre)
                          }}</span>
                        }
                      </div>
                      <div class="flex-1">
                        <h3 class="truncate text-lg font-semibold text-gray-900">
                          {{ university.nombre }}
                        </h3>
                        <p class="text-sm text-gray-500">{{ university.dominio }}</p>
                      </div>
                    </div>
                    <span
                      class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                      [ngClass]="
                        university.activa
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      "
                    >
                      {{ university.activa ? 'Activa' : 'Inactiva' }}
                    </span>
                  </div>

                  <!-- University Details -->
                  <div class="mb-4 space-y-3">
                    <div class="flex items-center text-sm text-gray-600">
                      <svg
                        class="mr-2 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        ></path>
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                      </svg>
                      {{ university.ciudad ? university.ciudad + ', ' : '' }}{{ university.pais }}
                    </div>

                    @if (university.descripcion) {
                      <p class="line-clamp-2 text-sm text-gray-600">{{ university.descripcion }}</p>
                    }

                    <div class="flex justify-between text-sm text-gray-500">
                      <span>{{ university.totalUsuarios || 0 }} usuarios</span>
                      <span>{{ university.totalEventos || 0 }} eventos</span>
                    </div>
                  </div>

                  <!-- University Actions -->
                  <div class="flex items-center justify-between border-t border-gray-100 pt-4">
                    <span class="text-xs text-gray-400">
                      Registrada: {{ formatDate(university.fechaCreacion) }}
                    </span>
                    <div class="flex space-x-2">
                      <button
                        (click)="viewUniversity(university)"
                        class="p-1 text-blue-600 transition-colors hover:text-blue-900"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          ></path>
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          ></path>
                        </svg>
                      </button>
                      <button
                        (click)="editUniversity(university)"
                        class="text-indigo-600 hover:text-indigo-900 p-1 transition-colors"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          ></path>
                        </svg>
                      </button>
                      <button
                        (click)="toggleUniversityStatus(university)"
                        [class]="
                          university.activa
                            ? 'text-red-600 hover:text-red-900'
                            : 'text-green-600 hover:text-green-900'
                        "
                        class="p-1 transition-colors"
                      >
                        @if (university.activa) {
                          <svg
                            class="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"
                            ></path>
                          </svg>
                        } @else {
                          <svg
                            class="h-4 w-4"
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
                        }
                      </button>
                    </div>
                  </div>
                </div>
              } @empty {
                <div class="col-span-full py-12 text-center">
                  <svg
                    class="mx-auto mb-4 h-16 w-16 text-gray-400"
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
                  <p class="mb-2 text-lg text-gray-500">No se encontraron universidades</p>
                  <p class="text-gray-400">Intenta ajustar los filtros de búsqueda</p>
                </div>
              }
            </div>

            <!-- Pagination -->
            @if (filteredUniversities().length > pageSize) {
              <div class="mt-8 flex items-center justify-between">
                <div class="text-sm text-gray-700">
                  Mostrando {{ (currentPage - 1) * pageSize + 1 }} a
                  {{ Math.min(currentPage * pageSize, filteredUniversities().length) }} de
                  {{ filteredUniversities().length }} resultados
                </div>
                <div class="flex space-x-2">
                  <button
                    (click)="previousPage()"
                    [disabled]="currentPage === 1"
                    class="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  @for (page of getPageNumbers(); track page) {
                    <button
                      (click)="goToPage(page)"
                      [class.bg-blue-600]="page === currentPage"
                      [class.text-white]="page === currentPage"
                      [class.text-gray-700]="page !== currentPage"
                      [class.border-gray-300]="page !== currentPage"
                      [class.hover:bg-gray-50]="page !== currentPage"
                      class="rounded-md border px-3 py-2 text-sm transition-colors"
                    >
                      {{ page }}
                    </button>
                  }
                  <button
                    (click)="nextPage()"
                    [disabled]="currentPage === totalPages"
                    class="rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUniversitiesComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly universityService = inject(UniversityService);

  readonly universities = signal<University[]>([]);
  readonly filteredUniversities = signal<University[]>([]);
  readonly paginatedUniversities = signal<University[]>([]);
  readonly loading = signal(false);
  readonly universityStats = signal<UniversityStats>({
    total: 0,
    active: 0,
    inactive: 0,
    totalUsers: 0,
    totalEvents: 0,
  });

  searchTerm = '';
  selectedCountry = '';
  selectedStatus = '';
  currentPage = 1;
  pageSize = 9;
  totalPages = 0;
  Math = Math;

  ngOnInit(): void {
    this.loadUniversities();
  }

  private loadUniversities(): void {
    this.loading.set(true);
    this.universityService.getAll().subscribe({
      next: (universities: UniversityModel[]) => {
        const processedUniversities: University[] = universities.map((uni: UniversityModel) => ({
          id: uni.id,
          nombre: uni.nombre,
          dominio: uni.dominio_correo,
          pais: 'México',
          ciudad: undefined,
          descripcion: undefined,
          logo: uni.logo_url,
          activa: true,
          fechaCreacion: uni.creado_en,
          totalUsuarios: uni.estudiantes_count || 0,
          totalEventos: uni.proyectos_count || 0,
        }));

        this.universities.set(processedUniversities);
        this.updateStats(processedUniversities);
        this.filterUniversities();
        this.loading.set(false);
      },
      error: error => {
        console.error('Error loading universities:', error);
        this.loading.set(false);
      },
    });
  }

  private updateStats(universities: University[]): void {
    const stats: UniversityStats = {
      total: universities.length,
      active: universities.filter(u => u.activa).length,
      inactive: universities.filter(u => !u.activa).length,
      totalUsers: universities.reduce((sum, u) => sum + (u.totalUsuarios || 0), 0),
      totalEvents: universities.reduce((sum, u) => sum + (u.totalEventos || 0), 0),
    };
    this.universityStats.set(stats);
  }

  filterUniversities(): void {
    let filtered = this.universities();

    // Filter by search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        uni => uni.nombre.toLowerCase().includes(term) || uni.dominio.toLowerCase().includes(term),
      );
    }

    // Filter by country
    if (this.selectedCountry) {
      filtered = filtered.filter(uni => uni.pais === this.selectedCountry);
    }

    // Filter by status
    if (this.selectedStatus) {
      filtered = filtered.filter(uni =>
        this.selectedStatus === 'active' ? uni.activa : !uni.activa,
      );
    }

    this.filteredUniversities.set(filtered);
    this.currentPage = 1;
    this.updatePagination();
  }

  private updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredUniversities().length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedUniversities.set(this.filteredUniversities().slice(startIndex, endIndex));
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCountry = '';
    this.selectedStatus = '';
    this.filterUniversities();
  }

  refreshUniversities(): void {
    this.loadUniversities();
  }

  openCreateUniversityModal(): void {
    // TODO: Implement create university modal
    // Placeholder for future implementation
  }

  viewUniversity(university: University): void {
    this.router.navigate(['/admin/universities', university.id]);
  }

  editUniversity(university: University): void {
    this.router.navigate(['/admin/universities', university.id, 'edit']);
  }

  toggleUniversityStatus(_university: University): void {
    // TODO: Implement toggle university status
    // Placeholder for future implementation
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  }

  getCountries(): string[] {
    const countries = [...new Set(this.universities().map(u => u.pais))];
    return countries.sort();
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // Pagination methods
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updatePagination();
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }
}
