import { Routes } from '@angular/router';
import { authGuard } from '@app/core/guards/user/auth.guard';
import { roleGuard } from '@app/core/guards/user/role.guard';
import { DynamicLayoutComponent } from '@app/layouts/dynamic-layout/dynamic-layout.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: DynamicLayoutComponent,
    canActivate: [authGuard, roleGuard([1])], // ✅ Admin = 1
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
      },
      {
        path: 'backups',
        loadComponent: () =>
          import('./backups-admin/backups-admin.component').then(m => m.BackupsAdminComponent),
      },
      {
        path: 'users',
        loadChildren: () => import('./users/users.routes').then(m => m.USERS_ROUTES),
      },
      {
        path: 'tags',
        loadChildren: () => import('./tags/tag.routes').then(m => m.TAGS_ROUTES),
      },
      {
        path: 'universities',
        loadChildren: () =>
          import('./universities/universities.routes').then(m => m.UNIVERSITIES_ROUTES),
      },
      {
        path: 'proyectos',
        loadChildren: () => import('./proyectos/proyectos.routes').then(m => m.PROYECTOS_ROUTES),
      },
      {
        path: 'eventos',
        loadChildren: () => import('./events/event.routes').then(m => m.EVENTS_ROUTES),
      },
      {
        path: 'opportunities',
        loadChildren: () =>
          import('./opportunities/opportunity.routes').then(m => m.OPPORTUNITY_ROUTES),
      },
      {
        path: 'foros',
        loadChildren: () => import('./forums/forum.routes').then(m => m.FORUM_ROUTES),
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/reports.routes').then(m => m.REPORTS_ROUTES),
      },
      {
        path: 'conversations',
        loadChildren: () =>
          import('./conversations/conversation.routes').then(m => m.CONVERSATION_ROUTES),
      },
      {
        path: 'roles',
        loadComponent: () =>
          import('./roles/admin-roles.component').then(m => m.AdminRolesComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./profile/admin-profile.component').then(m => m.AdminProfileComponent),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./settings/admin-settings.component').then(m => m.AdminSettingsComponent),
      },
    ],
  },
];
