import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-type-register',
  templateUrl: './type-register.component.html',
  styleUrls: ['./type-register.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink], // Añade los módulos necesarios
})
export class TypeRegisterComponent {
  private readonly router = inject(Router);

  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  navigateToRegister(type: string): void {
    this.router.navigate(['/register', type]);
  }
}
