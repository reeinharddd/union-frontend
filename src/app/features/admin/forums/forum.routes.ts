import { Routes } from '@angular/router';

export const FORUM_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./forum-list/forum-list.component').then(m => m.ForumListComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./forum-form/forum-form.component').then(m => m.ForumFormComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./forum-form/forum-form.component').then(m => m.ForumFormComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./forum-detail/forum-detail.component').then(m => m.ForumDetailComponent),
  },
];
