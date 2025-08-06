import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth/auth.service';
import { LayoutConfigService, SidebarItem } from '@app/core/services/layout/layout-config.service';

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

  constructor() {
    // Efecto para actualizar el rol cuando cambie el estado de autenticación
    effect(
      () => {
        const user = this.authService.currentUser();
        if (user) {
          const newRole = this.layoutConfigService.getCurrentUserRole();
          this.currentRole.set(newRole);
          console.log('🔄 DynamicHeader - Role updated:', newRole);
        }
      },
      { allowSignalWrites: true },
    );
  }

  // Navegación contextual por rol
  getContextualNavigation() {
    const config = this.layoutConfigService.getCurrentLayoutConfig();

    // Filtra y retorna navegación específica para el header
    const items = (config.leftSidebar as SidebarItem[]).slice(0, 6).map(item => ({
      label: item.label,
      link: item.route || '', // Proporcionar valor por defecto
      icon: item.icon,
      active: this.isActiveRoute(item.route || ''), // Proporcionar valor por defecto
      badge: item.badge ? item.badge.text : '0',
      hasDropdown: !!(item.children && item.children.length > 0),
      children: item.children?.slice(0, 3) || [],
    }));

    return items;
  }

  // Acciones rápidas por rol
  getQuickActions() {
    const role = this.currentRole();

    const actions = {
      admin: [
        { label: 'Nuevo Usuario', link: '/admin/users/new', icon: '👤', color: 'primary' },
        {
          label: 'Nueva Universidad',
          link: '/admin/universities/new',
          icon: '🏛️',
          color: 'secondary',
        },
        { label: 'Respaldo', link: '/admin/backups', icon: '💾', color: 'accent' },
      ],
      student: [
        { label: 'Nuevo Proyecto', link: '/student/projects/new', icon: '🚀', color: 'primary' },
        { label: 'Unirse a Evento', link: '/student/events', icon: '📅', color: 'secondary' },
        { label: 'Explorar Foros', link: '/student/forums', icon: '💬', color: 'accent' },
      ],
      university_admin: [
        {
          label: 'Registrar Estudiante',
          link: '/admin-uni/students/register',
          icon: '🎓',
          color: 'primary',
        },
        { label: 'Crear Evento', link: '/admin-uni/events/new', icon: '📅', color: 'secondary' },
        { label: 'Ver Reportes', link: '/admin-uni/reports', icon: '📊', color: 'accent' },
      ],
      promoter: [
        {
          label: 'Nueva Oportunidad',
          link: '/promoter/opportunities/create',
          icon: '💼',
          color: 'primary',
        },
        { label: 'Ver Candidatos', link: '/promoter/candidates', icon: '👥', color: 'secondary' },
      ],
      public: [],
    };

    return actions[role as keyof typeof actions] || [];
  }

  // Filtros por rol
  getFilters(): string[] {
    const role = this.currentRole();
    console.log('🔍 DynamicHeader - Current role:', role);

    const filters = {
      admin: ['Usuarios', 'Universidades', 'Proyectos', 'Reportes'],
      student: ['Proyectos', 'Foros', 'Eventos', 'Oportunidades', 'Cursos'],
      university_admin: ['Estudiantes', 'Proyectos', 'Eventos'],
      promoter: ['Oportunidades', 'Candidatos'],
      public: [],
    };

    const result = filters[role as keyof typeof filters] || [];
    console.log('🔍 DynamicHeader - Filters for role:', role, '=', result);
    return result;
  }

  // Navegar al hacer click en filtros
  onFilterClick(filter: string): void {
    const role = this.currentRole();

    // Mapeo de filtros a rutas por rol
    const routeMap: { [key: string]: { [key: string]: string } } = {
      admin: {
        Usuarios: '/admin/users',
        Universidades: '/admin/universities',
        Proyectos: '/admin/proyectos',
        Reportes: '/admin/reports',
      },
      student: {
        Proyectos: '/student/projects',
        Foros: '/student/forums',
        Eventos: '/student/events',
        Oportunidades: '/student/opportunities',
        Cursos: '/student/courses',
      },
      university_admin: {
        Estudiantes: '/admin-uni/students',
        Proyectos: '/admin-uni/projects',
        Eventos: '/admin-uni/events',
      },
      promoter: {
        Oportunidades: '/promoter/opportunities',
        Candidatos: '/promoter/candidates',
      },
    };

    const route = routeMap[role]?.[filter];
    if (route) {
      this.router.navigate([route]);
    }
  }

  // Menú items del usuario
  getUserMenuItems() {
    const role = this.currentRole();
    const baseItems = [
      { label: 'Mi Perfil', link: this.getProfileRoute(), icon: '👤' },
      { label: 'Configuración', link: this.getSettingsRoute(), icon: '⚙️' },
    ];

    // Items específicos por rol
    const roleSpecificItems = {
      admin: [
        { label: 'Panel Admin', link: '/admin/dashboard', icon: '🔧' },
        { label: 'Reportes', link: '/admin/reports', icon: '📊' },
      ],
      student: [
        { label: 'Mis Proyectos', link: '/student/projects/my', icon: '📁' },
        { label: 'Mis Postulaciones', link: '/student/applications', icon: '📤' },
      ],
      university_admin: [
        { label: 'Panel Universidad', link: '/admin-uni/dashboard', icon: '🏛️' },
        { label: 'Estudiantes', link: '/admin-uni/students', icon: '🎓' },
      ],
      promoter: [
        { label: 'Mis Ofertas', link: '/promoter/opportunities', icon: '💼' },
        { label: 'Estadísticas', link: '/promoter/stats', icon: '📈' },
      ],
      public: [],
    };

    const specificItems = roleSpecificItems[role as keyof typeof roleSpecificItems] || [];

    return [
      ...baseItems,
      ...specificItems,
      { label: 'Cerrar Sesión', link: '#', icon: '🚪', action: 'logout' },
    ];
  }

  // Control de menús
  toggleUserMenu() {
    this.showUserMenu.update(value => !value);
    this.showMobileMenu.set(false);
  }

  closeUserMenu() {
    this.showUserMenu.set(false);
  }

  toggleMobileMenu() {
    this.showMobileMenu.update(value => !value);
    this.showUserMenu.set(false);
  }

  closeMobileMenu() {
    this.showMobileMenu.set(false);
  }

  // Información del usuario
  getUserInitials(): string {
    const user = this.authService.currentUser();
    if (user?.nombre) {
      return user.nombre
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.correo?.slice(0, 2).toUpperCase() || 'U';
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
      admin: 'Administrador',
      student: 'Estudiante',
      university_admin: 'Admin Universidad',
      promoter: 'Promotor',
      public: 'Público',
    };
    return roleNames[role as keyof typeof roleNames] || 'Usuario';
  }

  // Contadores de badges
  getNotificationCount(): number {
    return 3; // Mock data - integrate with real notification service
  }

  getMessageCount(): number {
    return 5; // Mock data - integrate with real message service
  }

  // Utilidades
  isActiveRoute(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  getProfileRoute(): string {
    const role = this.currentRole();
    const routeMap: Record<string, string> = {
      admin: '/admin/profile',
      student: '/student/profile',
      university_admin: '/admin-uni/profile',
      promoter: '/promoter/profile',
      public: '/profile',
    };
    return routeMap[role] || '/profile';
  }

  getSettingsRoute(): string {
    const role = this.currentRole();
    const routeMap: Record<string, string> = {
      admin: '/admin/settings',
      student: '/student/settings',
      university_admin: '/admin-uni/settings',
      promoter: '/promoter/settings',
      public: '/settings',
    };
    return routeMap[role] || '/settings';
  }

  // Actions
  onMenuItemClick(item: { label: string; link: string; icon: string; action?: string }) {
    if (item.action === 'logout') {
      this.logout();
    } else if (item.link && item.link !== '#') {
      this.router.navigate([item.link]);
    }
    this.closeUserMenu();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
