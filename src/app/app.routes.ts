import { Routes } from '@angular/router';
import { authGuard } from '@app/core/guards/user/auth.guard';
import { PublicLayoutComponent } from '@app/layouts/public-layout/public-layout.component';
import { LoginComponent } from '@features/public/login/login.component';

export const routes: Routes = [
  // Redirección por defecto
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Rutas públicas
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/public/register/register.component').then(m => m.RegisterComponent),
      },
    ],
  },

  // Rutas privadas (protegidas por authGuard)
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
      },
      {
        path: 'admin-uni',
        loadChildren: () =>
          import('./features/admin-uni/admin-uni.routes').then(m => m.ADMIN_UNI_ROUTES),
      },
      {
        path: 'student',
        loadChildren: () => import('./features/student/student.routes').then(m => m.STUDENT_ROUTES),
      },
      {
        path: 'promoter',
        loadChildren: () =>
          import('./features/promoter/promoter.routes').then(m => m.PROMOTER_ROUTES),
      },
    ],
  },

  // Ruta para página no encontrada
  {
    path: '**',
    loadComponent: () =>
      import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
];
