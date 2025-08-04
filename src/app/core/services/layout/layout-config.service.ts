import { Injectable, inject, computed } from '@angular/core';
import { AuthService } from '@app/core/services/auth/auth.service';

export type UserRole = 'admin' | 'promoter' | 'student' | 'university_admin' | 'public';

export interface LayoutConfig {
  showLeftSidebar: boolean;
  showRightSidebar: boolean;
  headerType: 'admin' | 'student' | 'university' | 'public';
  leftSidebarItems: SidebarItem[];
  rightSidebarItems?: SidebarItem[];
}

export interface SidebarItem {
  label: string;
  route: string;
  icon: string;
  children?: SidebarItem[];
  badge?: string;
  permissions?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class LayoutConfigService {
  private readonly authService = inject(AuthService);

  // Señal reactiva para el usuario actual
  private readonly currentUser = computed(() => this.authService.currentUser());

  // Configuraciones de layout por rol
  private readonly roleConfigs: Record<UserRole, LayoutConfig> = {
    admin: {
      showLeftSidebar: true,
      showRightSidebar: false, // Admin solo tiene sidebar izquierdo
      headerType: 'admin',
      leftSidebarItems: [
        {
          label: 'Dashboard',
          route: '/admin/dashboard',
          icon: '📊',
          badge: '3'
        },
        {
          label: 'Gestión de Usuarios',
          route: '/admin/users',
          icon: '👥',
          children: [
            { label: 'Lista de Usuarios', route: '/admin/users', icon: '📋' },
            { label: 'Usuarios Pendientes', route: '/admin/users/pending', icon: '⏳', badge: '5' },
            { label: 'Reportes de Usuario', route: '/admin/users/reports', icon: '🚨', badge: '2' }
          ]
        },
        {
          label: 'Universidades',
          route: '/admin/universities',
          icon: '🏢',
          children: [
            { label: 'Lista de Universidades', route: '/admin/universities', icon: '📋' },
            { label: 'Registros Pendientes', route: '/admin/universities/pending', icon: '⏳', badge: '1' },
            { label: 'Configuración', route: '/admin/universities/config', icon: '⚙️' }
          ]
        },
        {
          label: 'Contenido y Moderación',
          route: '/admin/content',
          icon: '🛡️',
          children: [
            { label: 'Foros', route: '/admin/forums', icon: '💬' },
            { label: 'Proyectos', route: '/admin/projects', icon: '📁' },
            { label: 'Reportes', route: '/admin/reports', icon: '📋', badge: '8' },
            { label: 'Tags y Etiquetas', route: '/admin/tags', icon: '🏷️' }
          ]
        },
        {
          label: 'Eventos y Oportunidades',
          route: '/admin/events',
          icon: '📅',
          children: [
            { label: 'Eventos', route: '/admin/events', icon: '📅' },
            { label: 'Oportunidades', route: '/admin/opportunities', icon: '🎯' }
          ]
        },
        {
          label: 'Analíticas',
          route: '/admin/analytics',
          icon: '📈',
          children: [
            { label: 'Métricas Generales', route: '/admin/analytics', icon: '📊' },
            { label: 'Usuarios Activos', route: '/admin/analytics/users', icon: '👥' },
            { label: 'Contenido Popular', route: '/admin/analytics/content', icon: '🔥' }
          ]
        },
        {
          label: 'Configuración del Sistema',
          route: '/admin/settings',
          icon: '⚙️',
          children: [
            { label: 'Configuración General', route: '/admin/settings', icon: '⚙️' },
            { label: 'Roles y Permisos', route: '/admin/roles', icon: '🔐' },
            { label: 'Respaldos', route: '/admin/backup', icon: '💾' }
          ]
        },
        {
          label: 'Soporte',
          route: '/admin/support',
          icon: '🎧',
          badge: '12'
        }
      ]
      // Admin NO tiene rightSidebarItems
    },

    student: {
      showLeftSidebar: true,
      showRightSidebar: true, // Estudiante tiene ambos sidebars
      headerType: 'student',
      leftSidebarItems: [
        {
          label: 'Inicio',
          route: '/student/dashboard',
          icon: '🏠'
        },
        {
          label: 'Mi Perfil',
          route: '/student/profile',
          icon: '👤',
          children: [
            { label: 'Ver Perfil', route: '/student/profile', icon: '👤' },
            { label: 'Editar Información', route: '/student/profile/edit', icon: '✏️' },
            { label: 'Experiencias', route: '/student/profile/experiences', icon: '💼' },
            { label: 'Configuración', route: '/student/profile/settings', icon: '⚙️' }
          ]
        },
        {
          label: 'Foros Académicos',
          route: '/student/forums',
          icon: '💬',
          badge: '24'
        },
        {
          label: 'Proyectos',
          route: '/student/projects',
          icon: '📁',
          children: [
            { label: 'Mis Proyectos', route: '/student/projects/my', icon: '📁' },
            { label: 'Explorar Proyectos', route: '/student/projects', icon: '🔍' },
            { label: 'Crear Proyecto', route: '/student/projects/create', icon: '➕' }
          ]
        },
        {
          label: 'Oportunidades',
          route: '/student/opportunities',
          icon: '🎯',
          badge: '7'
        },
        {
          label: 'Eventos',
          route: '/student/events',
          icon: '📅',
          badge: '3'
        },
        {
          label: 'Cursos y Calificaciones',
          route: '/student/courses',
          icon: '📚'
        }
      ],
      rightSidebarItems: [
        {
          label: 'Actividad Reciente',
          route: '',
          icon: '🔔'
        },
        {
          label: 'Proyectos Sugeridos',
          route: '/student/projects/suggested',
          icon: '💡'
        },
        {
          label: 'Conexiones',
          route: '/student/connections',
          icon: '🤝',
          badge: '15'
        },
        {
          label: 'Eventos Próximos',
          route: '/student/events/upcoming',
          icon: '📅',
          badge: '3'
        }
      ]
    },

    university_admin: {
      showLeftSidebar: true,
      showRightSidebar: true, // Admin Uni tiene ambos sidebars
      headerType: 'university',
      leftSidebarItems: [
        {
          label: 'Dashboard',
          route: '/admin-uni/dashboard',
          icon: '📊'
        },
        {
          label: 'Gestión de Estudiantes',
          route: '/admin-uni/students',
          icon: '🎓',
          children: [
            { label: 'Lista de Estudiantes', route: '/admin-uni/students', icon: '📋' },
            { label: 'Validación de Registros', route: '/admin-uni/students/validation', icon: '✅', badge: '12' },
            { label: 'Graduados', route: '/admin-uni/students/graduates', icon: '🎓' }
          ]
        },
        {
          label: 'Proyectos Estudiantiles',
          route: '/admin-uni/projects',
          icon: '📁',
          children: [
            { label: 'Todos los Proyectos', route: '/admin-uni/projects', icon: '📁' },
            { label: 'Pendientes de Verificación', route: '/admin-uni/projects/pending', icon: '⏳', badge: '8' },
            { label: 'Proyectos Verificados', route: '/admin-uni/projects/verified', icon: '✅' }
          ]
        },
        {
          label: 'Eventos y Webinars',
          route: '/admin-uni/events',
          icon: '📅',
          children: [
            { label: 'Mis Eventos', route: '/admin-uni/events', icon: '📅' },
            { label: 'Crear Evento', route: '/admin-uni/events/create', icon: '➕' },
            { label: 'Asistencias', route: '/admin-uni/events/attendance', icon: '📊' }
          ]
        },
        {
          label: 'Oportunidades Académicas',
          route: '/admin-uni/opportunities',
          icon: '🎯',
          children: [
            { label: 'Mis Oportunidades', route: '/admin-uni/opportunities', icon: '🎯' },
            { label: 'Crear Oportunidad', route: '/admin-uni/opportunities/create', icon: '➕' },
            { label: 'Postulaciones', route: '/admin-uni/opportunities/applications', icon: '📝', badge: '23' }
          ]
        },
        {
          label: 'Reportes Institucionales',
          route: '/admin-uni/reports',
          icon: '📈'
        }
      ],
      rightSidebarItems: [
        {
          label: 'Estadísticas Rápidas',
          route: '',
          icon: '📊'
        },
        {
          label: 'Estudiantes Activos',
          route: '/admin-uni/students/active',
          icon: '👥',
          badge: '245'
        },
        {
          label: 'Proyectos Pendientes',
          route: '/admin-uni/projects/pending',
          icon: '⏳',
          badge: '8'
        },
        {
          label: 'Eventos Próximos',
          route: '/admin-uni/events/upcoming',
          icon: '📅',
          badge: '2'
        }
      ]
    },

    promoter: {
      showLeftSidebar: true,
      showRightSidebar: false, // Promotor solo sidebar izquierdo
      headerType: 'public',
      leftSidebarItems: [
        {
          label: 'Dashboard',
          route: '/promoter/dashboard',
          icon: '📊'
        },
        {
          label: 'Gestión de Ofertas',
          route: '/promoter/jobs',
          icon: '💼',
          children: [
            { label: 'Mis Ofertas', route: '/promoter/jobs', icon: '💼' },
            { label: 'Crear Oferta', route: '/promoter/jobs/create', icon: '➕' },
            { label: 'Ofertas Archivadas', route: '/promoter/jobs/archived', icon: '📦' }
          ]
        },
        {
          label: 'Candidatos',
          route: '/promoter/candidates',
          icon: '👥',
          children: [
            { label: 'Todos los Candidatos', route: '/promoter/candidates', icon: '👥' },
            { label: 'Nuevas Postulaciones', route: '/promoter/candidates/new', icon: '📥', badge: '15' },
            { label: 'Favoritos', route: '/promoter/candidates/favorites', icon: '⭐' }
          ]
        },
        {
          label: 'Búsqueda de Talento',
          route: '/promoter/search',
          icon: '🔍'
        },
        {
          label: 'Reportes y Analíticas',
          route: '/promoter/analytics',
          icon: '📈'
        }
      ]
      // Promotor NO tiene rightSidebarItems
    },

    public: {
      showLeftSidebar: false,
      showRightSidebar: false, // Público sin sidebars
      headerType: 'public',
      leftSidebarItems: []
      // Público NO tiene rightSidebarItems
    }
  };

  /**
   * Obtiene el rol del usuario actual
   */
  getCurrentUserRole(): UserRole {
    const user = this.currentUser();
    if (!user) return 'public';

    // Mapear el rol del usuario a UserRole
    const roleMapping: Record<string, UserRole> = {
      'admin': 'admin',
      'student': 'student',
      'university_admin': 'university_admin',
      'promoter': 'promoter'
    };

    return roleMapping[user.rol_id] || 'public';
  }

  /**
   * Obtiene la configuración de layout para el usuario actual
   */
  getCurrentLayoutConfig(): LayoutConfig {
    const role = this.getCurrentUserRole();
    return this.roleConfigs[role];
  }

  /**
   * Obtiene el conteo de badges dinámico
   */
  getBadgeCount(badgeType: string): number {
    // Simulación de conteos dinámicos
    const counts: Record<string, number> = {
      'pending-users': 5,
      'pending-reports': 8,
      'new-opportunities': 7,
      'upcoming-events': 3,
      'projects-review': 8,
      'new-applications': 15,
      'notifications': 12,
      'messages': 4
    };

    return counts[badgeType] || 0;
  }
}
