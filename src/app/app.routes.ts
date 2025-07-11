import { Routes } from '@angular/router';
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
      // Otras rutas públicas (registro, recuperación de contraseña, etc.)
      // {
      //   path: 'register',
      //   loadComponent: () =>
      //     import('@features/public/register/register.component').then(m => m.RegisterComponent),
      // },
      // {
      //   path: 'forgot-password',
      //   loadComponent: () =>
      //     import('@features/public/forgot-password/forgot-password.component').then(
      //       m => m.ForgotPasswordComponent,
      //     ),
      // },
      // {
      //   path: 'access-denied',
      //   loadComponent: () =>
      //     import('./shared/components/access-denied/access-denied.component').then(
      //       m => m.AccessDeniedComponent,
      //     ),
      // },
    ],
  },

  // Rutas privadas (protegidas por authGuard)
  {
    path: '',
    canActivate: [],
    children: [
      // Lazy loading de módulos/características
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
