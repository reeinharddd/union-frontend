import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-type-register',
  templateUrl: './type-register.component.html',
  styleUrls: ['./type-register.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink], // Añade los módulos necesarios
})
export class TypeRegisterComponent {
  constructor(private router: Router) {}

  navigateToRegister(type: string) {
    this.router.navigate(['/register', type]);
  }
}
