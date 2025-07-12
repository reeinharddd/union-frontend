import { Routes } from '@angular/router';
import { AdminLayoutComponent } from '@app/layouts/admin-layout/admin-layout.component';
import { roleGuard } from '@app/core/guards/user/role.guard';
import { Roles } from '@app/core/enums/roles';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [roleGuard([Roles.ADMIN])],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
      },
      {
        path: 'users',
        loadChildren: () => import('./users/user.routes').then(m => m.USER_ROUTES),
      },
      {
        path: 'universities',
        loadChildren: () =>
          import('./universities/university.routes').then(m => m.UNIVERSITY_ROUTES),
      },
      {
        path: 'events',
        loadChildren: () => import('./events/event.routes').then(m => m.EVENT_ROUTES),
      },
      {
        path: 'forums',
        loadChildren: () => import('./forums/forum.routes').then(m => m.FORUM_ROUTES),
      },
      {
        path: 'opportunities',
        loadChildren: () =>
          import('./opportunities/opportunity.routes').then(m => m.OPPORTUNITY_ROUTES),
      },
      {
        path: 'tags',
        loadChildren: () => import('./tags/tag.routes').then(m => m.TAG_ROUTES),
      },

      {
        path: 'conversations',
        loadChildren: () =>
          import('./conversations/conversation.routes').then(m => m.CONVERSATION_ROUTES),
      },
      {
        path: 'roles',
        loadChildren: () => import('./roles/role.routes').then(m => m.ROLE_ROUTES),
      },
    ],
  },
];
