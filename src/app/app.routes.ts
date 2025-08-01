import { Routes } from '@angular/router';
import { authGuard } from '@app/core/guards/user/auth.guard';
import { PublicLayoutComponent } from '@app/layouts/public-layout/public-layout.component';
import { LoginComponent } from '@features/public/login/login.component';

export const routes: Routes = [
  // Landing page como página principal
  {
    path: '',
    loadComponent: () =>
      import('./features/public/landing/landing.component').then(m => m.LandingComponent),
  },

  // Rutas públicas
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/public/register/type-register.component').then(
            m => m.TypeRegisterComponent,
          ),
      },
      {
        path: 'register/estudiante',
        loadComponent: () =>
          import('./features/student/register/student-register.component').then(
            m => m.StudentRegisterComponent,
          ),
      },
      {
        path: 'register/estudiante/step2', // Nueva ruta para el segundo paso
        loadComponent: () =>
          import('./features/student/register/student-register2.component').then(
            m => m.StudentRegister2Component,
          ),
      },
      {
        path: 'register/estudiante/step3', // Nueva ruta para el paso
        loadComponent: () =>
          import('./features/student/register/student-register3.component').then(
            m => m.StudentRegister3Component,
          ),
      },
      {
        path: 'register/estudiante/step4', // Nueva ruta para el paso
        loadComponent: () =>
          import('./features/student/register/student-register4.component').then(
            m => m.StudentRegister4Component,
          ),
      },
      {
        path: 'register/promotor',
        loadComponent: () =>
          import('./features/promoter/register/register-token.component').then(
            m => m.PromotorRegisterComponent,
          ),
      },
      {
        path: 'register/promotor/datos-personales',
        loadComponent: () =>
          import('./features/promoter/register/register-personalData.component').then(
            m => m.PromotorRegister2Component,
          ),
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
