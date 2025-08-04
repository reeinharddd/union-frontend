import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth/auth.service';
import { LayoutConfigService } from '@app/core/services/layout/layout-config.service';

@Component({
  selector: 'app-dynamic-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dynamic-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicHeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly layoutConfigService = inject(LayoutConfigService);
  private readonly router = inject(Router);

  // Estados locales para UI
  showUserMenu = signal(false);
  showMobileMenu = signal(false);

  // Rol actual del usuario
  currentRole = signal(this.layoutConfigService.getCurrentUserRole());

  // Navegación contextual por rol
  getContextualNavigation() {
    const role = this.currentRole();

    switch(role) {
      case 'admin':
        return [
          { label: 'Dashboard', link: '/admin/dashboard', icon: '📊', active: false, badge: 0 },
          { label: 'Usuarios', link: '/admin/users', icon: '👥', active: false, badge: this.layoutConfigService.getBadgeCount('pending-users') },
          { label: 'Universidades', link: '/admin/universities', icon: '🏢', active: false, badge: 0 },
          { label: 'Reportes', link: '/admin/reports', icon: '📋', active: false, badge: this.layoutConfigService.getBadgeCount('pending-reports') }
        ];

      case 'student':
        return [
          { label: 'Inicio', link: '/student/dashboard', icon: '🏠', active: false, badge: 0 },
          { label: 'Foros', link: '/student/forums', icon: '💬', active: false, badge: 0 },
          { label: 'Proyectos', link: '/student/projects', icon: '📁', active: false, badge: 0 },
          { label: 'Oportunidades', link: '/student/opportunities', icon: '🎯', active: false, badge: this.layoutConfigService.getBadgeCount('new-opportunities') },
          { label: 'Eventos', link: '/student/events', icon: '📅', active: false, badge: this.layoutConfigService.getBadgeCount('upcoming-events') }
        ];

      case 'university_admin':
        return [
          { label: 'Dashboard', link: '/admin-uni/dashboard', icon: '📊', active: false, badge: 0 },
          { label: 'Estudiantes', link: '/admin-uni/students', icon: '🎓', active: false, badge: 0 },
          { label: 'Proyectos', link: '/admin-uni/projects', icon: '📁', active: false, badge: this.layoutConfigService.getBadgeCount('projects-review') },
          { label: 'Eventos', link: '/admin-uni/events', icon: '📅', active: false, badge: 0 }
        ];

      case 'promoter':
        return [
          { label: 'Dashboard', link: '/promoter/dashboard', icon: '📊', active: false, badge: 0 },
          { label: 'Ofertas', link: '/promoter/jobs', icon: '💼', active: false, badge: 0 },
          { label: 'Candidatos', link: '/promoter/candidates', icon: '👥', active: false, badge: this.layoutConfigService.getBadgeCount('new-applications') }
        ];

      default:
        return [];
    }
  }

  // Acciones rápidas por rol
  getQuickActions() {
    const role = this.currentRole();

    switch(role) {
      case 'admin':
        return [
          { label: 'Nuevo Usuario', link: '/admin/users/create', icon: '➕' }
        ];

      case 'student':
        return [
          { label: 'Nuevo Proyecto', link: '/student/projects/create', icon: '📁' }
        ];

      case 'university_admin':
        return [
          { label: 'Nuevo Evento', link: '/admin-uni/events/create', icon: '📅' }
        ];

      case 'promoter':
        return [
          { label: 'Nueva Oferta', link: '/promoter/jobs/create', icon: '💼' }
        ];

      default:
        return [];
    }
  }

  // Menú items del usuario
  getUserMenuItems() {
    const role = this.currentRole();
    const baseItems = [
      { label: 'Mi Perfil', link: `/${role}/profile`, icon: '👤' },
      { label: 'Configuración', link: `/${role}/settings`, icon: '⚙️' }
    ];

    // Items específicos por rol
    switch(role) {
      case 'student':
        return [
          ...baseItems,
          { label: 'Mis Proyectos', link: '/student/projects/my', icon: '📁' },
          { label: 'Mis Postulaciones', link: '/student/applications', icon: '📤' },
          { label: 'Historial Académico', link: '/student/academic-history', icon: '🎓' }
        ];

      case 'university_admin':
        return [
          ...baseItems,
          { label: 'Mi Universidad', link: '/admin-uni/university', icon: '🏢' },
          { label: 'Configuración Institucional', link: '/admin-uni/institution-settings', icon: '⚙️' }
        ];

      case 'promoter':
        return [
          ...baseItems,
          { label: 'Mi Empresa', link: '/promoter/company', icon: '🏢' },
          { label: 'Plan de Suscripción', link: '/promoter/subscription', icon: '💎' }
        ];

      case 'admin':
        return [
          ...baseItems,
          { label: 'Configuración del Sistema', link: '/admin/system-config', icon: '🔧' },
          { label: 'Logs del Sistema', link: '/admin/logs', icon: '📋' }
        ];

      default:
        return baseItems;
    }
  }

  // Control de menús
  toggleUserMenu() {
    this.showUserMenu.set(!this.showUserMenu());
    this.showMobileMenu.set(false);
  }

  closeUserMenu() {
    this.showUserMenu.set(false);
  }

  toggleMobileMenu() {
    this.showMobileMenu.set(!this.showMobileMenu());
    this.showUserMenu.set(false);
  }

  closeMobileMenu() {
    this.showMobileMenu.set(false);
  }

  // Información del usuario
  getUserInitials(): string {
    const user = this.authService.currentUser();
    if (user?.nombre) {
      return user.nombre.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    }
    return 'U';
  }

  getUserName(): string {
    const user = this.authService.currentUser();
    return user?.nombre || 'Usuario';
  }

  getUserEmail(): string {
    const user = this.authService.currentUser();
    return user?.correo || '';
  }

  getRoleDisplayName(): string {
    const role = this.currentRole();
    const roleNames = {
      'admin': 'Administrador',
      'student': 'Estudiante',
      'university_admin': 'Admin Universidad',
      'promoter': 'Promotor',
      'public': 'Público'
    };
    return roleNames[role as keyof typeof roleNames] || 'Usuario';
  }

  // Contadores de badges
  getNotificationCount(): number {
    return this.layoutConfigService.getBadgeCount('notifications');
  }

  getMessageCount(): number {
    return this.layoutConfigService.getBadgeCount('messages');
  }

  // Logout
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.closeUserMenu();
  }
}
