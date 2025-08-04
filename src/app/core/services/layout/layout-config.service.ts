import { Injectable, inject } from '@angular/core';
import { AuthService } from '../auth/auth.service';

export interface SidebarItem {
  label: string;
  icon: string;
  route?: string;
  color?: string;
  description?: string;
  badge?: {
    text: string;
    color: string;
  };
  children?: SidebarItem[];
}

export interface HeaderConfig {
  title: string;
  showSearch: boolean;
  searchPlaceholder?: string;
  actions?: SidebarItem[];
}

export interface RightSidebarSection {
  title: string;
  type: 'welcome' | 'quick-actions' | 'stats' | 'activity' | 'notifications' | 'events' | 'projects';
  items?: SidebarItem[];
  content?: {
    message?: string;
    timeOfDay?: boolean;
    stats?: Array<{ label: string; value: string; color: string; }>;
    activities?: Array<{ text: string; time: string; type: string; }>;
    notifications?: Array<{ text: string; time: string; type: string; }>;
  };
}

@Injectable({
  providedIn: 'root'
})
export class LayoutConfigService {
  private authService = inject(AuthService);

  private configurations = {
    admin: {
      leftSidebar: [
        {
          label: 'Dashboard',
          icon: 'dashboard',
          route: '/admin/dashboard',
          color: 'text-blue-500'
        },
        {
          label: 'Usuarios',
          icon: 'people',
          route: '/admin/users',
          color: 'text-green-500',
          badge: { text: 'Nuevo', color: 'bg-green-100 text-green-800' }
        },
        {
          label: 'Universidades',
          icon: 'school',
          route: '/admin/universities',
          color: 'text-purple-500'
        },
        {
          label: 'Respaldos',
          icon: 'backup',
          route: '/admin/backups',
          color: 'text-orange-500'
        },
        {
          label: 'Reportes',
          icon: 'bar_chart',
          route: '/admin/reports',
          color: 'text-red-500'
        }
      ],
      rightSidebar: [
        {
          title: 'Bienvenido Administrador',
          type: 'welcome' as const,
          content: {
            message: 'Gestiona la plataforma de manera eficiente',
            timeOfDay: true
          }
        },
        {
          title: 'Acciones Rápidas',
          type: 'quick-actions' as const,
          items: [
            {
              label: 'Crear Respaldo',
              icon: 'backup',
              route: '/admin/backups/create',
              color: 'text-blue-500'
            },
            {
              label: 'Verificar Usuarios',
              icon: 'verified_user',
              route: '/admin/users/pending',
              color: 'text-green-500'
            },
            {
              label: 'Ver Reportes Urgentes',
              icon: 'priority_high',
              route: '/admin/reports/urgent',
              color: 'text-red-500',
              badge: { text: '3', color: 'bg-red-100 text-red-800' }
            }
          ]
        },
        {
          title: 'Estadísticas en Vivo',
          type: 'stats' as const,
          content: {
            stats: [
              { label: 'Usuarios Activos', value: '1,234', color: 'text-green-600' },
              { label: 'Proyectos Activos', value: '89', color: 'text-blue-600' },
              { label: 'Reportes Pendientes', value: '12', color: 'text-orange-600' }
            ]
          }
        },
        {
          title: 'Actividad Reciente',
          type: 'activity' as const,
          content: {
            activities: [
              { text: 'Usuario Ana Torres registrado', time: '2 min ago', type: 'user' },
              { text: 'Proyecto "UniApp" verificado', time: '15 min ago', type: 'project' },
              { text: 'Reporte de contenido inapropiado', time: '1 hour ago', type: 'report' }
            ]
          }
        }
      ],
      header: {
        title: 'Administración General',
        showSearch: true,
        searchPlaceholder: 'Buscar usuarios, proyectos, reportes...'
      }
    },
    student: {
      leftSidebar: [
        {
          label: 'Dashboard',
          icon: 'dashboard',
          route: '/student/dashboard',
          color: 'text-blue-500'
        },
        {
          label: 'Mi Perfil',
          icon: 'person',
          route: '/student/profile',
          color: 'text-indigo-500'
        },
        {
          label: 'Proyectos',
          icon: 'work',
          route: '/student/projects',
          color: 'text-green-500',
          badge: { text: '3', color: 'bg-green-100 text-green-800' }
        },
        {
          label: 'Foros',
          icon: 'forum',
          route: '/student/forums',
          color: 'text-orange-500'
        },
        {
          label: 'Eventos',
          icon: 'event',
          route: '/student/events',
          color: 'text-purple-500'
        },
        {
          label: 'Oportunidades',
          icon: 'work_outline',
          route: '/student/opportunities',
          color: 'text-teal-500'
        }
      ],
      rightSidebar: [
        {
          title: 'Bienvenido Estudiante',
          type: 'welcome' as const,
          content: {
            message: 'Explora, aprende y colabora',
            timeOfDay: true
          }
        },
        {
          title: 'Proyectos Activos',
          type: 'projects' as const,
          items: [
            {
              label: 'App Móvil UTT',
              icon: 'phone_android',
              route: '/student/projects/1',
              color: 'text-blue-500',
              description: 'Progreso: 75%',
              badge: { text: 'En desarrollo', color: 'bg-blue-100 text-blue-800' }
            },
            {
              label: 'Sistema IoT',
              icon: 'sensors',
              route: '/student/projects/2',
              color: 'text-green-500',
              description: 'Progreso: 45%',
              badge: { text: 'Planificación', color: 'bg-yellow-100 text-yellow-800' }
            },
            {
              label: 'Web Colaborativa',
              icon: 'web',
              route: '/student/projects/3',
              color: 'text-purple-500',
              description: 'Progreso: 90%',
              badge: { text: 'Finalizando', color: 'bg-green-100 text-green-800' }
            }
          ]
        },
        {
          title: 'Foros Populares',
          type: 'activity' as const,
          items: [
            {
              label: 'Desarrollo Web',
              icon: 'code',
              route: '/student/forums/web-dev',
              color: 'text-blue-500',
              description: '234 mensajes hoy'
            },
            {
              label: 'Machine Learning',
              icon: 'psychology',
              route: '/student/forums/ml',
              color: 'text-indigo-500',
              description: '156 mensajes hoy'
            },
            {
              label: 'Emprendimiento',
              icon: 'trending_up',
              route: '/student/forums/entrepreneurship',
              color: 'text-green-500',
              description: '89 mensajes hoy'
            }
          ]
        },
        {
          title: 'Próximos Eventos',
          type: 'events' as const,
          items: [
            {
              label: 'Workshop Angular 17',
              icon: 'event',
              route: '/student/events/1',
              color: 'text-red-500',
              description: 'Mañana 10:00 AM'
            },
            {
              label: 'Hackathon UTT',
              icon: 'code',
              route: '/student/events/2',
              color: 'text-blue-500',
              description: 'Viernes 15 Nov'
            }
          ]
        },
        {
          title: 'Notificaciones',
          type: 'notifications' as const,
          content: {
            notifications: [
              { text: 'Nueva oportunidad de prácticas en TechCorp', time: '1 hour ago', type: 'opportunity' },
              { text: 'Comentario en tu proyecto "App Móvil UTT"', time: '3 hours ago', type: 'comment' },
              { text: 'Evento "Workshop Angular" mañana', time: '1 day ago', type: 'event' }
            ]
          }
        }
      ],
      header: {
        title: 'Portal Estudiantil',
        showSearch: true,
        searchPlaceholder: 'Buscar proyectos, foros, eventos...'
      }
    },
    university_admin: {
      leftSidebar: [
        {
          label: 'Dashboard',
          icon: 'dashboard',
          route: '/admin-uni/dashboard',
          color: 'text-blue-500'
        },
        {
          label: 'Estudiantes',
          icon: 'school',
          route: '/admin-uni/students',
          color: 'text-green-500'
        },
        {
          label: 'Proyectos',
          icon: 'work',
          route: '/admin-uni/projects',
          color: 'text-purple-500',
          badge: { text: '5 Pendientes', color: 'bg-yellow-100 text-yellow-800' }
        },
        {
          label: 'Eventos',
          icon: 'event',
          route: '/admin-uni/events',
          color: 'text-orange-500'
        },
        {
          label: 'Oportunidades',
          icon: 'work_outline',
          route: '/admin-uni/opportunities',
          color: 'text-teal-500'
        }
      ],
      rightSidebar: [
        {
          title: 'Bienvenido Admin Universitario',
          type: 'welcome' as const,
          content: {
            message: 'Gestiona tu institución académica',
            timeOfDay: true
          }
        },
        {
          title: 'Acciones Pendientes',
          type: 'quick-actions' as const,
          items: [
            {
              label: 'Verificar Proyectos',
              icon: 'fact_check',
              route: '/admin-uni/projects/pending',
              color: 'text-orange-500',
              badge: { text: '5', color: 'bg-orange-100 text-orange-800' }
            },
            {
              label: 'Aprobar Estudiantes',
              icon: 'how_to_reg',
              route: '/admin-uni/students/pending',
              color: 'text-blue-500',
              badge: { text: '12', color: 'bg-blue-100 text-blue-800' }
            },
            {
              label: 'Revisar Reportes',
              icon: 'report',
              route: '/admin-uni/reports',
              color: 'text-red-500',
              badge: { text: '2', color: 'bg-red-100 text-red-800' }
            }
          ]
        },
        {
          title: 'Estadísticas Rápidas',
          type: 'stats' as const,
          content: {
            stats: [
              { label: 'Estudiantes Activos', value: '456', color: 'text-green-600' },
              { label: 'Proyectos en Curso', value: '23', color: 'text-blue-600' },
              { label: 'Eventos este Mes', value: '8', color: 'text-purple-600' }
            ]
          }
        }
      ],
      header: {
        title: 'Administración Universitaria',
        showSearch: true,
        searchPlaceholder: 'Buscar estudiantes, proyectos...'
      }
    },
    promoter: {
      leftSidebar: [
        {
          label: 'Dashboard',
          icon: 'dashboard',
          route: '/promoter/dashboard',
          color: 'text-blue-500'
        },
        {
          label: 'Oportunidades',
          icon: 'work',
          route: '/promoter/opportunities',
          color: 'text-green-500'
        },
        {
          label: 'Candidatos',
          icon: 'people',
          route: '/promoter/candidates',
          color: 'text-purple-500'
        },
        {
          label: 'Mi Perfil',
          icon: 'business',
          route: '/promoter/profile',
          color: 'text-indigo-500'
        }
      ],
      rightSidebar: [
        {
          title: 'Bienvenido Promotor',
          type: 'welcome' as const,
          content: {
            message: 'Encuentra el talento que necesitas',
            timeOfDay: true
          }
        },
        {
          title: 'Métricas',
          type: 'stats' as const,
          content: {
            stats: [
              { label: 'Postulaciones Activas', value: '34', color: 'text-green-600' },
              { label: 'Candidatos Nuevos', value: '12', color: 'text-blue-600' },
              { label: 'Entrevistas Programadas', value: '6', color: 'text-orange-600' }
            ]
          }
        },
        {
          title: 'Candidatos Destacados',
          type: 'activity' as const,
          items: [
            {
              label: 'Ana Torres',
              icon: 'person',
              route: '/promoter/candidates/1',
              color: 'text-blue-500',
              description: 'Ing. Sistemas - UTT'
            },
            {
              label: 'Luis Pérez',
              icon: 'person',
              route: '/promoter/candidates/2',
              color: 'text-green-500',
              description: 'Ing. Software - UABC'
            },
            {
              label: 'María García',
              icon: 'person',
              route: '/promoter/candidates/3',
              color: 'text-purple-500',
              description: 'Ing. Industrial - CETYS'
            }
          ]
        }
      ],
      header: {
        title: 'Portal Empresarial',
        showSearch: true,
        searchPlaceholder: 'Buscar candidatos, habilidades...'
      }
    }
  };

