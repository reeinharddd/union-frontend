import { Routes } from '@angular/router';

export const OPPORTUNITY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./admin-opportunities.component').then(m => m.AdminOpportunitiesComponent),
  },
];
