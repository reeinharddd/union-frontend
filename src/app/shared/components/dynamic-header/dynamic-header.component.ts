import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth/auth.service';
import { LayoutConfigService, SidebarItem } from '@app/core/services/layout/layout-config.service';
import { catchError, debounceTime, distinctUntilChanged, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { ApiClientService } from '../../../core/services/base/api-client.service';

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
export class DynamicHeaderComponent {
  private readonly apiClient = inject(ApiClientService);
  private readonly authService = inject(AuthService);
  private readonly layoutConfigService = inject(LayoutConfigService);
  private readonly router = inject(Router);

  // Estados locales para UI
  showUserMenu = signal(false);
  showMobileMenu = signal(false);

  searchTerm = signal('');
  searchResults = signal<StudentSearchResult[]>([]);
  isSearching = signal(false);
  showResults = signal(false);

  private searchSubject = new Subject<string>();

  // Rol actual del usuario
  currentRole = signal(this.layoutConfigService.getCurrentUserRole());

  constructor() {
    // Efecto para actualizar el rol cuando cambie el estado de autenticación
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        const newRole = this.layoutConfigService.getCurrentUserRole();
        this.currentRole.set(newRole);
        console.log('🔄 DynamicHeader - Role updated:', newRole);
      }
    });

    this.searchSubject
      .pipe(
        debounceTime(250), // Reducir debounce para mayor responsividad
        distinctUntilChanged(), // Solo buscar si el término cambió
        switchMap(term => this.searchStudents(term)),
      )
      .subscribe();
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

  private searchStudents(term: string): Observable<StudentSearchResult[]> {
    if (!term.trim()) {
      this.searchResults.set([]);
      this.showResults.set(false);
      this.isSearching.set(false);
      return of([]);
    }

    this.isSearching.set(true);
    console.log('🔍 Iniciando búsqueda con término:', term);

    // Obtener usuarios con rol_id = 2 (estudiantes) y filtrar en frontend
    return this.apiClient
      .get<StudentSearchResult[]>('/usuarios', {
        rol_id: 2, // Solo estudiantes según requerimiento
        limit: 50, // Aumentar límite para filtrar mejor en frontend
      })
      .pipe(
        tap((response: StudentSearchResult[]) => {
          console.log('🔍 Respuesta completa del servidor:', response);
          console.log('🔍 Tipo de respuesta:', typeof response);
          console.log('🔍 Es array:', Array.isArray(response));

          const currentUser = this.authService.currentUser();
          const currentUserId = currentUser?.id;

          // Verificar si la respuesta tiene una estructura diferente
          let users: StudentSearchResult[] = [];
          if (Array.isArray(response)) {
            // Filtrar solo estudiantes (rol_id = 2) y excluir usuario actual
            users = response.filter(user => user.rol_id === 2 && user.id !== currentUserId);
          } else if (response && (response as any).data && Array.isArray((response as any).data)) {
            users = (response as any).data.filter(
              (user: StudentSearchResult) => user.rol_id === 2 && user.id !== currentUserId,
            );
            console.log('🔍 Usando response.data:', users);
          } else if (
            response &&
            (response as any).usuarios &&
            Array.isArray((response as any).usuarios)
          ) {
            users = (response as any).usuarios.filter(
              (user: StudentSearchResult) => user.rol_id === 2 && user.id !== currentUserId,
            );
            console.log('🔍 Usando response.usuarios:', users);
          } else {
            console.log('🔍 Estructura de respuesta no reconocida');
          }

          // ✅ Filtro adicional en frontend por nombre/apellido si el backend no filtra
          const searchTermLower = term.toLowerCase().trim();
          users = users.filter(user => {
            const fullName = `${user.nombre} ${user.apellido || ''}`.toLowerCase();
            const email = user.correo.toLowerCase();
            return (
              fullName.includes(searchTermLower) ||
              email.includes(searchTermLower) ||
              user.nombre.toLowerCase().includes(searchTermLower) ||
              (user.apellido && user.apellido.toLowerCase().includes(searchTermLower))
            );
          });

          // Limitar resultados a 8 para la UI
          users = users.slice(0, 8);

          console.log('🔍 Usuario actual ID:', currentUserId);
          console.log('🔍 Usuarios filtrados (sin usuario actual):', users.length);
          console.log('🔍 Término de búsqueda:', searchTermLower);

          this.searchResults.set(users);
          this.showResults.set(users.length > 0 && this.searchTerm().trim().length > 0);
          this.isSearching.set(false);
          console.log('🔍 Usuarios encontrados:', users.length);
        }),
        catchError(error => {
          console.error('❌ Error completo en búsqueda de estudiantes:', error);
          console.error('❌ Status del error:', error.status);
          console.error('❌ Mensaje del error:', error.message);
          console.error('❌ URL solicitada:', error.url);
          this.isSearching.set(false);
          this.searchResults.set([]);
          this.showResults.set(false);
          return of([]);
        }),
        switchMap(() => of(this.searchResults())),
      );
  }

  /**
   * ✅ Manejar cambio en input de búsqueda
   */
  onSearchChange(term: string): void {
    this.searchTerm.set(term);
    this.searchSubject.next(term);

    // Si el campo está vacío, ocultar resultados inmediatamente
    if (!term.trim()) {
      this.showResults.set(false);
      this.searchResults.set([]);
    }
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
    console.log('👤 Navegando al perfil del estudiante:', studentId);
  }

  /**
   * ✅ Métodos de navegación del header
   */
  navigateToFeed(): void {
    const user = this.authService.currentUser();
    const rolePrefix = this.getRolePrefix(user?.rol_id);
    this.router.navigate([`/${rolePrefix}/dashboard`]);
    console.log('🏠 Navegando al feed principal');
  }

  navigateToProjects(): void {
    const user = this.authService.currentUser();
    const rolePrefix = this.getRolePrefix(user?.rol_id);

    // Debug logs
    console.log('🔍 User:', user);
    console.log('🔍 Role ID:', user?.rol_id);
    console.log('🔍 Role Prefix:', rolePrefix);

    // Mapeo específico para proyectos según el rol
    const projectRoutes = {
      'admin': '/admin/proyectos',
      'student': '/student/projects',
      'promoter': '/promoter/opportunities', // Los promotores ven oportunidades como su "proyectos"
      'admin-uni': '/admin-uni/projects'
    };

    const route = projectRoutes[rolePrefix as keyof typeof projectRoutes] || '/student/projects';
    console.log('🔍 Selected route:', route);
    this.router.navigate([route]);
    console.log('📁 Navegando a proyectos');
  }

  navigateToForums(): void {
    const user = this.authService.currentUser();
    const rolePrefix = this.getRolePrefix(user?.rol_id);
    this.router.navigate([`/${rolePrefix}/forums`]);
    console.log('💬 Navegando a foros');
  }

  navigateToEvents(): void {
    const user = this.authService.currentUser();
    const rolePrefix = this.getRolePrefix(user?.rol_id);
    this.router.navigate([`/${rolePrefix}/events`]);
    console.log('📅 Navegando a eventos');
  }

  navigateToOpportunities(): void {
    const user = this.authService.currentUser();
    const rolePrefix = this.getRolePrefix(user?.rol_id);
    this.router.navigate([`/${rolePrefix}/opportunities`]);
    console.log('🎯 Navegando a oportunidades');
  }

  navigateToCourses(): void {
    // Implementar cuando esté disponible la ruta
    console.log('📚 Navegando a cursos - En desarrollo');
  }

  // Método auxiliar para obtener el prefijo de ruta según el rol
  private getRolePrefix(roleId: number | undefined): string {
    switch (roleId) {
      case 1: return 'admin';
      case 2: return 'student';
      case 3: return 'promoter';
      case 9: return 'admin-uni';
      default: return 'student';
    }
  }

  navigateToNotifications(): void {
    // Por ahora navegamos al dashboard hasta que estén las notificaciones
    console.log('🔔 Navegando a notificaciones - En desarrollo');
  }

  navigateToMessages(): void {
    this.router.navigate(['/student/conversations']);
    console.log('💬 Navegando a conversaciones');
  }

  /**
   * ✅ Limpiar búsqueda
   */
  clearSearch(): void {
    this.searchTerm.set('');
    this.searchResults.set([]);
    this.showResults.set(false);
    this.isSearching.set(false);
  }

  /**
   * ✅ Manejar clic fuera del componente de búsqueda
   */
  onSearchBlur(): void {
    // Delay más largo para permitir clic en resultados
    setTimeout(() => {
      this.showResults.set(false);
    }, 300);
  }

  /**
   * ✅ Mostrar resultados al hacer focus
   */
  onSearchFocus(): void {
    // Mostrar resultados si hay término de búsqueda y resultados
    if (this.searchTerm().trim() && this.searchResults().length > 0) {
      this.showResults.set(true);
    }
  }

  /**
   * ✅ TrackBy function para optimizar ngFor
   */
  trackByStudentId(_index: number, student: StudentSearchResult): number {
    return student.id;
  }
}
