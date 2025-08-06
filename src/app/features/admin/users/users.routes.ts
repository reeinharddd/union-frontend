import { Routes } from '@angular/router';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-users.component').then(m => m.AdminUsersComponent),
  },
];