  getCurrentLayoutConfig() {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      return this.configurations.student; // Default fallback
    }

    const roleKey = currentUser.rol_id === 1 ? 'admin' :
                   currentUser.rol_id === 2 ? 'student' :
                   currentUser.rol_id === 3 ? 'university_admin' :
                   currentUser.rol_id === 4 ? 'promoter' : 'student';

    return this.configurations[roleKey as keyof typeof this.configurations];
  }

  getLeftSidebarItems(): SidebarItem[] {
    return this.getCurrentLayoutConfig().leftSidebar;
  }

  getRightSidebarSections(): RightSidebarSection[] {
    return this.getCurrentLayoutConfig().rightSidebar;
  }

  getHeaderConfig(): HeaderConfig {
    return this.getCurrentLayoutConfig().header;
  }

  getCurrentUserRole(): string {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      return 'student'; // Default fallback
    }

    const roleKey = currentUser.rol_id === 1 ? 'admin' :
                   currentUser.rol_id === 2 ? 'student' :
                   currentUser.rol_id === 3 ? 'university_admin' :
                   currentUser.rol_id === 4 ? 'promoter' : 'student';

    return roleKey;
  }

  hasPermission(_item: SidebarItem): boolean {
    // Para ahora, todos los items son visibles
    // En el futuro se puede implementar lógica de permisos más compleja
    return true;
  }
}
