import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_ROLE_KEY = 'user_role';

  private tokenSignal = signal<string | null>(this.getStoredToken());
  private userRoleSignal = signal<string | null>(this.getStoredUserRole());

  readonly isAuthenticated = computed(() => !!this.tokenSignal());
  readonly userRole = computed(() => this.userRoleSignal());

  getToken(): string | null {
    return this.tokenSignal();
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    this.tokenSignal.set(token);
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.tokenSignal.set(null);
  }

  getUserRole(): string | null {
    return this.userRoleSignal();
  }

  setUserRole(role: string): void {
    localStorage.setItem(this.USER_ROLE_KEY, role);
    this.userRoleSignal.set(role);
  }

  removeUserRole(): void {
    localStorage.removeItem(this.USER_ROLE_KEY);
    this.userRoleSignal.set(null);
  }

  clearAll(): void {
    this.removeToken();
    this.removeUserRole();
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getStoredUserRole(): string | null {
    return localStorage.getItem(this.USER_ROLE_KEY);
  }
}
