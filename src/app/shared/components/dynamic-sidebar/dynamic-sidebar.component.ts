import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavigationService, NavigationItem } from '@app/core/services/navigation/navigation.service';
import { AuthService } from '@app/core/services/auth/auth.service';

@Component({
  selector: 'app-dynamic-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside class="flex h-full flex-col overflow-y-auto bg-surface border-r border-border">
      <!-- Header con información del usuario -->
      <div class="p-6 border-b border-border">
        <div class="flex items-center space-x-3">
          <div class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
            <span class="text-primary-600 font-semibold text-sm">
              {{ getUserInitials() }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-text-base truncate">
              {{ currentUser()?.name || currentUser()?.email }}
            </p>
            <p class="text-xs text-text-muted capitalize">
              {{ getRoleDisplayName() }}
            </p>
          </div>
        </div>
      </div>

      <!-- Navegación principal -->
      <nav class="flex-1 px-4 py-4 space-y-2">
        @for (item of navigation(); track item.route) {
          <div class="navigation-group">
            <!-- Item principal -->
            <a
              [routerLink]="item.route"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: false }"
              class="nav-item group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-neutral-100"
              [class.active]="isActiveRoute(item.route)"
              (click)="toggleSubmenu(item)"
            >
              <div class="flex items-center space-x-3">
                <i [class]="'icon-' + item.icon" class="h-5 w-5 text-neutral-500 group-hover:text-primary-600"></i>
                <span class="text-neutral-700 group-hover:text-neutral-900">{{ item.label }}</span>
              </div>
              
              <div class="flex items-center space-x-2">
                @if (item.badge) {
                  <span class="px-2 py-0.5 text-xs font-medium bg-accent-100 text-accent-700 rounded-full">
                    {{ item.badge }}
                  </span>
                }
                @if (item.children && item.children.length > 0) {
                  <i 
                    class="h-4 w-4 text-neutral-400 transition-transform duration-200"
                    [class.rotate-90]="expandedMenus().has(item.route)"
                  >→</i>
                }
              </div>
            </a>

            <!-- Submenú -->
            @if (item.children && expandedMenus().has(item.route)) {
              <div class="ml-8 mt-1 space-y-1 animate-slide-in">
                @for (child of item.children; track child.route) {
                  <a
                    [routerLink]="child.route"
                    routerLinkActive="active-child"
                    class="nav-child-item flex items-center space-x-3 px-3 py-2 text-sm text-neutral-600 rounded-md hover:bg-neutral-50 hover:text-neutral-900 transition-colors duration-200"
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
      <div class="p-4 border-t border-border">
        <button
          (click)="logout()"
          class="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-sm font-medium text-neutral-700 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors duration-200"
        >
          <i class="icon-log-out h-4 w-4"></i>
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .nav-item.active {
      @apply bg-primary-50 text-primary-700 border-primary-200;
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
    .icon-home::before { content: '🏠'; }
    .icon-users::before { content: '👥'; }
    .icon-building::before { content: '🏢'; }
    .icon-calendar::before { content: '📅'; }
    .icon-briefcase::before { content: '💼'; }
    .icon-message-circle::before { content: '💬'; }
    .icon-shopping-cart::before { content: '🛒'; }
    .icon-bar-chart::before { content: '📊'; }
    .icon-settings::before { content: '⚙️'; }
    .icon-graduation-cap::before { content: '🎓'; }
    .icon-book::before { content: '📚'; }
    .icon-award::before { content: '🏆'; }
    .icon-folder::before { content: '📁'; }
    .icon-user::before { content: '👤'; }
    .icon-list::before { content: '📋'; }
    .icon-plus::before { content: '➕'; }
    .icon-user-plus::before { content: '👤➕'; }
    .icon-shield::before { content: '🛡️'; }
    .icon-check-circle::before { content: '✅'; }
    .icon-package::before { content: '📦'; }
    .icon-shopping-bag::before { content: '🛍️'; }
    .icon-file-text::before { content: '📄'; }
    .icon-megaphone::before { content: '📢'; }
    .icon-target::before { content: '🎯'; }
    .icon-trending-up::before { content: '📈'; }
    .icon-eye::before { content: '👁️'; }
    .icon-clock::before { content: '🕐'; }
    .icon-bookmark::before { content: '🔖'; }
    .icon-log-out::before { content: '🚪'; }
  `]
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
    if (user?.name) {
      return user.name.split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.slice(0, 2).toUpperCase() || 'US';
  }

  getRoleDisplayName(): string {
    const role = this.authService.userRole();
    const roleNames = {
      'ADMIN': 'Administrador',
      'ADMIN_UNI': 'Admin Universitario',
      'PROMOTER': 'Promotor',
      'USER': 'Estudiante'
    };
    return roleNames[role as keyof typeof roleNames] || 'Usuario';
  }

  logout(): void {
    this.authService.logout();
  }
}