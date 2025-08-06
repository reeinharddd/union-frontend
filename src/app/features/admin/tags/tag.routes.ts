import { Routes } from '@angular/router';

export const TAGS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-tags.component').then(m => m.AdminTagsComponent),
  },
];
