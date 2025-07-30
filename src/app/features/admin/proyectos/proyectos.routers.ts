import { Routes } from '@angular/router';

export const PROYECTOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./proyectos-list/proyectos-list.component').then(m => m.ProyectosListComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./proyectos-form/proyectos-form.component').then(m => m.ProyectosFormComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./proyectos-form/proyectos-form.component').then(m => m.ProyectosFormComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./proyectos-detail/proyectos-detail.component').then(
        m => m.ProyectosDetailComponent,
      ),
  },
];