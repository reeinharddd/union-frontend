import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UniversityService } from '@app/core/services/university/university.service';

@Component({
  selector: 'app-universities-list-real',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-text-base">Gestión de Universidades</h1>
          <p class="text-text-muted">Administra las instituciones educativas del sistema</p>
        </div>
        <button
          (click)="navigateToNew()"
          class="rounded-lg bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700"
        >
          <span class="mr-2">+</span>
          Nueva Universidad
        </button>
      </div>

      @if (isLoading()) {
        <div class="flex items-center justify-center py-12">
          <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-primary-600"></div>
          <span class="ml-3 text-text-muted">Cargando universidades...</span>
        </div>
      } @else {
        <!-- Stats Grid -->
        <div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div class="rounded-xl border border-border bg-white p-6 shadow-sm">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10">
                  <svg
                    class="h-6 w-6 text-secondary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-text-muted">Total Universidades</p>
                  <p class="text-2xl font-bold text-text-base">{{ universities().length }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-border bg-white p-6 shadow-sm">
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
                  <p class="text-sm text-text-muted">Activas</p>
                  <p class="text-2xl font-bold text-text-base">{{ getActiveUniversities() }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-border bg-white p-6 shadow-sm">
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
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-2.025"
                    />
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-text-muted">Dominios</p>
                  <p class="text-2xl font-bold text-text-base">{{ universities().length }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-xl border border-border bg-white p-6 shadow-sm">
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
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p class="text-sm text-text-muted">Total</p>
                  <p class="text-2xl font-bold text-text-base">{{ universities().length }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Universities List -->
        <div class="rounded-xl border border-border bg-white shadow-sm">
          <div class="border-b border-border p-6">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold text-text-base">Lista de Universidades</h2>
              <div class="flex items-center space-x-4">
                <div class="relative">
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
                  <input
                    type="text"
                    placeholder="Buscar universidades..."
                    class="rounded-lg border border-border py-2 pl-10 pr-4"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="divide-y divide-border">
            @for (university of universities(); track university.id) {
              <div class="p-6 transition-colors hover:bg-neutral-50">
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4">
                    <div
                      class="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-secondary-400 to-primary-400 font-bold text-white shadow-soft"
                    >
                      {{ getUniversityInitials(university.nombre) }}
                    </div>
                    <div class="flex-1">
                      <h3 class="mb-1 font-semibold text-text-base">{{ university.nombre }}</h3>
                      <div class="flex items-center space-x-4 text-sm text-text-muted">
                        <span class="flex items-center space-x-1">
                          <svg
                            class="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>{{ university.dominio_correo || 'Dominio no configurado' }}</span>
                        </span>
                        <span class="flex items-center space-x-1">
                          <svg
                            class="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span>Ubicación no especificada</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center space-x-3">
                    <span
                      class="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800"
                      >Activa</span
                    >
                    <div class="flex items-center space-x-2">
                      <button
                        (click)="viewUniversity(university.id)"
                        class="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-100"
                      >
                        Ver
                      </button>
                      <button
                        (click)="editUniversity(university.id)"
                        class="rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-100"
                      >
                        Editar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            } @empty {
              <div class="py-12 text-center">
                <div class="mb-4 text-6xl">🏫</div>
                <h3 class="mb-2 text-lg font-medium text-text-base">No hay universidades</h3>
                <p class="mb-4 text-text-muted">Comienza registrando la primera institución</p>
                <button
                  (click)="navigateToNew()"
                  class="rounded-lg bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700"
                >
                  Registrar Universidad
                </button>
              </div>
            }
          </div>

          @if (universities().length > 0) {
            <div class="border-t border-border p-6">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-text-muted"
                    >Mostrando {{ universities().length }} de
                    {{ universities().length }} universidades</span
                  >
                </div>

                <div class="flex items-center space-x-2">
                  <button
                    (click)="exportData()"
                    class="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-text-base hover:bg-neutral-50"
                  >
                    Exportar
                  </button>
                  <button
                    (click)="navigateToNew()"
                    class="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
                  >
                    Nueva Universidad
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class UniversitiesListRealComponent implements OnInit {
  private readonly universityService = inject(UniversityService);
  private readonly router = inject(Router);

  readonly universities = this.universityService.universities;
  readonly isLoading = signal(false);

  ngOnInit(): void {
    this.loadUniversities();
  }

  private loadUniversities(): void {
    this.isLoading.set(true);
    this.universityService.getAll().subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: error => {
        console.error('Error loading universities:', error);
        this.isLoading.set(false);
      },
    });
  }

  getActiveUniversities(): number {
    return this.universities().length; // Asumimos que todas están activas
  }

  getUniversityInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 3);
  }

  viewUniversity(id: number): void {
    this.router.navigate(['/admin/universities', id]);
  }

  editUniversity(id: number): void {
    this.router.navigate(['/admin/universities', id, 'edit']);
  }

  navigateToNew(): void {
    this.router.navigate(['/admin/universities/new']);
  }

  exportData(): void {
    // Implementar exportación de datos
    console.log('Exportando datos de universidades...');
  }
}
