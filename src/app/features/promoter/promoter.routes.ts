import { Routes } from '@angular/router';
import { authGuard } from '@app/core/guards/user/auth.guard';
import { roleGuard } from '@app/core/guards/user/role.guard';
import { DynamicLayoutComponent } from '@app/layouts/dynamic-layout/dynamic-layout.component';

export const PROMOTER_ROUTES: Routes = [
  {
    path: '',
    component: DynamicLayoutComponent,
    canActivate: [authGuard, roleGuard([3])], // ✅ Promoter = 3
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/promoter-dashboard.component').then(
            m => m.PromoterDashboardComponent,
          ),
      },
      {
        path: 'opportunities',
        loadComponent: () =>
          import('./opportunities/opportunities.component').then(m => m.OpportunitiesComponent),
      },
      {
        path: 'opportunities/create',
        loadComponent: () =>
          import('./opportunities/add-opportunities/add-opportunities.component').then(
            m => m.NuevaOportunidadComponent,
          ),
      },
      {
        path: 'candidates',
        loadComponent: () =>
          import('./candidates/postulation-candidate.component').then(
            m => m.PostulationCandidateComponent,
          ),
      },
      {
        path: 'opportunity/edit/:id',
        loadComponent: () =>
          import('./opportunities/eddit/edit-opportunity.component').then(
            m => m.EditarOportunidadComponent,
          ),
      },
      {
        path: 'postulation',
        loadComponent: () =>
          import('./postulation/postulation.component').then(m => m.PostulationComponent),
      },
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
