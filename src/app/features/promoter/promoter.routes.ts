import { Routes } from '@angular/router';
import { AdminLayoutComponent } from '@app/layouts/admin-layout/admin-layout.component';


export const PROMOTER_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      // Dashboard promotor
      // {
      //   path: '',
      //   loadComponent: () => import('./dashboard/promoter-dashboard.component').then(m => m.PromoterDashboardComponent)
      // },

      // // Gestión de prospectos
      // {
      //   path: 'prospects',
      //   loadComponent: () => import('./prospects/prospect-list/prospect-list.component').then(m => m.ProspectListComponent)
      // },
      // {
      //   path: 'prospects/new',
      //   loadComponent: () => import('./prospects/prospect-form/prospect-form.component').then(m => m.ProspectFormComponent)
      // },
      // {
      //   path: 'prospects/:id',
      //   loadComponent: () => import('./prospects/prospect-detail/prospect-detail.component').then(m => m.ProspectDetailComponent)
      // },
      // {
      //   path: 'prospects/:id/edit',
      //   loadComponent: () => import('./prospects/prospect-form/prospect-form.component').then(m => m.ProspectFormComponent)
      // },

      // // Reportes de actividad
      // {
      //   path: 'reports',
      //   loadComponent: () => import('./reports/activity-report/activity-report.component').then(m => m.ActivityReportComponent)
      // },

      // // Perfil del promotor
      // {
      //   path: 'profile',
      //   loadComponent: () => import('./profile/promoter-profile/promoter-profile.component').then(m => m.PromoterProfileComponent)
      // }
    ]
  }
];
