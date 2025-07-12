import { Injectable, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Roles } from '../../enums/roles';
import { AuthService } from '../auth/auth.service';

export interface NavigationItem {
  label: string;
  icon: string;
  route: string;
  badge?: string;
  children?: NavigationItem[];
  permission?: string[];
}

type NavigationConfig = {
  [K in keyof typeof Roles]: NavigationItem[];
};

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private readonly navigationConfig: NavigationConfig = {
    ADMIN: [ // ✅ Cambiado de [Roles.ADMIN] a ADMIN
      {
        label: 'Dashboard',
        icon: 'home',
        route: '/admin/dashboard'
      },
      {
        label: 'Gestión de Usuarios',
        icon: 'users',
        route: '/admin/users',
        children: [
          { label: 'Lista de Usuarios', icon: 'list', route: '/admin/users' },
          { label: 'Nuevo Usuario', icon: 'user-plus', route: '/admin/users/new' },
          { label: 'Roles y Permisos', icon: 'shield', route: '/admin/roles' }
        ]
      },
      {
        label: 'Universidades',
        icon: 'building',
        route: '/admin/universities',
        children: [
          { label: 'Lista de Universidades', icon: 'list', route: '/admin/universities' },
          { label: 'Nueva Universidad', icon: 'plus', route: '/admin/universities/new' }
        ]
      },
      {
        label: 'Eventos',
        icon: 'calendar',
        route: '/admin/events',
        children: [
          { label: 'Todos los Eventos', icon: 'list', route: '/admin/events' },
          { label: 'Crear Evento', icon: 'plus', route: '/admin/events/new' },
          { label: 'Asistencias', icon: 'check-circle', route: '/admin/events/attendances' }
        ]
      },
      {
        label: 'Foros',
        icon: 'message-square',
        route: '/admin/forums',
        children: [
          { label: 'Lista de Foros', icon: 'list', route: '/admin/forums' },
          { label: 'Nuevo Foro', icon: 'plus', route: '/admin/forums/new' }
        ]
      },
      {
        label: 'Oportunidades',
        icon: 'star',
        route: '/admin/opportunities',
        children: [
          { label: 'Lista de Oportunidades', icon: 'list', route: '/admin/opportunities' },
          { label: 'Nueva Oportunidad', icon: 'plus', route: '/admin/opportunities/new' }
        ]
      },
      {
        label: 'Tags',
        icon: 'tag',
        route: '/admin/tags'
      },
      {
        label: 'Conversaciones',
        icon: 'message-circle',
        route: '/admin/conversations'
      }
    ],
    ADMIN_UNI: [
      {
        label: 'Dashboard Universitario',
        icon: 'home',
        route: '/admin-uni/dashboard'
      }
    ],
    PROMOTER: [
      {
        label: 'Dashboard Promotor',
        icon: 'home',
        route: '/promoter/dashboard'
      }
    ],
    USER: [
      {
        label: 'Mi Dashboard',
        icon: 'home',
        route: '/student/dashboard'
      }
    ]
  };

  readonly currentNavigation = computed(() => {
    const userRole = this.authService.userRole();
    console.log('🧭 NavigationService - Current role:', userRole);

    if (!userRole) return [];

    // Convertir a mayúsculas para buscar en el config
    const roleKey = userRole.toUpperCase() as keyof typeof Roles;
    const navigation = this.navigationConfig[roleKey] || [];

    console.log('🗺️ NavigationService - Found navigation:', navigation.length, 'items');
    return navigation;
  });

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
