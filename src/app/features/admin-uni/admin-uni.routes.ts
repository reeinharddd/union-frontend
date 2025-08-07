import { Routes } from '@angular/router';
import { authGuard } from '@app/core/guards/user/auth.guard';
import { roleGuard } from '@app/core/guards/user/role.guard';
import { DynamicLayoutComponent } from '@app/layouts/dynamic-layout/dynamic-layout.component';

export const ADMIN_UNI_ROUTES: Routes = [
  {
    path: '',
    component: DynamicLayoutComponent,
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
      {
        path: 'students',
        loadComponent: () =>
          import('./students/admin-uni-students.component').then(m => m.AdminUniStudentsComponent),
      },
      {
        path: 'projects',
        loadComponent: () => import('./projects/projects.component').then(m => m.ProjectsComponent),
      },
      {
        path: 'project-detail/:id',
        loadComponent: () =>
          import('./projects/project-detail/project-detail.component').then(
            m => m.ProjectDetailComponent,
          ),
      },
      {
        path: 'events',
        loadComponent: () => import('./events/events.component').then(m => m.EventsComponent),
      },
      // {
      //   path: 'reports',
      //   loadComponent: () =>
      //     import('./reports/admin-uni-reports.component').then(m => m.AdminUniReportsComponent),
      // },
    ],
  },
];
