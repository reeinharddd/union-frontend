import { Routes } from '@angular/router';

export const UNIVERSITIES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./admin-universities.component').then(m => m.AdminUniversitiesComponent),
  },
];
