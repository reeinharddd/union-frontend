import { Routes } from '@angular/router';
import { AdminLayoutComponent } from '@app/layouts/admin-layout/admin-layout.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      // Dashboard
      // {
      //   path: '',
      //   loadComponent: () => import('./dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      // },

      // Gestión de usuarios
      {
        path: 'users',
        loadComponent: () => import('./users/user-list/user-list.component').then(m => m.UserListComponent)
      },
      // {
      //   path: 'users/new',
      //   loadComponent: () => import('./users/user-form/user-form.component').then(m => m.UserFormComponent)
      // },
      // {
      //   path: 'users/:id',
      //   loadComponent: () => import('./users/user-detail/user-detail.component').then(m => m.UserDetailComponent)
      // },
      // {
      //   path: 'users/:id/edit',
      //   loadComponent: () => import('./users/user-form/user-form.component').then(m => m.UserFormComponent)
      // },

      // // Configuraciones
      // {
      //   path: 'settings',
      //   loadChildren: () => import('./settings/settings.routes').then(m => m.SETTINGS_ROUTES)
      // },

      // // Reportes
      // {
      //   path: 'reports',
      //   loadChildren: () => import('./reports/reports.routes').then(m => m.REPORTS_ROUTES)
      // }
    ]
  }
];
