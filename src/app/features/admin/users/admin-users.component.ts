import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '@app/core/services/user/user.service';

interface AdminUser {
  id: number;
  nombre: string;
  correo: string;
  role: {
    id: number;
    nombre: string;
  };
  universidad?: {
    id: number;
    nombre: string;
  };
  fechaCreacion: string;
  ultimoAcceso?: string;
  activo: boolean;
}

interface UserStats {
  total: number;
  students: number;
  graduates: number;
  admins: number;
  active: number;
  inactive: number;
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="admin-hero-section">
        <div class="mb-4 flex items-center justify-between">
          <div>
            <h1 class="admin-page-title">Gestión de Usuarios</h1>
            <p class="mt-1 text-gray-600">Administrar todas las cuentas de usuario en el sistema</p>
          </div>
          <div class="flex space-x-3">
            <button (click)="refreshUsers()" class="btn-secondary">
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
              (click)="openCreateUserModal()"
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
              Nuevo Usuario
            </button>
          </div>
        </div>

        <!-- Stats Cards -->
        <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-6">
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-gray-600">Total</p>
                <p class="text-xl font-semibold text-gray-900">{{ userStats().total }}</p>
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
                    d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                  ></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-gray-600">Estudiantes</p>
                <p class="text-xl font-semibold text-gray-900">{{ userStats().students }}</p>
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  ></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-gray-600">Graduados</p>
                <p class="text-xl font-semibold text-gray-900">{{ userStats().graduates }}</p>
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  ></path>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-gray-600">Admins</p>
                <p class="text-xl font-semibold text-gray-900">{{ userStats().admins }}</p>
              </div>
            </div>
          </div>

