import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth/auth.service';
import { LayoutConfigService, SidebarItem } from '@app/core/services/layout/layout-config.service';
import { Subject } from 'rxjs';

interface StudentSearchResult {
  id: number;
  nombre: string;
  apellido?: string;
  correo: string;
  universidad_id: number;
  rol_id: number;
  verificado: boolean;
  universidad?: {
    nombre: string;
  };
}

@Component({
  selector: 'app-dynamic-header',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './dynamic-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicHeaderComponent implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly layoutConfigService = inject(LayoutConfigService);
  private readonly router = inject(Router);

  private destroy$ = new Subject<void>();

  // Estados locales para UI
  showUserMenu = signal(false);
  showMobileMenu = signal(false);
  showNotificationsDropdown = signal(false);
  showMessagesDropdown = signal(false);

  // Search functionality
  searchTerm = signal('');
  searchResults = signal<{ id: number; nombre: string; tipo: string }[]>([]);
  isSearching = signal(false);
  showSearchResults = signal(false);

  // Notifications and messages
  unreadNotifications = signal(0);
  unreadMessages = signal(0);
  recentNotifications = signal<
    { id: number; mensaje: string; tipo: string; leida: boolean; created_at: string }[]
  >([]);
  recentMessages = signal<
    {
      id: number;
      mensaje: string;
      usuario: { nombre: string; apellido: string };
      leido: boolean;
      created_at: string;
    }[]
  >([]);
  recentConversations = signal<
    {
      id: number;
      otro_usuario: { nombre: string; apellido: string };
      ultimo_mensaje: string;
      ultimo_mensaje_fecha: string;
      no_leidos: number;
    }[]
  >([]);

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
        }
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadInitialData(): void {
    if (this.currentRole() !== 'public') {
      this.loadUnreadCounts();
      this.loadRecentData();
    }
  }

  private loadUnreadCounts(): void {
    // Mock data - integrate with real services
    this.unreadNotifications.set(3);
    this.unreadMessages.set(5);
  }

  private loadRecentData(): void {
    // Mock recent notifications
    this.recentNotifications.set([
      {
        id: 1,
        mensaje: 'Nuevo proyecto disponible',
        tipo: 'proyecto',
        leida: false,
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        mensaje: 'Evento próximo: Conferencia Tech',
        tipo: 'evento',
        leida: false,
        created_at: new Date().toISOString(),
      },
    ]);

    // Mock recent messages
    this.recentMessages.set([
      {
        id: 1,
        mensaje: 'Te han invitado a un proyecto',
        usuario: { nombre: 'Ana', apellido: 'García' },
        leido: false,
        created_at: new Date().toISOString(),
      },
      {
        id: 2,
        mensaje: 'Respuesta a tu foro',
        usuario: { nombre: 'Carlos', apellido: 'López' },
        leido: false,
        created_at: new Date().toISOString(),
      },
    ]);

    // Mock recent conversations
    this.recentConversations.set([
      {
        id: 1,
        otro_usuario: {
          nombre: 'Juan',
          apellido: 'Pérez',
        },
        ultimo_mensaje: 'Hola, ¿cómo estás?',
        ultimo_mensaje_fecha: new Date().toISOString(),
        no_leidos: 2,
      },
    ]);
  }

  // Search functionality
  onSearchChange(term: string): void {
    this.searchTerm.set(term);
    if (term.length >= 2) {
      this.performSearch(term);
    } else {
      this.searchResults.set([]);
      this.showSearchResults.set(false);
    }
  }

  private performSearch(term: string): void {
    this.isSearching.set(true);

    // Simulate API call with setTimeout
    setTimeout(() => {
      // Mock search results
      const mockResults = [
        {
          id: 1,
          nombre: `Proyecto ${term}`,
          tipo: 'Proyecto',
        },
        {
          id: 2,
          nombre: `Usuario ${term}`,
          tipo: 'Usuario',
        },
      ];

      this.searchResults.set(mockResults);
      this.showSearchResults.set(true);
      this.isSearching.set(false);
    }, 500);
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
        { label: 'Nuevo Usuario', link: '/admin/users', icon: '👤', color: 'primary' },
        {
          label: 'Nueva Universidad',
          link: '/admin/universities',
          icon: '🏛️',
          color: 'secondary',
        },
        { label: 'Respaldo', link: '/admin/backups', icon: '💾', color: 'accent' },
      ],
      student: [
        { label: 'Nuevo Proyecto', link: '/student/Addprojects', icon: '🚀', color: 'primary' },
        {
          label: 'Ver Oportunidades',
          link: '/student/opportunities',
          icon: '📅',
          color: 'secondary',
        },
        { label: 'Explorar Foros', link: '/student/forum', icon: '💬', color: 'accent' },
      ],
      university_admin: [
        {
          label: 'Dashboard',
          link: '/admin-uni/dashboard',
          icon: '🎓',
          color: 'primary',
        },
        { label: 'Dashboard', link: '/admin-uni/dashboard', icon: '📅', color: 'secondary' },
        { label: 'Dashboard', link: '/admin-uni/dashboard', icon: '📊', color: 'accent' },
      ],
      promoter: [
        {
          label: 'Nueva Oportunidad',
          link: '/promoter/opportunities/create',
          icon: '💼',
          color: 'primary',
        },
        {
          label: 'Ver Oportunidades',
          link: '/promoter/opportunities',
          icon: '👥',
          color: 'secondary',
        },
      ],
      public: [],
    };

    return actions[role as keyof typeof actions] || [];
  }

  // Filtros de búsqueda por rol
  getSearchFilters() {
    const role = this.currentRole();

    const result = {
      admin: [
        { label: 'Gestión de Usuarios', value: 'Gestión de Usuarios' },
        { label: 'Universidades', value: 'Universidades' },
        { label: 'Comunicación', value: 'Comunicación' },
        { label: 'Sistema', value: 'Sistema' },
        { label: 'Nuevo Usuario', value: 'Nuevo Usuario' },
      ],
      student: [
        { label: 'Proyectos', value: 'Proyectos' },
        { label: 'Foros', value: 'Foros' },
        { label: 'Oportunidades', value: 'Oportunidades' },
      ],
      university_admin: [{ label: 'Dashboard', value: 'Dashboard' }],
      promoter: [
        { label: 'Oportunidades', value: 'Oportunidades' },
        { label: 'Ver Candidatos', value: 'Ver Candidatos' },
        { label: 'Mi Perfil', value: 'Mi Perfil' },
      ],
      public: [{ label: 'Buscar', value: 'general' }],
    };

    return result[role as keyof typeof result] || result.public;
  }

  // Navegar al hacer click en filtros
  onFilterClick(filter: string): void {
    const role = this.currentRole();

    // Mapeo de filtros a rutas por rol (actualizadas para coincidir con las rutas reales)
    const routeMap: { [key: string]: { [key: string]: string } } = {
      admin: {
        'Gestión de Usuarios': '/admin/users',
        Comunicación: '/admin/conversations',
        Sistema: '/admin/settings',
        'Nuevo Usuario': '/admin/users',
        Usuarios: '/admin/users',
        Universidades: '/admin/universities',
        Proyectos: '/admin/proyectos',
        Reportes: '/admin/reports',
      },
      student: {
        Proyectos: '/student/dashboard', // No hay ruta directa /student/projects
        Foros: '/student/forum',
        Eventos: '/student/opportunities', // No hay eventos específicos
        Oportunidades: '/student/opportunities',
      },
      university_admin: {
        Estudiantes: '/admin-uni/dashboard',
        Proyectos: '/admin-uni/dashboard',
        Eventos: '/admin-uni/dashboard',
      },
      promoter: {
        Oportunidades: '/promoter/opportunities',
        'Ver Candidatos': '/promoter/opportunities', // No hay candidatos específicos
        'Mi Perfil': '/promoter/dashboard',
        Candidatos: '/promoter/opportunities',
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
        { label: 'Mis Proyectos', link: '/student/dashboard', icon: '📁' },
        { label: 'Ver Oportunidades', link: '/student/opportunities', icon: '📤' },
      ],
      university_admin: [
        { label: 'Panel Universidad', link: '/admin-uni/dashboard', icon: '🏛️' },
        { label: 'Dashboard', link: '/admin-uni/dashboard', icon: '🎓' },
      ],
      promoter: [
        { label: 'Mis Ofertas', link: '/promoter/opportunities', icon: '💼' },
        { label: 'Dashboard', link: '/promoter/dashboard', icon: '📈' },
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
    this.showUserMenu.set(!this.showUserMenu());
    this.showNotificationsDropdown.set(false);
    this.showMessagesDropdown.set(false);
    this.showMobileMenu.set(false);
  }

  closeUserMenu() {
    this.showUserMenu.set(false);
  }

  toggleMobileMenu() {
    this.showMobileMenu.set(!this.showMobileMenu());
    this.showUserMenu.set(false);
    this.showNotificationsDropdown.set(false);
    this.showMessagesDropdown.set(false);
  }

  closeMobileMenu() {
    this.showMobileMenu.set(false);
  }

  closeNotifications() {
    this.showNotificationsDropdown.set(false);
  }

  closeMessages() {
    this.showMessagesDropdown.set(false);
  }

  // Navigation methods
  navigateToHome(): void {
    const role = this.currentRole();
    const homeRoutes = {
      admin: '/admin/dashboard',
      student: '/student/feed',
      university_admin: '/admin-uni/dashboard',
      promoter: '/promoter/dashboard',
      public: '/landing',
    };

    const route = homeRoutes[role as keyof typeof homeRoutes] || '/landing';
    this.router.navigate([route]);
  }

  // Notification methods
  markNotificationAsRead(notificationId: number): void {
    const notifications = this.recentNotifications();
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId ? { ...notification, leida: true } : notification,
    );
    this.recentNotifications.set(updatedNotifications);

    // Update unread count
    const unreadCount = updatedNotifications.filter(n => !n.leida).length;
    this.unreadNotifications.set(unreadCount);

    // Close dropdown after marking as read
    this.showNotificationsDropdown.set(false);
  }

  // Message methods
  markMessageAsRead(messageId: number): void {
    const messages = this.recentMessages();
    const updatedMessages = messages.map(message =>
      message.id === messageId ? { ...message, leido: true } : message,
    );
    this.recentMessages.set(updatedMessages);

    // Update unread count
    const unreadCount = updatedMessages.filter(m => !m.leido).length;
    this.unreadMessages.set(unreadCount);

    // Close dropdown after marking as read
    this.showMessagesDropdown.set(false);
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

  // Control de dropdowns
  toggleNotificationsDropdown(): void {
    this.showNotificationsDropdown.set(!this.showNotificationsDropdown());
    this.showMessagesDropdown.set(false);
    this.showUserMenu.set(false);
  }

  toggleMessagesDropdown(): void {
    this.showMessagesDropdown.set(!this.showMessagesDropdown());
    this.showNotificationsDropdown.set(false);
    this.showUserMenu.set(false);
  }

  // Contadores de badges
  getNotificationCount(): number {
    return this.unreadNotifications();
  }

  getMessageCount(): number {
    return this.unreadMessages();
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
      university_admin: '/admin-uni/dashboard',
      promoter: '/promoter/dashboard',
      public: '/landing',
    };
    return routeMap[role] || '/landing';
  }

  getSettingsRoute(): string {
    const role = this.currentRole();
    const routeMap: Record<string, string> = {
      admin: '/admin/settings',
      student: '/student/dashboard',
      university_admin: '/admin-uni/dashboard',
      promoter: '/promoter/dashboard',
      public: '/landing',
    };
    return routeMap[role] || '/landing';
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

  isLogoutItem(item: { label: string; link: string; icon: string; action?: string }): boolean {
    return item.action === 'logout';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  /**
   * ✅ Manejar teclas especiales en el input
   */
  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.clearSearch();
    }
  }

  /**
   * ✅ Navegar al perfil del estudiante seleccionado
   */
  goToStudentProfile(studentId: number): void {
    this.router.navigate(['/student/public-profile', studentId]);
    this.clearSearch();
  }

  /**
   * ✅ Métodos de navegación del header
   */
  navigateToFeed(): void {
    const user = this.authService.currentUser();
    const rolePrefix = this.getRolePrefix(user?.rol_id);
    this.router.navigate([`/${rolePrefix}/dashboard`]);
  }

  navigateToProjects(): void {
    const user = this.authService.currentUser();
    const rolePrefix = this.getRolePrefix(user?.rol_id);

    // Mapeo específico para proyectos según el rol
    const projectRoutes = {
      admin: '/admin/proyectos',
      student: '/student/projects',
      promoter: '/promoter/opportunities', // Los promotores ven oportunidades como su "proyectos"
      'admin-uni': '/admin-uni/projects',
    };

    const route = projectRoutes[rolePrefix as keyof typeof projectRoutes] || '/student/projects';
    this.router.navigate([route]);
  }

  navigateToForums(): void {
    const user = this.authService.currentUser();
    const rolePrefix = this.getRolePrefix(user?.rol_id);
    this.router.navigate([`/${rolePrefix}/forums`]);
  }

  navigateToEvents(): void {
    const user = this.authService.currentUser();
    const rolePrefix = this.getRolePrefix(user?.rol_id);
    this.router.navigate([`/${rolePrefix}/events`]);
  }

  navigateToOpportunities(): void {
    const user = this.authService.currentUser();
    const rolePrefix = this.getRolePrefix(user?.rol_id);
    this.router.navigate([`/${rolePrefix}/opportunities`]);
  }

  navigateToCourses(): void {
    // Implementar cuando esté disponible la ruta
  }

  // Método auxiliar para obtener el prefijo de ruta según el rol
  private getRolePrefix(roleId: number | undefined): string {
    switch (roleId) {
      case 1:
        return 'admin';
      case 2:
        return 'student';
      case 3:
        return 'promoter';
      case 9:
        return 'admin-uni';
      default:
        return 'student';
    }
  }

  navigateToNotifications(): void {
    // Por ahora navegamos al dashboard hasta que estén las notificaciones
  }

  navigateToMessages(): void {
    this.router.navigate(['/student/conversations']);
  }

  /**
   * ✅ Limpiar búsqueda
   */
  clearSearch(): void {
    this.searchTerm.set('');
    this.searchResults.set([]);
    this.showSearchResults.set(false);
    this.isSearching.set(false);
  }

  /**
   * ✅ Manejar clic fuera del componente de búsqueda
   */
  onSearchBlur(): void {
    // Delay más largo para permitir clic en resultados
    setTimeout(() => {
      this.showSearchResults.set(false);
    }, 300);
  }

  /**
   * ✅ Mostrar resultados al hacer focus
   */
  onSearchFocus(): void {
    // Mostrar resultados si hay término de búsqueda y resultados
    if (this.searchTerm().trim() && this.searchResults().length > 0) {
      this.showSearchResults.set(true);
    }
  }

  /**
   * ✅ TrackBy function para optimizar ngFor
   */
  trackByStudentId(_index: number, student: StudentSearchResult): number {
    return student.id;
  }
}
