import { Routes } from '@angular/router';

export const UNIVERSITY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./university-list/university-list.component').then(m => m.UniversityListComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./university-form/university-form.component').then(m => m.UniversityFormComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./university-form/university-form.component').then(m => m.UniversityFormComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./university-detail/university-detail.component').then(
        m => m.UniversityDetailComponent,
      ),
  },
];
