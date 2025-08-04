import { Routes } from '@angular/router';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    loadComponent: () =>
      import('./users-list/users-list.component').then(m => m.UsersListComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./users-form/users-form.component').then(m => m.UsersFormComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./users-form/users-form.component').then(m => m.UsersFormComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./users-detail/users-detail.component').then(m => m.UsersDetailComponent),
  },
];
