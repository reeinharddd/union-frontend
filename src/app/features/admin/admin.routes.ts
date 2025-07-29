import { Routes } from '@angular/router';
import { authGuard } from '@app/core/guards/user/auth.guard';
import { roleGuard } from '@app/core/guards/user/role.guard';
import { AdminLayoutComponent } from '@app/layouts/admin-layout/admin-layout.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
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
      // {
      //   path: 'users',
      //   loadChildren: () => import('./users/users.routes').then(m => m.USERS_ROUTES),
      // },
      // {
      //   path: 'universities',
      //   loadChildren: () =>
      //     import('./universities/universities.routes').then(m => m.UNIVERSITIES_ROUTES),
      // },
      // {
      //   path: 'projects',
      //   loadChildren: () => import('./projects/projects.routes').then(m => m.PROJECTS_ROUTES),
      // },
      // {
      //   path: 'events',
      //   loadChildren: () => import('./events/events.routes').then(m => m.EVENTS_ROUTES),
      // },
      // {
      //   path: 'opportunities',
      //   loadChildren: () =>
      //     import('./opportunities/opportunities.routes').then(m => m.OPPORTUNITIES_ROUTES),
      // },
      // {
      //   path: 'reports',
      //   loadChildren: () => import('./reports/reports.routes').then(m => m.REPORTS_ROUTES),
      // },
      // {
      //   path: 'analytics',
      //   loadComponent: () =>
      //     import('./analytics/admin-analytics.component').then(m => m.AdminAnalyticsComponent),
      // },
    ],
  },
];
