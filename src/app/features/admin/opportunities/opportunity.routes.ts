import { Routes } from '@angular/router';

export const OPPORTUNITY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./opportunity-list/opportunity-list.component').then(m => m.OpportunityListComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./opportunity-form/opportunity-form.component').then(m => m.OpportunityFormComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./opportunity-form/opportunity-form.component').then(m => m.OpportunityFormComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./opportunity-detail/opportunity-detail.component').then(
        m => m.OpportunityDetailComponent,
      ),
  },
];
