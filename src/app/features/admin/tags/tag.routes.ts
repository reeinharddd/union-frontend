import { Routes } from '@angular/router';

export const TAG_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./tag-list/tag-list.component').then(m => m.TagListComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./tag-form/tag-form.component').then(m => m.TagFormComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./tag-form/tag-form.component').then(m => m.TagFormComponent),
  },
];
