import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginRequest } from '@app/core/models/user/login-request';
import { LoginService } from '@app/core/services/user/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class LoginComponent {
  loginService = inject(LoginService);

  // Variables para manejar estados del formulario
  loginError = false;
  isLoading = false;
  errorMessage = '';

  login() {
    this.loginError = false;
    this.isLoading = true;

    const email = (document.getElementById('email') as HTMLInputElement)?.value;
    const password = (document.getElementById('password') as HTMLInputElement)?.value;

    if (email && password) {
      const loginRequest: LoginRequest = { email, password };
      const isValid = this.loginService.userValidation(loginRequest);

      if (isValid) {
        // Redirección dinámica según el rol
        this.loginService.navigateByRole();
      } else {
        this.loginError = true;
        this.errorMessage = 'Credenciales inválidas. Por favor intenta de nuevo.';
      }
    } else {
      this.loginError = true;
      this.errorMessage = 'Por favor ingresa tu email y contraseña';
    }

    this.isLoading = false;
  }
}
