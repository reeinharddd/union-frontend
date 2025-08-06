import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from '@app/core/services/event/event.service';

interface AdminEvent {
  id: number;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin?: string;
  modalidad: 'presencial' | 'virtual' | 'hibrida';
  ubicacion?: string;
  enlace?: string;
  capacidad?: number;
  asistentesRegistrados: number;
  universidad: {
    id: number;
    nombre: string;
  };
  organizador: {
    id: number;
    nombre: string;
  };
  estado: 'programado' | 'en_progreso' | 'finalizado' | 'cancelado';
  fechaCreacion: string;
  imagen?: string;
}

interface EventStats {
  total: number;
  programados: number;
  enProgreso: number;
  finalizados: number;
  cancelados: number;
  totalAsistentes: number;
}

@Component({
  selector: 'app-admin-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="rounded-lg border bg-white p-6 shadow-sm">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Gestión de Eventos</h1>
            <p class="mt-1 text-gray-600">Administrar eventos y webinars del sistema</p>
          </div>
          <div class="flex space-x-3">
            <button
              (click)="refreshEvents()"
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
              (click)="openCreateEventModal()"
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
              Nuevo Evento
            </button>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-gray-600">Total</p>
                <p class="text-xl font-semibold text-gray-900">{{ eventStats().total }}</p>
              </div>
            </div>
          </div>

          <div class="rounded-lg bg-yellow-50 p-4">
            <div class="flex items-center">
              <div class="rounded-lg bg-yellow-100 p-2">
                <svg
                  class="h-6 w-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-gray-600">Programados</p>
                <p class="text-xl font-semibold text-gray-900">{{ eventStats().programados }}</p>
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
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-4-4v4m0-4V6a2 2 0 012-2h4a2 2 0 012 2v4"
                  ></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-gray-600">En Progreso</p>
                <p class="text-xl font-semibold text-gray-900">{{ eventStats().enProgreso }}</p>
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-gray-600">Finalizados</p>
                <p class="text-xl font-semibold text-gray-900">{{ eventStats().finalizados }}</p>
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
                <p class="text-sm text-gray-600">Cancelados</p>
                <p class="text-xl font-semibold text-gray-900">{{ eventStats().cancelados }}</p>
              </div>
            </div>
          </div>

          <div class="bg-indigo-50 rounded-lg p-4">
            <div class="flex items-center">
              <div class="bg-indigo-100 rounded-lg p-2">
                <svg
                  class="text-indigo-600 h-6 w-6"
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
                <p class="text-sm text-gray-600">Asistentes</p>
                <p class="text-xl font-semibold text-gray-900">
                  {{ eventStats().totalAsistentes }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="rounded-lg border bg-white p-6 shadow-sm">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-5">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">Buscar evento</label>
            <div class="relative">
              <input
                type="text"
                [(ngModel)]="searchTerm"
                (input)="filterEvents()"
                placeholder="Título del evento..."
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
            <label class="mb-2 block text-sm font-medium text-gray-700">Modalidad</label>
            <select
              [(ngModel)]="selectedModality"
              (change)="filterEvents()"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las modalidades</option>
              <option value="presencial">Presencial</option>
              <option value="virtual">Virtual</option>
              <option value="hibrida">Híbrida</option>
            </select>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">Estado</label>
            <select
              [(ngModel)]="selectedStatus"
              (change)="filterEvents()"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="programado">Programado</option>
              <option value="en_progreso">En Progreso</option>
              <option value="finalizado">Finalizado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">Fecha</label>
            <select
              [(ngModel)]="selectedDateFilter"
              (change)="filterEvents()"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las fechas</option>
              <option value="today">Hoy</option>
              <option value="this_week">Esta semana</option>
              <option value="this_month">Este mes</option>
              <option value="upcoming">Próximos</option>
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

      <!-- Events Table -->
      <div class="rounded-lg border bg-white shadow-sm">
        <div class="border-b border-gray-200 px-6 py-4">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Lista de Eventos</h2>
            <span class="text-sm text-gray-500"
              >{{ filteredEvents().length }} evento(s) encontrado(s)</span
            >
          </div>
        </div>

        @if (loading()) {
          <div class="flex items-center justify-center py-12">
            <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <span class="ml-3 text-gray-600">Cargando eventos...</span>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Evento
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Fecha
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Modalidad
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Asistentes
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Estado
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Universidad
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                @for (event of paginatedEvents(); track event.id) {
                  <tr class="hover:bg-gray-50">
                    <td class="px-6 py-4">
                      <div class="flex items-center">
                        <div
                          class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-blue-600"
                        >
                          @if (event.imagen) {
                            <img
                              [src]="event.imagen"
                              [alt]="event.titulo"
                              class="h-full w-full rounded-lg object-cover"
                            />
                          } @else {
                            <svg
                              class="h-6 w-6 text-white"
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
                          }
                        </div>
                        <div class="ml-4">
                          <div class="max-w-xs truncate text-sm font-medium text-gray-900">
                            {{ event.titulo }}
                          </div>
                          <div class="max-w-xs truncate text-sm text-gray-500">
                            {{ event.descripcion }}
                          </div>
                          <div class="text-xs text-gray-400">
                            Por: {{ event.organizador.nombre }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <div class="text-sm text-gray-900">{{ formatDate(event.fechaInicio) }}</div>
                      <div class="text-xs text-gray-500">{{ formatTime(event.fechaInicio) }}</div>
                      @if (event.fechaFin && event.fechaFin !== event.fechaInicio) {
                        <div class="text-xs text-gray-400">
                          Hasta: {{ formatDate(event.fechaFin) }}
                        </div>
                      }
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <span
                        class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                        [ngClass]="getModalityBadgeClass(event.modalidad)"
                      >
                        {{ getModalityDisplayName(event.modalidad) }}
                      </span>
                      @if (event.modalidad === 'presencial' && event.ubicacion) {
                        <div class="mt-1 max-w-24 truncate text-xs text-gray-500">
                          {{ event.ubicacion }}
                        </div>
                      }
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <div class="flex items-center">
                        <div class="text-sm font-medium text-gray-900">
                          {{ event.asistentesRegistrados }}
                        </div>
                        @if (event.capacidad) {
                          <div class="ml-1 text-xs text-gray-500">/ {{ event.capacidad }}</div>
                        }
                      </div>
                      @if (event.capacidad) {
                        <div class="mt-1 h-1.5 w-full rounded-full bg-gray-200">
                          <div
                            class="h-1.5 rounded-full bg-blue-600"
                            [style.width.%]="(event.asistentesRegistrados / event.capacidad) * 100"
                          ></div>
                        </div>
                      }
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <span
                        class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                        [ngClass]="getStatusBadgeClass(event.estado)"
                      >
                        {{ getStatusDisplayName(event.estado) }}
                      </span>
                    </td>
                    <td class="max-w-32 truncate whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {{ event.universidad.nombre }}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      <div class="flex space-x-2">
                        <button
                          (click)="viewEvent(event)"
                          class="text-blue-600 transition-colors hover:text-blue-900"
                        >
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
                          (click)="editEvent(event)"
                          class="text-indigo-600 hover:text-indigo-900 transition-colors"
                        >
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            ></path>
                          </svg>
                        </button>
                        <button
                          (click)="viewAttendees(event)"
                          class="text-green-600 transition-colors hover:text-green-900"
                        >
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
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                            ></path>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="7" class="px-6 py-12 text-center">
                      <svg
                        class="mx-auto mb-4 h-12 w-12 text-gray-400"
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
                      <p class="mb-2 text-lg text-gray-500">No se encontraron eventos</p>
                      <p class="text-gray-400">Intenta ajustar los filtros de búsqueda</p>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          @if (filteredEvents().length > pageSize) {
            <div class="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div class="flex items-center justify-between">
                <div class="text-sm text-gray-700">
                  Mostrando {{ (currentPage - 1) * pageSize + 1 }} a
                  {{ Math.min(currentPage * pageSize, filteredEvents().length) }} de
                  {{ filteredEvents().length }} resultados
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
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminEventsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly eventService = inject(EventService);

  readonly events = signal<AdminEvent[]>([]);
  readonly filteredEvents = signal<AdminEvent[]>([]);
  readonly paginatedEvents = signal<AdminEvent[]>([]);
  readonly loading = signal(false);
  readonly eventStats = signal<EventStats>({
    total: 0,
    programados: 0,
    enProgreso: 0,
    finalizados: 0,
    cancelados: 0,
    totalAsistentes: 0,
  });

  searchTerm = '';
  selectedModality = '';
  selectedStatus = '';
  selectedDateFilter = '';
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  Math = Math;

  ngOnInit(): void {
    this.loadEvents();
  }

  private loadEvents(): void {
    this.loading.set(true);
    this.eventService.getEvents().subscribe({
      next: events => {
        const processedEvents: AdminEvent[] = events.map((event: any) => ({
          id: event.id,
          titulo: event.titulo,
          descripcion: event.descripcion,
          fechaInicio: event.fechaInicio,
          fechaFin: event.fechaFin,
          modalidad: event.modalidad || 'virtual',
          ubicacion: event.ubicacion,
          enlace: event.enlace,
          capacidad: event.capacidad,
          asistentesRegistrados: event.asistentesRegistrados || 0,
          universidad: event.universidad || { id: 0, nombre: 'N/A' },
          organizador: event.organizador || { id: 0, nombre: 'N/A' },
          estado: event.estado || 'programado',
          fechaCreacion: event.fechaCreacion || new Date().toISOString(),
          imagen: event.imagen,
        }));

        this.events.set(processedEvents);
        this.updateStats(processedEvents);
        this.filterEvents();
        this.loading.set(false);
      },
      error: error => {
        console.error('Error loading events:', error);
        this.loading.set(false);
      },
    });
  }

  private updateStats(events: AdminEvent[]): void {
    const stats: EventStats = {
      total: events.length,
      programados: events.filter(e => e.estado === 'programado').length,
      enProgreso: events.filter(e => e.estado === 'en_progreso').length,
      finalizados: events.filter(e => e.estado === 'finalizado').length,
      cancelados: events.filter(e => e.estado === 'cancelado').length,
      totalAsistentes: events.reduce((sum, e) => sum + e.asistentesRegistrados, 0),
    };
    this.eventStats.set(stats);
  }

  filterEvents(): void {
    let filtered = this.events();

    // Filter by search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        event =>
          event.titulo.toLowerCase().includes(term) ||
          event.descripcion.toLowerCase().includes(term),
      );
    }

    // Filter by modality
    if (this.selectedModality) {
      filtered = filtered.filter(event => event.modalidad === this.selectedModality);
    }

    // Filter by status
    if (this.selectedStatus) {
      filtered = filtered.filter(event => event.estado === this.selectedStatus);
    }

    // Filter by date
    if (this.selectedDateFilter) {
      const now = new Date();
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.fechaInicio);

        switch (this.selectedDateFilter) {
          case 'today':
            return eventDate.toDateString() === now.toDateString();
          case 'this_week':
            const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
            const weekEnd = new Date(now.setDate(now.getDate() - now.getDay() + 6));
            return eventDate >= weekStart && eventDate <= weekEnd;
          case 'this_month':
            return (
              eventDate.getMonth() === now.getMonth() &&
              eventDate.getFullYear() === now.getFullYear()
            );
          case 'upcoming':
            return eventDate > now;
          default:
            return true;
        }
      });
    }

    this.filteredEvents.set(filtered);
    this.currentPage = 1;
    this.updatePagination();
  }

  private updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredEvents().length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedEvents.set(this.filteredEvents().slice(startIndex, endIndex));
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedModality = '';
    this.selectedStatus = '';
    this.selectedDateFilter = '';
    this.filterEvents();
  }

  refreshEvents(): void {
    this.loadEvents();
  }

  openCreateEventModal(): void {
    // TODO: Implement create event modal
    // Placeholder for future implementation
  }

  viewEvent(event: AdminEvent): void {
    this.router.navigate(['/admin/eventos', event.id]);
  }

  editEvent(event: AdminEvent): void {
    this.router.navigate(['/admin/eventos', event.id, 'edit']);
  }

  viewAttendees(event: AdminEvent): void {
    this.router.navigate(['/admin/eventos', event.id, 'attendees']);
  }

  getModalityBadgeClass(modality: string): string {
    switch (modality) {
      case 'presencial':
        return 'bg-blue-100 text-blue-800';
      case 'virtual':
        return 'bg-green-100 text-green-800';
      case 'hibrida':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getModalityDisplayName(modality: string): string {
    switch (modality) {
      case 'presencial':
        return 'Presencial';
      case 'virtual':
        return 'Virtual';
      case 'hibrida':
        return 'Híbrida';
      default:
        return modality;
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'programado':
        return 'bg-yellow-100 text-yellow-800';
      case 'en_progreso':
        return 'bg-green-100 text-green-800';
      case 'finalizado':
        return 'bg-purple-100 text-purple-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusDisplayName(status: string): string {
    switch (status) {
      case 'programado':
        return 'Programado';
      case 'en_progreso':
        return 'En Progreso';
      case 'finalizado':
        return 'Finalizado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  formatTime(date: string): string {
    return new Date(date).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
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
