import { Routes } from '@angular/router';
import { AdminLayoutComponent } from '@app/layouts/admin-layout/admin-layout.component';
import { roleGuard } from '@app/core/guards/user/role.guard';
import { Roles } from '@app/core/enums/roles';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [roleGuard([Roles.ADMIN.toLowerCase()])],
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full',
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./users/user-list/user-list.component').then(m => m.UserListComponent),
      },
      // Otras rutas de admin...
    ],
  },
];
