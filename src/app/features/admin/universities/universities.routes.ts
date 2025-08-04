import { Routes } from '@angular/router';

export const UNIVERSITIES_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    loadComponent: () =>
      import('./universities-list/universities-list.component').then(
        m => m.UniversitiesListComponent,
      ),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./universities-form/universities-form.component').then(
        m => m.UniversitiesFormComponent,
      ),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./universities-form/universities-form.component').then(
        m => m.UniversitiesFormComponent,
      ),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./universities-detail/universities-detail.component').then(
        m => m.UniversitiesDetailComponent,
      ),
  },
];
