import { Routes } from '@angular/router';

export const ROLE_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'user-roles',
    pathMatch: 'full',
  },
  {
    path: 'user-roles',
    loadComponent: () =>
      import('./user-role-list/user-role-list.component').then(m => m.UserRoleListComponent),
  },
  {
    path: 'user-roles/new',
    loadComponent: () =>
      import('./user-role-form/user-role-form.component').then(m => m.UserRoleFormComponent),
  },
  {
    path: 'user-roles/:id/edit',
    loadComponent: () =>
      import('./user-role-form/user-role-form.component').then(m => m.UserRoleFormComponent),
  },
  {
    path: 'project-roles',
    loadComponent: () =>
      import('./project-role-list/project-role-list.component').then(
        m => m.ProjectRoleListComponent,
      ),
  },
  {
    path: 'project-roles/new',
    loadComponent: () =>
      import('./project-role-form/project-role-form.component').then(
        m => m.ProjectRoleFormComponent,
      ),
  },
  {
    path: 'project-roles/:id/edit',
    loadComponent: () =>
      import('./project-role-form/project-role-form.component').then(
        m => m.ProjectRoleFormComponent,
      ),
  },
];
