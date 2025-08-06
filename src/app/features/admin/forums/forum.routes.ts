import { Routes } from '@angular/router';

export const FORUM_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-forums.component').then(m => m.AdminForumsComponent),
  },
];
