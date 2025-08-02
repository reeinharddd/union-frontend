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

      <nav class="flex flex-col space-y-2">
        <a
          routerLink="/promoter/dashboard"
          routerLinkActive="bg-primary text-white"
          class="rounded px-4 py-2 transition hover:bg-primary/10"
        >
          🏠 Dashboard
        </a>
        <a
          routerLink="/promoter/opportunities"
          routerLinkActive="bg-primary text-white"
          class="rounded px-4 py-2 transition hover:bg-primary/10"
        >
          📁 Oportunidades
        </a>
        <a
          routerLink="/promoter/clients"
          routerLinkActive="bg-primary text-white"
          class="rounded px-4 py-2 transition hover:bg-primary/10"
        >
          👥 Clientes
        </a>
        <a
          routerLink="/promoter/settings"
          routerLinkActive="bg-primary text-white"
          class="rounded px-4 py-2 transition hover:bg-primary/10"
        >
          ⚙️ Configuración
        </a>
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

  private getRoleName(role: number | undefined): string {
    const roleNames = {
      1: 'Administrador',
      2: 'Estudiante',
      3: 'Profesor',
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
