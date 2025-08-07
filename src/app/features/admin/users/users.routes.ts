// src/app/features/admin/users/users.routes.ts
import { Routes } from '@angular/router';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-users.component').then(m => m.AdminUsersComponent),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./create-user/create-user.component').then(m => m.UserFormComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./edit-user/edit-user.component').then(m => m.EditUserComponent),
  },
];
