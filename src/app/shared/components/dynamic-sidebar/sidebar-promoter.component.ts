import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@app/core/services/auth/auth.service';
import {
  NavigationItem,
  NavigationService,
} from '@app/core/services/navigation/navigation.service';

@Component({
  selector: 'app-promoter-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="flex h-full w-full flex-col border-r border-border bg-white p-4">
      <div class="border-b border-gray-100 bg-gradient-to-br from-primary-50/50 to-accent-50/50 p-4">
        <div class="flex items-center space-x-3">
          <div class="relative">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 font-bold text-white shadow-sm"
            >
              {{ getUserInitials() }}
            </div>
            <div
              class="bg-green-500 absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white"
            ></div>
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-gray-900 truncate text-sm font-semibold">{{ getUserName() }}</p>
            <p class="text-gray-500 truncate text-xs">{{ getUserEmail() }}</p>
            <span
              class="mt-1 inline-block rounded-md bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700"
            >
              {{ getRoleDisplayName() }}
            </span>
          </div>
        </div>
      </div>

      <nav class="flex-1 space-y-1 overflow-y-auto p-3">
        <a
          routerLink="/promoter/dashboard"
          routerLinkActive="bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700 border-primary-200 shadow-sm font-medium"
          class="hover:bg-gray-50 text-gray-700 group flex w-full items-center space-x-3 rounded-lg border border-transparent px-3 py-2.5 text-sm transition-all duration-200 hover:text-primary-600"
        >
          <i class="material-icons text-base transition-transform duration-200 group-hover:scale-105 text-blue-500">dashboard</i>
          <span class="font-medium">Dashboard</span>
        </a>
        <a
          routerLink="/promoter/opportunities"
          routerLinkActive="bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700 border-primary-200 shadow-sm font-medium"
          class="hover:bg-gray-50 text-gray-700 group flex w-full items-center space-x-3 rounded-lg border border-transparent px-3 py-2.5 text-sm transition-all duration-200 hover:text-primary-600"
        >
          <i class="material-icons text-base transition-transform duration-200 group-hover:scale-105 text-green-500">work</i>
          <span class="font-medium">Oportunidades</span>
        </a>
        <a
          routerLink="/promoter/clients"
          routerLinkActive="bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700 border-primary-200 shadow-sm font-medium"
          class="hover:bg-gray-50 text-gray-700 group flex w-full items-center space-x-3 rounded-lg border border-transparent px-3 py-2.5 text-sm transition-all duration-200 hover:text-primary-600"
        >
          <i class="material-icons text-base transition-transform duration-200 group-hover:scale-105 text-purple-500">people</i>
          <span class="font-medium">Clientes</span>
        </a>
        <a
          routerLink="/promoter/settings"
          routerLinkActive="bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700 border-primary-200 shadow-sm font-medium"
          class="hover:bg-gray-50 text-gray-700 group flex w-full items-center space-x-3 rounded-lg border border-transparent px-3 py-2.5 text-sm transition-all duration-200 hover:text-primary-600"
        >
          <i class="material-icons text-base transition-transform duration-200 group-hover:scale-105 text-gray-500">settings</i>
          <span class="font-medium">Configuración</span>
        </a>
      </nav>

      <!-- Footer del sidebar -->
      <div class="border-gray-50 bg-gray-50/30 border-t p-3">
        <div class="space-y-1">
          <!-- Acceso rápido a perfil -->
          <a
            routerLink="/promoter/profile"
            class="text-gray-600 group flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 hover:bg-primary-50 hover:text-primary-600"
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

          <!-- Cerrar sesión -->
          <button
            (click)="logout()"
            class="hover:bg-red-50 hover:text-red-600 text-gray-600 group flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-all duration-200"
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
export class PromoterSidebarComponent {
  showDropdown = false;
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

  getUserName(): string {
    const user = this.currentUser();
    return user?.nombre || 'Usuario';
  }

  getUserEmail(): string {
    const user = this.currentUser();
    return user?.correo || 'email@ejemplo.com';
  }

  private getRoleName(role: number | undefined): string {
    const roleNames = {
      1: 'Administrador',
      2: 'Estudiante',
      3: 'Promotor',
      9: 'Admin Universitario',
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
