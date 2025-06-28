import { Routes } from '@angular/router';
import { authGuard } from './core/guards/user/auth.guard';
import { LoginComponent } from '@features/public/login/login.component';
import { PrivateLayoutComponent } from './layouts/private-layout/private-layout.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Public routes
  {
    path: '',
    component: PrivateLayoutComponent,
    children: [{ path: 'login', component: LoginComponent }],
  },
  // Private routes (to be defined later)
  {
    path: '',
    component: PrivateLayoutComponent,
    canActivate: [authGuard],
    children: [{ path: 'login', component: LoginComponent }],
  },
];
