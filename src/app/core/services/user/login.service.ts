import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Roles } from '@app/core/enums/roles';
import { LoginRequest } from '@app/core/models/user/login-request';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  router = inject(Router);
  // Mapa de rutas por rol
  private roleRoutes = {
    [Roles.ADMIN.toLowerCase()]: '/admin/users',
    [Roles.ADMIN_UNI.toLowerCase()]: '/admin-uni',
    [Roles.PROMOTER.toLowerCase()]: '/promoter',
    [Roles.STUDENTS.toLowerCase()]: '/student',
  };

  userValidation(loginRequest: LoginRequest): boolean {
    localStorage.setItem('auth_token', 'some_token_value');
    let isValid = false;
    let userRole = '';

    switch (loginRequest.email) {
      case 'student':
        userRole = Roles.STUDENTS.toLowerCase();
        isValid = loginRequest.password === 'password';
        break;
      case 'admin':
        userRole = Roles.ADMIN.toLowerCase();
        isValid = loginRequest.password === 'adminPassword';
        break;
      case 'promoter':
        userRole = Roles.PROMOTER.toLowerCase();
        isValid = loginRequest.password === 'promoterPassword';
        break;
      case 'admin_uni':
        userRole = Roles.ADMIN_UNI.toLowerCase();
        isValid = loginRequest.password === 'adminUniversityPassword';
        break;
      default:
        isValid = false;
        break;
    }

    if (isValid) {
      localStorage.setItem('user_role', userRole);
      console.log(`Validating ${userRole} credentials...`);
    } else {
      // Limpiar datos de sesión en caso de credenciales inválidas
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_role');
    }

    return isValid;
  }

  // Método para navegar según el rol
  navigateByRole(): void {
    const userRole = localStorage.getItem('user_role');
    if (userRole && this.roleRoutes[userRole]) {
      this.router.navigate([this.roleRoutes[userRole]]);
    } else {
      // Si no hay un rol válido, redirigir a login
      this.router.navigate(['/login']);
    }
  }
}
