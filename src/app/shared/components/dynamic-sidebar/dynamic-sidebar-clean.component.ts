import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@app/core/services/auth/auth.service';
import { LayoutConfigService, SidebarItem } from '@app/core/services/layout/layout-config.service';

@Component({
  selector: 'app-dynamic-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Sidebar UniON - Compacto y Elegante -->
    <aside
      class="flex h-full w-56 flex-col border-r border-gray-100/50 bg-white/95 backdrop-blur-sm"
    >
      <!-- Header del sidebar con info del usuario -->
      <div
        class="border-b border-gray-100 bg-gradient-to-br from-primary-50/50 to-accent-50/50 p-4"
      >
        <div class="flex items-center space-x-3">
          <div class="relative">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 font-bold text-white shadow-sm"
            >
              {{ getUserInitials() }}
            </div>
            <div
              class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-500"
            ></div>
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold text-gray-900">{{ getUserName() }}</p>
            <p class="truncate text-xs text-gray-500">{{ getUserEmail() }}</p>
            <span
              class="mt-1 inline-block rounded-md bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700"
            >
              {{ getRoleDisplayName() }}
            </span>
          </div>
        </div>
      </div>

      <!-- Navegación principal -->
      <nav class="flex-1 space-y-1 overflow-y-auto p-3">
        @for (item of sidebarItems(); track item.label) {
          <div class="nav-group">
            <!-- Item principal -->
            <div class="relative">
              <a
                [routerLink]="item.route"
                routerLinkActive="bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700 border-primary-200 shadow-sm font-medium"
                class="group flex w-full items-center justify-between rounded-lg border border-transparent px-3 py-2.5 text-sm text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:text-primary-600"
                [class.cursor-pointer]="!item.children"
                (click)="item.children ? toggleSubmenu(item) : null"
              >
                <div class="flex items-center space-x-3">
                  <span class="text-base transition-transform duration-200 group-hover:scale-105">{{
                    item.icon
                  }}</span>
                  <span class="font-medium">{{ item.label }}</span>
                  @if (item.badge && item.badge > 0) {
                    <span
                      class="min-w-[18px] animate-pulse rounded-full bg-accent-500 px-1.5 py-0.5 text-center text-xs font-medium text-white"
                    >
                      {{ item.badge }}
                    </span>
                  }
                </div>

                @if (item.children) {
                  <svg
                    class="h-4 w-4 text-gray-400 transition-all duration-200 group-hover:text-primary-500"
                    [class.rotate-90]="isSubmenuOpen(item)"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                }
              </a>
            </div>

            <!-- Submenu items -->
            @if (item.children && isSubmenuOpen(item)) {
              <div class="ml-4 mt-1 animate-slide-in space-y-1">
                @for (child of item.children; track child.label) {
                  <a
                    [routerLink]="child.route"
                    routerLinkActive="bg-primary-50 text-primary-600 border-l-3 border-primary-500 font-medium"
                    class="border-l-3 group flex items-center justify-between rounded-md border-transparent px-3 py-2 text-sm text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:text-primary-600"
                  >
                    <div class="flex items-center space-x-3">
                      <span class="text-sm transition-transform group-hover:scale-105">{{
                        child.icon
                      }}</span>
                      <span>{{ child.label }}</span>
                    </div>
                    @if (child.badge && child.badge > 0) {
                      <span
                        class="min-w-[16px] rounded-full bg-accent-500 px-1.5 py-0.5 text-center text-xs font-medium text-white"
                      >
                        {{ child.badge }}
                      </span>
                    }
                  </a>
                }
              </div>
            }
          </div>
        }
      </nav>

      <!-- Footer del sidebar -->
      <div class="border-t border-gray-50 bg-gray-50/30 p-3">
        <div class="space-y-1">
          <!-- Acceso rápido a perfil -->
          <a
            [routerLink]="getProfileRoute()"
            class="group flex items-center space-x-3 rounded-lg px-3 py-2 text-sm text-gray-600 transition-all duration-200 hover:bg-primary-50 hover:text-primary-600"
          >
            <svg
              class="h-4 w-4 transition-transform group-hover:scale-105"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span class="font-medium">Mi Perfil</span>
          </a>

          <!-- Configuración -->
          <a
            [routerLink]="getSettingsRoute()"
            class="group flex items-center space-x-3 rounded-lg px-3 py-2 text-sm text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:text-gray-700"
          >
            <svg
              class="h-4 w-4 transition-transform group-hover:scale-105"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span class="font-medium">Configuración</span>
          </a>

          <!-- Cerrar sesión -->
          <button
            (click)="logout()"
            class="group flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm text-gray-600 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
          >
            <svg
              class="h-4 w-4 transition-transform group-hover:scale-105"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span class="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </aside>
  `,
  styles: [
    `
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-slide-in {
        animation: slideIn 0.2s ease-out;
      }

      .nav-group:hover .group svg {
        transform: scale(1.05);
      }

      .border-l-3 {
        border-left-width: 3px;
      }
    `,
  ],
})
export class DynamicSidebarComponent {
  private readonly authService = inject(AuthService);
  private readonly layoutConfigService = inject(LayoutConfigService);

  // Estados locales
  private openSubmenus = signal<Set<string>>(new Set());

  // Items del sidebar basados en el rol actual
  sidebarItems = computed(() => {
    const config = this.layoutConfigService.getCurrentLayoutConfig();
    return config.leftSidebarItems.filter(item => this.hasPermission(item));
  });

  // Control de submenús
  toggleSubmenu(item: SidebarItem) {
    const currentOpen = this.openSubmenus();
    const newOpen = new Set(currentOpen);

    if (newOpen.has(item.label)) {
      newOpen.delete(item.label);
    } else {
      newOpen.add(item.label);
    }

    this.openSubmenus.set(newOpen);
  }

  isSubmenuOpen(item: SidebarItem): boolean {
    return this.openSubmenus().has(item.label);
  }

  // Información del usuario
  getUserInitials(): string {
    const user = this.authService.getCurrentUser();
    if (!user?.name) return 'UN';

    const names = user.name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0].substring(0, 2).toUpperCase();
  }

  getUserName(): string {
    const user = this.authService.getCurrentUser();
    return user?.name || 'Usuario';
  }

  getUserEmail(): string {
    const user = this.authService.getCurrentUser();
    return user?.email || 'email@ejemplo.com';
  }

  getRoleDisplayName(): string {
    const user = this.authService.getCurrentUser();
    const roleNames: { [key: number]: string } = {
      1: 'Administrador',
      2: 'Estudiante',
      3: 'Admin Universitario',
      4: 'Promotor',
    };
    return roleNames[user?.roleId || 2] || 'Usuario';
  }

  // Rutas
  getProfileRoute(): string {
    const role = this.layoutConfigService.getCurrentUserRole();
    const routes: { [key: string]: string } = {
      admin: '/admin/profile',
      student: '/student/profile',
      university_admin: '/admin-uni/profile',
      promoter: '/promoter/profile',
    };
    return routes[role] || '/student/profile';
  }

  getSettingsRoute(): string {
    const role = this.layoutConfigService.getCurrentUserRole();
    const routes: { [key: string]: string } = {
      admin: '/admin/settings',
      student: '/student/settings',
      university_admin: '/admin-uni/settings',
      promoter: '/promoter/settings',
    };
    return routes[role] || '/student/settings';
  }

  // Permisos
  hasPermission(item: SidebarItem): boolean {
    return this.layoutConfigService.hasPermission(item);
  }

  // Acciones
  logout() {
    this.authService.logout();
  }
}
