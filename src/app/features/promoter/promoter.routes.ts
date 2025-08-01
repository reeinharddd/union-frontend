import { Routes } from '@angular/router';
import { authGuard } from '@app/core/guards/user/auth.guard';
import { roleGuard } from '@app/core/guards/user/role.guard';

export const PROMOTER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../../layouts/promoter-layout/promoter-layout.component').then(
        m => m.PromoterLayoutComponent, // Ensure this matches the component name in the layout file
      ),
    canActivate: [authGuard, roleGuard([3])], // ✅ Estudiante = 2
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/promoter-dashboard.component').then(
            m => m.PromoterDashboardComponent,
          ),
      },
      // {
      //   path: 'dashboard',
      //   loadComponent: () =>
      //     import('./dashboard/promoter-dashboard.component').then(
      //       m => m.PromoterDashboardComponent,
      //     ),
      // },
      // {
      //   path: 'events',
      //   loadComponent: () =>
      //     import('./events/promoter-events.component').then(m => m.PromoterEventsComponent),
      // },
      // {
      //   path: 'job-offers',
      //   loadComponent: () =>
      //     import('./job-offers/promoter-job-offers.component').then(
      //       m => m.PromoterJobOffersComponent,
      //     ),
      // },
      // {
      //   path: 'analytics',
      //   loadComponent: () =>
      //     import('./analytics/promoter-analytics.component').then(
      //       m => m.PromoterAnalyticsComponent,
      //     ),
      // },
    ],
  },
];
