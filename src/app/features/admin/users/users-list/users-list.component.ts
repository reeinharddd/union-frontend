import { Component } from '@angular/core';

@Component({
  selector: 'app-users-list',
  standalone: true,
  template: `
    <!-- Hero Section Admin -->
    <div class="admin-hero-section admin-floating-elements">
      <div class="relative z-10">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div
              class="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-soft"
            >
              <svg class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-2.025"
                />
              </svg>
            </div>
            <div>
              <h1 class="admin-page-title">Gestión de Usuarios</h1>
              <p class="admin-page-subtitle">Administra todos los usuarios del sistema UniON</p>
            </div>
          </div>
          <button class="admin-action-btn flex items-center space-x-2">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>Nuevo Usuario</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="admin-stats-grid">
      <div class="admin-stat-card">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <svg
                class="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div>
              <p class="stat-label">Total Usuarios</p>
              <p class="stat-value">4</p>
            </div>
          </div>
          <svg class="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>
      </div>

      <div class="admin-stat-card">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
              <svg
                class="h-6 w-6 text-success"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p class="stat-label">Activos</p>
              <p class="stat-value">4</p>
            </div>
          </div>
          <span class="stat-change positive">+100%</span>
        </div>
      </div>

      <div class="admin-stat-card">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
              <svg
                class="h-6 w-6 text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <div>
              <p class="stat-label">Roles</p>
              <p class="stat-value">3</p>
            </div>
          </div>
          <svg class="h-5 w-5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Main Content Card -->
    <div class="admin-table-container">
      <div class="admin-table-header">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-text-base">Lista de Usuarios</h2>
          <div class="flex items-center space-x-4">
            <div class="admin-search-container">
              <svg
                class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input type="text" placeholder="Buscar usuarios..." class="admin-search-input" />
            </div>
            <button class="admin-filter-chip">
              <svg class="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
                />
              </svg>
              Filtros
            </button>
          </div>
        </div>
      </div>

      <div class="divide-y divide-border/30">
        <div class="admin-table-row group">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-400 to-accent-400 font-semibold text-white shadow-soft"
              >
                E
              </div>
              <div>
                <h3 class="font-semibold text-text-base transition-colors group-hover:text-primary">
                  esteban&#64;gmail.com
                </h3>
                <p class="text-sm text-text-muted">esteban.beltran • Admin Principal</p>
                <div class="mt-1 flex items-center space-x-4 text-xs text-text-muted">
                  <span class="flex items-center space-x-1">
                    <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Ayer 14:30</span>
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <span class="admin-status-badge">Activo</span>
              <button class="quick-action-btn secondary">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="admin-table-row group">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-secondary-400 to-primary-400 font-semibold text-white shadow-soft"
              >
                A
              </div>
              <div>
                <h3 class="font-semibold text-text-base transition-colors group-hover:text-primary">
                  ana&#64;un.edu.mx
                </h3>
                <p class="text-sm text-text-muted">ana.rodriguez • Estudiante</p>
                <div class="mt-1 flex items-center space-x-4 text-xs text-text-muted">
                  <span class="flex items-center space-x-1">
                    <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Hace 2 horas</span>
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <span class="admin-status-badge">Activo</span>
              <button class="quick-action-btn secondary">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="admin-table-row group">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-400 to-secondary-400 font-semibold text-white shadow-soft"
              >
                L
              </div>
              <div>
                <h3 class="font-semibold text-text-base transition-colors group-hover:text-primary">
                  luis&#64;it.edu.mx
                </h3>
                <p class="text-sm text-text-muted">luis.martinez • Profesor</p>
                <div class="mt-1 flex items-center space-x-4 text-xs text-text-muted">
                  <span class="flex items-center space-x-1">
                    <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Hace 1 día</span>
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <span class="admin-status-badge">Activo</span>
              <button class="quick-action-btn secondary">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="admin-table-row group">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-success-400 to-primary-400 font-semibold text-white shadow-soft"
              >
                E
              </div>
              <div>
                <h3 class="font-semibold text-text-base transition-colors group-hover:text-primary">
                  erik&#64;gmail.com
                </h3>
                <p class="text-sm text-text-muted">erik.sanchez • Admin Universitario</p>
                <div class="mt-1 flex items-center space-x-4 text-xs text-text-muted">
                  <span class="flex items-center space-x-1">
                    <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Hace 3 días</span>
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <span class="admin-status-badge">Activo</span>
              <button class="quick-action-btn secondary">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Footer -->
    <div
      class="mt-8 flex items-center justify-between rounded-2xl border border-border/50 bg-surface/90 p-6 shadow-soft backdrop-blur-sm"
    >
      <div class="flex items-center space-x-2 text-sm text-text-muted">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Mostrando 4 de 4 usuarios</span>
      </div>
      <div class="flex items-center space-x-2">
        <button class="quick-action-btn secondary">Exportar</button>
        <button class="admin-action-btn">Acciones masivas</button>
      </div>
    </div>
  `,
})
export class UsersListComponent {}
