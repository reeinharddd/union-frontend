import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth/auth.service';
import { LayoutConfigService } from '@app/core/services/layout/layout-config.service';

@Component({
  selector: 'app-dynamic-right-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside
      class="flex h-full w-72 flex-col border-l border-gray-100/50 bg-white/95 backdrop-blur-sm"
    >
      <!-- Header del sidebar derecho -->
      <div class="border-b border-gray-100 bg-gradient-to-r from-primary-50/30 to-accent-50/30 p-4">
        <div class="flex items-center space-x-2">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-400 to-accent-400"
          >
            <span class="text-sm font-bold text-white">📊</span>
          </div>
          <div>
            <h3 class="text-sm font-semibold text-gray-900">{{ getRoleTitle() }}</h3>
            <p class="text-xs text-gray-500">Panel de información</p>
          </div>
        </div>
      </div>

      <!-- Contenido dinámico del sidebar -->
      <div class="flex-1 space-y-6 overflow-y-auto p-4">
        @for (section of rightSidebarSections(); track section.title) {
          <div class="space-y-3 rounded-lg bg-gray-50/50 p-4">
            <!-- Título de la sección -->
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-semibold text-gray-700">{{ section.title }}</h4>
            </div>

            <!-- Contenido según el tipo de sección -->
            @switch (section.type) {
              @case ('welcome') {
                <div class="space-y-2 text-center">
                  <p class="text-xs text-gray-600">{{ currentTime() }}</p>
                  <p class="text-sm font-medium text-gray-800">{{ getGreeting() }}</p>
                  @if (section.content?.message) {
                    <p class="text-xs text-gray-600">{{ section.content?.message }}</p>
                  }
                </div>
              }

              @case ('quick-actions') {
                @if (section.items) {
                  <div class="space-y-2">
                    @for (item of section.items; track item.label) {
                      <a
                        [routerLink]="item.route"
                        class="group flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-white/80"
                      >
                        <div class="flex items-center space-x-2">
                          <span class="material-icons text-sm" [class]="item.color">{{
                            item.icon
                          }}</span>
                          <span class="text-xs font-medium text-gray-800">{{ item.label }}</span>
                        </div>
                        @if (item.badge) {
                          <span
                            class="rounded-full px-2 py-0.5 text-xs font-medium"
                            [class]="item.badge.color"
                          >
                            {{ item.badge.text }}
                          </span>
                        }
                      </a>
                    }
                  </div>
                }
              }

              @case ('stats') {
                @if (section.content && section.content.stats && section.content.stats.length > 0) {
                  <div class="grid grid-cols-1 gap-2">
                    @for (stat of section.content.stats; track stat.label) {
                      <div class="rounded-md bg-white/60 p-2 text-center">
                        <p class="text-lg font-bold" [class]="stat.color">{{ stat.value }}</p>
                        <p class="text-xs text-gray-600">{{ stat.label }}</p>
                      </div>
                    }
                  </div>
                }
              }

              @case ('activity') {
                @if (
                  section.content &&
                  section.content.activities &&
                  section.content.activities.length > 0
                ) {
                  <div class="space-y-2">
                    @for (activity of section.content.activities; track activity.text) {
                      <div class="rounded-md bg-white/60 p-2">
                        <p class="text-xs font-medium text-gray-800">{{ activity.text }}</p>
                        <p class="text-xs text-gray-500">{{ activity.time }}</p>
                      </div>
                    }
                  </div>
                } @else if (section.items) {
                  <div class="space-y-2">
                    @for (item of section.items; track item.label) {
                      <a
                        [routerLink]="item.route"
                        class="group flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-white/80"
                      >
                        <div class="flex items-center space-x-2">
                          <span class="material-icons text-sm" [class]="item.color">{{
                            item.icon
                          }}</span>
                          <div>
                            <p class="text-xs font-medium text-gray-800">{{ item.label }}</p>
                            @if (item.description) {
                              <p class="text-xs text-gray-500">{{ item.description }}</p>
                            }
                          </div>
                        </div>
                      </a>
                    }
                  </div>
                }
              }

              @case ('projects') {
                @if (section.items) {
                  <div class="space-y-2">
                    @for (item of section.items; track item.label) {
                      <a
                        [routerLink]="item.route"
                        class="block cursor-pointer rounded-md p-2 transition-colors hover:bg-white/80"
                      >
                        <div class="mb-1 flex items-center justify-between">
                          <div class="flex items-center space-x-2">
                            <span class="material-icons text-sm" [class]="item.color">{{
                              item.icon
                            }}</span>
                            <span class="text-xs font-medium text-gray-800">{{ item.label }}</span>
                          </div>
                          @if (item.badge) {
                            <span
                              class="rounded-full px-2 py-0.5 text-xs font-medium"
                              [class]="item.badge.color"
                            >
                              {{ item.badge.text }}
                            </span>
                          }
                        </div>
                        @if (item.description) {
                          <p class="ml-6 text-xs text-gray-500">{{ item.description }}</p>
                        }
                      </a>
                    }
                  </div>
                }
              }

              @case ('events') {
                @if (section.items) {
                  <div class="space-y-2">
                    @for (item of section.items; track item.label) {
                      <a
                        [routerLink]="item.route"
                        class="block cursor-pointer rounded-md p-2 transition-colors hover:bg-white/80"
                      >
                        <div class="mb-1 flex items-center space-x-2">
                          <span class="material-icons text-sm" [class]="item.color">{{
                            item.icon
                          }}</span>
                          <span class="text-xs font-medium text-gray-800">{{ item.label }}</span>
                        </div>
                        @if (item.description) {
                          <p class="ml-6 text-xs text-gray-500">{{ item.description }}</p>
                        }
                      </a>
                    }
                  </div>
                }
              }

              @case ('notifications') {
                @if (
                  section.content &&
                  section.content.notifications &&
                  section.content.notifications.length > 0
                ) {
                  <div class="space-y-2">
                    @for (notification of section.content.notifications; track notification.text) {
                      <div class="rounded-md border-l-2 border-accent-400 bg-white/60 p-2">
                        <p class="text-xs font-medium text-gray-800">{{ notification.text }}</p>
                        <p class="text-xs text-gray-500">{{ notification.time }}</p>
                      </div>
                    }
                  </div>
                }
              }
            }
          </div>
        }
      </div>

      <!-- Footer con información del usuario -->
      <div class="border-t border-gray-100 bg-gray-50/50 p-4">
        <div class="flex items-center space-x-3">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-accent-400"
          >
            <span class="text-xs font-bold text-white">
              {{ currentUser()?.nombre?.charAt(0) || 'U' }}
            </span>
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-xs font-medium text-gray-900">
              {{ currentUser()?.nombre || 'Usuario' }}
            </p>
            <p class="truncate text-xs text-gray-500">
              {{ getRoleTitle() }}
            </p>
          </div>
        </div>
      </div>
    </aside>
  `,
})
export class DynamicRightSidebarComponent {
  private layoutConfigService = inject(LayoutConfigService);
  private authService = inject(AuthService);

  rightSidebarSections = computed(() => this.layoutConfigService.getRightSidebarSections());
  currentUser = computed(() => this.authService.currentUser());
  currentTime = computed(() =>
    new Date().toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  );

  getRoleTitle(): string {
    const user = this.currentUser();
    if (!user) return 'Usuario';

    switch (user.rol_id) {
      case 1:
        return 'Super Administrador';
      case 2:
        return 'Estudiante';
      case 3:
        return 'Admin Universitario';
      case 4:
        return 'Promotor';
      default:
        return 'Usuario';
    }
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }
}
