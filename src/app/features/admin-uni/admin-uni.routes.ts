import { Routes } from '@angular/router';
import { authGuard } from '@app/core/guards/user/auth.guard';
import { roleGuard } from '@app/core/guards/user/role.guard';

export const ADMIN_UNI_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout/admin-uni-layout.component').then(m => m.AdminUniLayoutComponent),
    canActivate: [authGuard, roleGuard([9])], // ✅ Admin Universitario = 9
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/admin-uni-dashboard.component').then(
            m => m.AdminUniDashboardComponent,
          ),
      },
      // {
      //   path: 'students',
      //   loadComponent: () =>
      //     import('./students/admin-uni-students.component').then(m => m.AdminUniStudentsComponent),
      // },
      // {
      //   path: 'projects',
      //   loadComponent: () =>
      //     import('./projects/admin-uni-projects.component').then(m => m.AdminUniProjectsComponent),
      // },
      // {
      //   path: 'events',
      //   loadComponent: () =>
      //     import('./events/admin-uni-events.component').then(m => m.AdminUniEventsComponent),
      // },
      // {
      //   path: 'reports',
      //   loadComponent: () =>
      //     import('./reports/admin-uni-reports.component').then(m => m.AdminUniReportsComponent),
      // },
    ],
  },
];
