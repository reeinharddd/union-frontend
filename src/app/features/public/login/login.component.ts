import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class LoginComponent {
  router = inject(Router);

  login() {
    // Aquí iría la lógica real de autenticación. Por ahora, simulamos éxito:
    const email = (document.getElementById('email') as HTMLInputElement)?.value;
    const password = (document.getElementById('password') as HTMLInputElement)?.value;

    if (email && password) {
      // Puedes verificar con un backend aquí
      this.router.navigate(['/admin/users']);
    } else {
      alert('Please enter email and password');
    }
  }
}
