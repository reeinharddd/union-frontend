import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface AdminForum {
  id: number;
  title: string;
  description: string;
  category: string;
  createdBy: {
    id: number;
    name: string;
    university: string;
    avatar?: string;
  };
  createdAt: string;
  stats: {
    threads: number;
    posts: number;
    activeUsers: number;
    lastActivity: string;
  };
  status: 'active' | 'inactive' | 'moderated';
  moderators: number;
  isVerified: boolean;
  tags: string[];
}

interface ForumStats {
  totalForums: number;
  activeForums: number;
  totalThreads: number;
  totalPosts: number;
  moderatedForums: number;
  dailyPosts: number;
  avgPostsPerForum: number;
  topCategory: string;
}

@Component({
  selector: 'app-admin-forums',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="rounded-lg border bg-white p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">Gestión de Foros</h1>
            <p class="mt-1 text-gray-600">Administra foros, moderación y discusiones académicas</p>
          </div>
          <div class="flex space-x-3">
            <button
              (click)="refreshForums()"
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
              (click)="createForum()"
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
              Crear Foro
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <!-- Total Forums -->
        <div class="rounded-lg border bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total de Foros</p>
              <p class="text-3xl font-bold text-gray-900">{{ forumStats().totalForums }}</p>
              <div class="mt-2 flex items-center">
                <span class="text-sm text-green-600">{{ forumStats().activeForums }} activos</span>
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Threads -->
        <div class="rounded-lg border bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Hilos de Discusión</p>
              <p class="text-3xl font-bold text-gray-900">{{ forumStats().totalThreads }}</p>
              <div class="mt-2 flex items-center">
                <span class="text-sm text-gray-500">En todos los foros</span>
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
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1l-4 4z"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Posts -->
        <div class="rounded-lg border bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total de Posts</p>
              <p class="text-3xl font-bold text-gray-900">{{ forumStats().totalPosts }}</p>
              <div class="mt-2 flex items-center">
                <span class="text-sm text-blue-600">+{{ forumStats().dailyPosts }} hoy</span>
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
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Moderated Forums -->
        <div class="rounded-lg border bg-white p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Foros Moderados</p>
              <p class="text-3xl font-bold text-gray-900">{{ forumStats().moderatedForums }}</p>
              <div class="mt-2 flex items-center">
                <span class="text-orange-600 text-sm">Requieren atención</span>
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="rounded-lg border bg-white p-4 shadow-sm">
        <div class="flex flex-wrap items-center gap-4">
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700">Buscar:</label>
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (input)="onSearch()"
              placeholder="Buscar foros..."
              class="rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700">Estado:</label>
            <select
              [(ngModel)]="statusFilter"
              (change)="onFilterChange()"
              class="rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
              <option value="moderated">Moderados</option>
            </select>
          </div>
          <div class="flex items-center space-x-2">
            <label class="text-sm font-medium text-gray-700">Categoría:</label>
            <select
              [(ngModel)]="categoryFilter"
              (change)="onFilterChange()"
              class="rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas</option>
              <option value="Tecnología">Tecnología</option>
              <option value="Ciencias">Ciencias</option>
              <option value="Humanidades">Humanidades</option>
              <option value="Ingeniería">Ingeniería</option>
              <option value="Negocios">Negocios</option>
              <option value="Arte">Arte</option>
              <option value="General">General</option>
            </select>
          </div>
          <div class="ml-auto flex items-center space-x-2">
            <span class="text-sm text-gray-500"
              >{{ filteredForums().length }} de {{ forums().length }} foros</span
            >
          </div>
        </div>
      </div>

      <!-- Forums Table -->
      <div class="overflow-hidden rounded-lg border bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Foro
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Creador
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Estadísticas
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Estado
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Actividad
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              @for (forum of paginatedForums(); track forum.id) {
                <tr class="hover:bg-gray-50">
                  <td class="whitespace-nowrap px-6 py-4">
                    <div class="flex items-start">
                      <div class="min-w-0 flex-1">
                        <div class="flex items-center">
                          <p class="truncate text-sm font-medium text-gray-900">
                            {{ forum.title }}
                          </p>
                          @if (forum.isVerified) {
                            <svg
                              class="ml-2 h-4 w-4 flex-shrink-0 text-blue-500"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fill-rule="evenodd"
                                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clip-rule="evenodd"
                              ></path>
                            </svg>
                          }
                        </div>
                        <p class="truncate text-sm text-gray-500">{{ forum.description }}</p>
                        <div class="mt-1 flex items-center space-x-2">
                          <span
                            class="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800"
                          >
                            {{ forum.category }}
                          </span>
                          @for (tag of forum.tags.slice(0, 2); track tag) {
                            <span
                              class="inline-flex items-center rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"
                            >
                              {{ tag }}
                            </span>
                          }
                          @if (forum.tags.length > 2) {
                            <span class="text-xs text-gray-500"
                              >+{{ forum.tags.length - 2 }} más</span
                            >
                          }
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    <div class="flex items-center">
                      <div
                        class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-purple-500 text-sm font-medium text-white"
                      >
                        {{ getInitials(forum.createdBy.name) }}
                      </div>
                      <div class="ml-3">
                        <p class="text-sm font-medium text-gray-900">{{ forum.createdBy.name }}</p>
                        <p class="text-sm text-gray-500">{{ forum.createdBy.university }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    <div class="text-sm text-gray-900">
                      <div class="flex items-center space-x-4">
                        <div class="text-center">
                          <p class="font-medium">{{ forum.stats.threads }}</p>
                          <p class="text-xs text-gray-500">Hilos</p>
                        </div>
                        <div class="text-center">
                          <p class="font-medium">{{ forum.stats.posts }}</p>
                          <p class="text-xs text-gray-500">Posts</p>
                        </div>
                        <div class="text-center">
                          <p class="font-medium">{{ forum.stats.activeUsers }}</p>
                          <p class="text-xs text-gray-500">Usuarios</p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4">
                    <div class="flex flex-col space-y-1">
                      <span
                        class="inline-flex rounded-full px-2 py-1 text-xs font-semibold"
                        [ngClass]="getStatusClasses(forum.status)"
                      >
                        {{ getStatusText(forum.status) }}
                      </span>
                      @if (forum.moderators > 0) {
                        <span class="text-xs text-gray-500"
                          >{{ forum.moderators }} moderadores</span
                        >
                      }
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    <div>
                      <p class="text-sm">{{ getTimeAgo(forum.stats.lastActivity) }}</p>
                      <p class="text-xs text-gray-400">{{ formatDate(forum.createdAt) }}</p>
                    </div>
                  </td>
                  <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <div class="flex items-center justify-end space-x-2">
                      <button
                        (click)="viewForum(forum)"
                        class="text-blue-600 transition-colors hover:text-blue-900"
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
                        (click)="editForum(forum)"
                        class="text-green-600 transition-colors hover:text-green-900"
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
                        (click)="deleteForum(forum)"
                        class="text-red-600 transition-colors hover:text-red-900"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="px-6 py-12 text-center">
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
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      ></path>
                    </svg>
                    <p class="text-lg text-gray-500">No se encontraron foros</p>
                    <p class="mt-1 text-sm text-gray-400">
                      Intenta ajustar los filtros de búsqueda
                    </p>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        @if (filteredForums().length > itemsPerPage) {
          <div class="border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <p class="text-sm text-gray-700">
                  Mostrando {{ (currentPage - 1) * itemsPerPage + 1 }} a
                  {{ Math.min(currentPage * itemsPerPage, filteredForums().length) }} de
                  {{ filteredForums().length }} resultados
                </p>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  (click)="previousPage()"
                  [disabled]="currentPage === 1"
                  class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 19l-7-7 7-7"
                    ></path>
                  </svg>
                </button>
                <span class="text-sm text-gray-700"
                  >Página {{ currentPage }} de {{ totalPages }}</span
                >
                <button
                  (click)="nextPage()"
                  [disabled]="currentPage === totalPages"
                  class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminForumsComponent implements OnInit {
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly forums = signal<AdminForum[]>([]);
  readonly filteredForums = signal<AdminForum[]>([]);
  readonly forumStats = signal<ForumStats>({
    totalForums: 0,
    activeForums: 0,
    totalThreads: 0,
    totalPosts: 0,
    moderatedForums: 0,
    dailyPosts: 0,
    avgPostsPerForum: 0,
    topCategory: '',
  });

  searchTerm = '';
  statusFilter = '';
  categoryFilter = '';
  currentPage = 1;
  itemsPerPage = 10;
  Math = Math;

  get totalPages(): number {
    return Math.ceil(this.filteredForums().length / this.itemsPerPage);
  }

  get paginatedForums(): () => AdminForum[] {
    return () => {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredForums().slice(start, end);
    };
  }

  ngOnInit(): void {
    this.loadForums();
  }

  private loadForums(): void {
    this.loading.set(true);

    // Simulate loading data
    setTimeout(() => {
      // Mock forums data
      const mockForums: AdminForum[] = [
        {
          id: 1,
          title: 'Inteligencia Artificial en Educación',
          description: 'Discusión sobre aplicaciones de IA en el ámbito educativo',
          category: 'Tecnología',
          createdBy: {
            id: 1,
            name: 'Dr. Ana García',
            university: 'Universidad Tecnológica',
            avatar: '',
          },
          createdAt: '2024-01-15T10:00:00Z',
          stats: {
            threads: 45,
            posts: 234,
            activeUsers: 89,
            lastActivity: '2024-01-20T15:30:00Z',
          },
          status: 'active',
          moderators: 2,
          isVerified: true,
          tags: ['IA', 'Educación', 'Tecnología'],
        },
        {
          id: 2,
          title: 'Sostenibilidad Ambiental',
          description: 'Proyectos y discusiones sobre sostenibilidad',
          category: 'Ciencias',
          createdBy: {
            id: 2,
            name: 'Prof. Carlos Mendez',
            university: 'Instituto Politécnico',
            avatar: '',
          },
          createdAt: '2024-01-10T09:00:00Z',
          stats: {
            threads: 32,
            posts: 156,
            activeUsers: 67,
            lastActivity: '2024-01-19T11:45:00Z',
          },
          status: 'active',
          moderators: 1,
          isVerified: true,
          tags: ['Sostenibilidad', 'Medio Ambiente', 'Investigación'],
        },
        {
          id: 3,
          title: 'Emprendimiento Digital',
          description: 'Espacio para emprendedores y startups tecnológicas',
          category: 'Negocios',
          createdBy: {
            id: 3,
            name: 'María López',
            university: 'Universidad de Negocios',
            avatar: '',
          },
          createdAt: '2024-01-05T14:20:00Z',
          stats: {
            threads: 28,
            posts: 98,
            activeUsers: 45,
            lastActivity: '2024-01-18T16:20:00Z',
          },
          status: 'moderated',
          moderators: 3,
          isVerified: false,
          tags: ['Emprendimiento', 'Startups', 'Digital'],
        },
      ];

      this.forums.set(mockForums);
      this.applyFilters();

      // Mock stats
      this.forumStats.set({
        totalForums: mockForums.length,
        activeForums: mockForums.filter(f => f.status === 'active').length,
        totalThreads: mockForums.reduce((sum, f) => sum + f.stats.threads, 0),
        totalPosts: mockForums.reduce((sum, f) => sum + f.stats.posts, 0),
        moderatedForums: mockForums.filter(f => f.status === 'moderated').length,
        dailyPosts: 47,
        avgPostsPerForum: Math.round(
          mockForums.reduce((sum, f) => sum + f.stats.posts, 0) / mockForums.length,
        ),
        topCategory: 'Tecnología',
      });

      this.loading.set(false);
    }, 1000);
  }

  private applyFilters(): void {
    let filtered = this.forums();

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        forum =>
          forum.title.toLowerCase().includes(term) ||
          forum.description.toLowerCase().includes(term) ||
          forum.createdBy.name.toLowerCase().includes(term),
      );
    }

    // Apply status filter
    if (this.statusFilter) {
      filtered = filtered.filter(forum => forum.status === this.statusFilter);
    }

    // Apply category filter
    if (this.categoryFilter) {
      filtered = filtered.filter(forum => forum.category === this.categoryFilter);
    }

    this.filteredForums.set(filtered);
    this.currentPage = 1; // Reset to first page when filters change
  }

  onSearch(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  refreshForums(): void {
    this.loadForums();
  }

  createForum(): void {
    this.router.navigate(['/admin/forums/create']);
  }

  viewForum(forum: AdminForum): void {
    this.router.navigate(['/admin/forums', forum.id]);
  }

  editForum(forum: AdminForum): void {
    this.router.navigate(['/admin/forums', forum.id, 'edit']);
  }

  deleteForum(forum: AdminForum): void {
    if (confirm(`¿Estás seguro de que deseas eliminar el foro "${forum.title}"?`)) {
      // TODO: Implement delete functionality
      // Remove forum from list for now
      const updatedForums = this.forums().filter(f => f.id !== forum.id);
      this.forums.set(updatedForums);
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

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getStatusClasses(status: string): string {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'moderated':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'inactive':
        return 'Inactivo';
      case 'moderated':
        return 'Moderado';
      default:
        return status;
    }
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Hace unos minutos';
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} horas`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `Hace ${diffInDays} días`;
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}