          <div class="bg-emerald-50 rounded-lg p-4">
            <div class="flex items-center">
              <div class="bg-emerald-100 rounded-lg p-2">
                <svg
                  class="text-emerald-600 h-6 w-6"
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
                <p class="text-sm text-gray-600">Activos</p>
                <p class="text-xl font-semibold text-gray-900">{{ userStats().active }}</p>
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
                <p class="text-sm text-gray-600">Inactivos</p>
                <p class="text-xl font-semibold text-gray-900">{{ userStats().inactive }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="rounded-lg border bg-white p-6 shadow-sm">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">Buscar usuario</label>
            <div class="relative">
              <input
                type="text"
                [(ngModel)]="searchTerm"
                (input)="filterUsers()"
                placeholder="Nombre o correo..."
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
            <label class="mb-2 block text-sm font-medium text-gray-700">Filtrar por rol</label>
            <select
              [(ngModel)]="selectedRole"
              (change)="filterUsers()"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los roles</option>
              <option value="Estudiante">Estudiantes</option>
              <option value="Graduado">Graduados</option>
              <option value="Admin">Administradores</option>
              <option value="Admin_Universidad">Admin Universidad</option>
              <option value="Promotor">Promotores</option>
            </select>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-gray-700">Estado</label>
            <select
              [(ngModel)]="selectedStatus"
              (change)="filterUsers()"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
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

      <!-- Users Table -->
      <div class="rounded-lg border bg-white shadow-sm">
        <div class="border-b border-gray-200 px-6 py-4">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Lista de Usuarios</h2>
            <span class="text-sm text-gray-500"
              >{{ filteredUsers().length }} usuario(s) encontrado(s)</span
            >
          </div>
        </div>

        @if (loading()) {
          <div class="flex items-center justify-center py-12">
            <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <span class="ml-3 text-gray-600">Cargando usuarios...</span>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Usuario
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Rol
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Universidad
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Estado
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Registrado
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                @for (user of paginatedUsers(); track user.id) {
                  <tr class="hover:bg-gray-50">
                    <td class="whitespace-nowrap px-6 py-4">
                      <div class="flex items-center">
                        <div
                          class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600"
                        >
                          <span class="text-sm font-medium text-white">{{
                            getInitials(user.nombre)
                          }}</span>
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ user.nombre }}</div>
                          <div class="text-sm text-gray-500">{{ user.correo }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <span
                        class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                        [ngClass]="getRoleBadgeClass(user.role.nombre)"
                      >
                        {{ getRoleDisplayName(user.role.nombre) }}
                      </span>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {{ user.universidad?.nombre || 'N/A' }}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <span
                        class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                        [ngClass]="
                          user.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        "
                      >
                        {{ user.activo ? 'Activo' : 'Inactivo' }}
                      </span>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {{ formatDate(user.fechaCreacion) }}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      <div class="flex space-x-2">
                        <button
                          (click)="viewUser(user)"
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
                          (click)="editUser(user)"
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
                          (click)="toggleUserStatus(user)"
                          [class]="
                            user.activo
                              ? 'text-red-600 hover:text-red-900'
                              : 'text-green-600 hover:text-green-900'
                          "
                          class="transition-colors"
                        >
                          @if (user.activo) {
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
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        ></path>
                      </svg>
                      <p class="mb-2 text-lg text-gray-500">No se encontraron usuarios</p>
                      <p class="text-gray-400">Intenta ajustar los filtros de búsqueda</p>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          @if (filteredUsers().length > pageSize) {
            <div class="border-t border-gray-200 bg-gray-50 px-6 py-4">
              <div class="flex items-center justify-between">
                <div class="text-sm text-gray-700">
                  Mostrando {{ (currentPage - 1) * pageSize + 1 }} a
                  {{ Math.min(currentPage * pageSize, filteredUsers().length) }} de
                  {{ filteredUsers().length }} resultados
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
export class AdminUsersComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  readonly users = signal<AdminUser[]>([]);
  showCreateUserForm = signal(false);
  readonly filteredUsers = signal<AdminUser[]>([]);
  readonly paginatedUsers = signal<AdminUser[]>([]);
  readonly loading = signal(false);
  readonly userStats = signal<UserStats>({
    total: 0,
    students: 0,
    graduates: 0,
    admins: 0,
    active: 0,
    inactive: 0,
  });

  searchTerm = '';
  selectedRole = '';
  selectedStatus = '';
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  Math = Math;

  ngOnInit(): void {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.loading.set(true);
    this.userService.getAll().subscribe({
      next: (users: any) => {
        const processedUsers: AdminUser[] = users.map((user: any) => ({
          id: user.id,
          nombre: user.nombre,
          correo: user.correo,
          role: user.role || { id: 0, nombre: 'Usuario' },
          universidad: user.universidad,
          fechaCreacion: user.fechaCreacion || new Date().toISOString(),
          ultimoAcceso: user.ultimoAcceso,
          activo: user.activo ?? true,
        }));

        this.users.set(processedUsers);
        this.updateStats(processedUsers);
        this.filterUsers();
        this.loading.set(false);
      },
      error: (error: any) => {
        console.error('Error loading users:', error);
        this.loading.set(false);
      },
    });
  }

  private updateStats(users: AdminUser[]): void {
    const stats: UserStats = {
      total: users.length,
      students: users.filter(u => u.role.nombre === 'Estudiante').length,
      graduates: users.filter(u => u.role.nombre === 'Graduado').length,
      admins: users.filter(u => u.role.nombre.includes('Admin')).length,
      active: users.filter(u => u.activo).length,
      inactive: users.filter(u => !u.activo).length,
    };
    this.userStats.set(stats);
  }

  filterUsers(): void {
    let filtered = this.users();

    // Filter by search term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        user =>
          user.nombre.toLowerCase().includes(term) || user.correo.toLowerCase().includes(term),
      );
    }

    // Filter by role
    if (this.selectedRole) {
      filtered = filtered.filter(user => user.role.nombre === this.selectedRole);
    }

    // Filter by status
    if (this.selectedStatus) {
      filtered = filtered.filter(user =>
        this.selectedStatus === 'active' ? user.activo : !user.activo,
      );
    }

    this.filteredUsers.set(filtered);
    this.currentPage = 1;
    this.updatePagination();
  }

  private updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredUsers().length / this.pageSize);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedUsers.set(this.filteredUsers().slice(startIndex, endIndex));
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedRole = '';
    this.selectedStatus = '';
    this.filterUsers();
  }

  refreshUsers(): void {
    this.loadUsers();
  }

  openCreateUserModal(): void {
    this.router.navigate(['/admin/users/create']);
  }

  onUserCreated(): void {
    this.showCreateUserForm.set(false);
    this.loadUsers(); // Recarga la lista
  }

  onCancelCreate(): void {
    this.showCreateUserForm.set(false);
  }

  viewUser(user: AdminUser): void {
    this.router.navigate(['/admin/users', user.id]);
  }

  editUser(user: AdminUser): void {
    this.router.navigate(['/admin/users', user.id, 'edit']);
  }

  toggleUserStatus(_user: AdminUser): void {
    // TODO: Implement toggle user status
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

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-800';
      case 'Admin_Universidad':
        return 'bg-orange-100 text-orange-800';
      case 'Estudiante':
        return 'bg-blue-100 text-blue-800';
      case 'Graduado':
        return 'bg-purple-100 text-purple-800';
      case 'Promotor':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getRoleDisplayName(role: string): string {
    switch (role) {
      case 'Admin':
        return 'Administrador';
      case 'Admin_Universidad':
        return 'Admin Universidad';
      case 'Estudiante':
        return 'Estudiante';
      case 'Graduado':
        return 'Graduado';
      case 'Promotor':
        return 'Promotor';
      default:
        return role;
    }
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
