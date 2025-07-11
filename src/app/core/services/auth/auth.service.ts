import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { Roles } from '../../enums/roles';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../../models/auth/auth.interface';
import { ApiClientService } from '../base/api-client.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiClient = inject(ApiClientService);
  private readonly tokenService = inject(TokenService);
  private readonly router = inject(Router);

  private currentUserSignal = signal<User | null>(null);

  readonly currentUser = computed(() => this.currentUserSignal());
  readonly isAuthenticated = computed(() => this.tokenService.isAuthenticated());
  readonly userRole = computed(() => this.tokenService.userRole());

  private readonly roleRoutes = {
    [Roles.ADMIN.toLowerCase()]: '/admin/users',
    [Roles.ADMIN_UNI.toLowerCase()]: '/admin-uni',
    [Roles.PROMOTER.toLowerCase()]: '/promoter',
    [Roles.STUDENTS.toLowerCase()]: '/student',
  };

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials)
      .pipe(
        tap(response => {
          this.setAuthData(response);
        })
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, userData)
      .pipe(
        tap(response => {
          this.setAuthData(response);
        })
      );
  }

  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  navigateByRole(): void {
    const userRole = this.tokenService.getUserRole();
    if (userRole && this.roleRoutes[userRole]) {
      this.router.navigate([this.roleRoutes[userRole]]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  private setAuthData(response: AuthResponse): void {
    this.tokenService.setToken(response.token);
    this.tokenService.setUserRole(response.user.role);
    this.currentUserSignal.set(response.user);
  }

  private clearAuthData(): void {
    this.tokenService.clearAll();
    this.currentUserSignal.set(null);
  }
}
