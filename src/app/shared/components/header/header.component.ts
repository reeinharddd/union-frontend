import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ApiClientService } from '../../../core/services/base/api-client.service';

// ✅ Interface para resultados de búsqueda de estudiantes
export interface StudentSearchResult {
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
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styles: `
    .search-result-item {
      transition: all 0.2s ease;
    }

    .search-result-item:hover {
      background-color: #fed7aa !important; /* orange-200 */
    }

    .dark .search-result-item:hover {
      background-color: #9a3412 !important; /* orange-800 */
    }

    .search-result-item:hover .avatar {
      background: linear-gradient(
        135deg,
        #fb923c,
        #ea580c
      ) !important; /* orange-400 to orange-600 */
    }

    .search-result-item:hover .student-name {
      color: #c2410c !important; /* orange-700 */
    }

    .dark .search-result-item:hover .student-name {
      color: #fdba74 !important; /* orange-300 */
    }

    .search-result-item:hover .student-info {
      color: #ea580c !important; /* orange-600 */
    }

    .dark .search-result-item:hover .student-info {
      color: #fed7aa !important; /* orange-200 */
    }

    .search-result-item:hover .arrow-icon {
      color: #ea580c !important; /* orange-600 */
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly apiClient = inject(ApiClientService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  // ✅ Señales para manejo de estado de búsqueda
  searchTerm = signal('');
  searchResults = signal<StudentSearchResult[]>([]);
  isSearching = signal(false);
  showResults = signal(false);

  // ✅ Subject para debounce de búsqueda
  private searchSubject = new Subject<string>();

  constructor() {
    // ✅ Configurar búsqueda con debounce según REQ-4.6.1
    this.searchSubject
      .pipe(
        debounceTime(250), // Reducir debounce para mayor responsividad
        distinctUntilChanged(), // Solo buscar si el término cambió
        switchMap(term => this.searchStudents(term)),
      )
      .subscribe();
  }

  /**
   * ✅ Buscar estudiantes según REQ-4.6.1
   */
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
      admin: '/admin/proyectos',
      student: '/student/projects',
      promoter: '/promoter/opportunities', // Los promotores ven oportunidades como su "proyectos"
      'admin-uni': '/admin-uni/projects',
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
