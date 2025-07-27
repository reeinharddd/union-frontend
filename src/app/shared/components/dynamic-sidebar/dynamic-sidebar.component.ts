import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@app/core/services/auth/auth.service';
import {
  NavigationItem,
  NavigationService,
} from '@app/core/services/navigation/navigation.service';

@Component({
  selector: 'app-dynamic-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="flex h-full flex-col overflow-y-auto border-r border-border bg-surface">
      <!-- Header con información del usuario -->
      <div class="border-b border-border p-6">
        <div class="flex items-center space-x-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100">
            <span class="text-sm font-semibold text-primary-600">
              {{ getUserInitials() }}
            </span>
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-text-base">
              {{ currentUser()?.nombre || currentUser()?.correo }}
            </p>
            <p class="text-xs capitalize text-text-muted">
              {{ getRoleDisplayName() }}
            </p>
          </div>
        </div>
      </div>

      <!-- Navegación principal -->
      <nav class="flex-1 space-y-2 px-4 py-4">
        @for (item of navigation(); track item.route) {
          <div class="navigation-group">
            <!-- Item principal -->
            <a
              [routerLink]="item.route"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: false }"
              class="nav-item group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-neutral-100"
              [class.active]="isActiveRoute(item.route)"
              (click)="toggleSubmenu(item)"
            >
              <div class="flex items-center space-x-3">
                <i
                  [class]="'icon-' + item.icon"
                  class="h-5 w-5 text-neutral-500 group-hover:text-primary-600"
                ></i>
                <span class="text-neutral-700 group-hover:text-neutral-900">{{ item.label }}</span>
              </div>

              <div class="flex items-center space-x-2">
                @if (item.badge) {
                  <span
                    class="rounded-full bg-accent-100 px-2 py-0.5 text-xs font-medium text-accent-700"
                  >
                    {{ item.badge }}
                  </span>
                }
                @if (item.children && item.children.length > 0) {
                  <i
                    class="h-4 w-4 text-neutral-400 transition-transform duration-200"
                    [class.rotate-90]="expandedMenus().has(item.route)"
                    >→</i
                  >
                }
              </div>
            </a>

            <!-- Submenú -->
            @if (item.children && expandedMenus().has(item.route)) {
              <div class="ml-8 mt-1 animate-slide-in space-y-1">
                @for (child of item.children; track child.route) {
                  <a
                    [routerLink]="child.route"
                    routerLinkActive="active-child"
                    class="nav-child-item flex items-center space-x-3 rounded-md px-3 py-2 text-sm text-neutral-600 transition-colors duration-200 hover:bg-neutral-50 hover:text-neutral-900"
                  >
                    <i [class]="'icon-' + child.icon" class="h-4 w-4"></i>
                    <span>{{ child.label }}</span>
                  </a>
                }
              </div>
            }
          </div>
        }
      </nav>

      <!-- Footer con acciones -->
      <div class="border-t border-border p-4">
        <button
          (click)="logout()"
          class="flex w-full items-center justify-center space-x-2 rounded-lg bg-neutral-50 px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors duration-200 hover:bg-neutral-100"
        >
          <i class="icon-log-out h-4 w-4"></i>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  `,
  styles: [
    `
      .nav-item.active {
        @apply border-primary-200 bg-primary-50 text-primary-700;
      }

      .nav-item.active i {
        @apply text-primary-600;
      }

      .nav-child-item.active-child {
        @apply bg-primary-50 text-primary-700;
      }

      .navigation-group {
        @apply relative;
      }

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

      /* Iconos simples usando CSS */
      .icon-home::before {
        content: '🏠';
      }
      .icon-users::before {
        content: '👥';
      }
      .icon-building::before {
        content: '🏢';
      }
      .icon-calendar::before {
        content: '📅';
      }
      .icon-briefcase::before {
        content: '💼';
      }
      .icon-message-circle::before {
        content: '💬';
      }
      .icon-shopping-cart::before {
        content: '🛒';
      }
      .icon-bar-chart::before {
        content: '📊';
      }
      .icon-settings::before {
        content: '⚙️';
      }
      .icon-graduation-cap::before {
        content: '🎓';
      }
      .icon-book::before {
        content: '📚';
      }
      .icon-award::before {
        content: '🏆';
      }
      .icon-folder::before {
        content: '📁';
      }
      .icon-user::before {
        content: '👤';
      }
      .icon-list::before {
        content: '📋';
      }
      .icon-plus::before {
        content: '➕';
      }
      .icon-user-plus::before {
        content: '👤➕';
      }
      .icon-shield::before {
        content: '🛡️';
      }
      .icon-check-circle::before {
        content: '✅';
      }
      .icon-package::before {
        content: '📦';
      }
      .icon-shopping-bag::before {
        content: '🛍️';
      }
      .icon-file-text::before {
        content: '📄';
      }
      .icon-megaphone::before {
        content: '📢';
      }
      .icon-target::before {
        content: '🎯';
      }
      .icon-trending-up::before {
        content: '📈';
      }
      .icon-eye::before {
        content: '👁️';
      }
      .icon-clock::before {
        content: '🕐';
      }
      .icon-bookmark::before {
        content: '🔖';
      }
      .icon-log-out::before {
        content: '🚪';
      }
    `,
  ],
})
export class DynamicSidebarComponent {
  private readonly navigationService = inject(NavigationService);
  private readonly authService = inject(AuthService);

  readonly navigation = this.navigationService.currentNavigation;
  readonly currentUser = this.authService.currentUser;

  private expandedMenusSignal = signal<Set<string>>(new Set());
  readonly expandedMenus = this.expandedMenusSignal.asReadonly();

  toggleSubmenu(item: NavigationItem): void {
    if (!item.children?.length) return;

    const expanded = this.expandedMenusSignal();
    const newExpanded = new Set(expanded);

    if (newExpanded.has(item.route)) {
      newExpanded.delete(item.route);
    } else {
      newExpanded.add(item.route);
    }

    this.expandedMenusSignal.set(newExpanded);
  }

  isActiveRoute(route: string): boolean {
    return window.location.pathname.startsWith(route);
  }

  getUserInitials(): string {
    const user = this.currentUser();
    if (user?.nombre) {
      return user.nombre
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.correo?.slice(0, 2).toUpperCase() || 'US';
  }

  private getRoleName(role: number | undefined): string {
    const roleNames = {
      1: 'Administrador',
      2: 'Estudiante',
      3: 'Profesor',
      9: 'Admin Universitario'
    };

    return role ? roleNames[role as keyof typeof roleNames] || 'Usuario' : 'Usuario';
  }

  getRoleDisplayName(): string {
    const role = this.authService.userRole();
    return this.getRoleName(role);
  }

  logout(): void {
    this.authService.logout();
  }
}
