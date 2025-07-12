import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_ROLE_KEY = 'user_role';

  private tokenSignal = signal<string | null>(this.getStoredToken());
  private userRoleSignal = signal<string | null>(this.getStoredUserRole());

  readonly isAuthenticated = computed(() => !!this.tokenSignal());
  readonly userRole = computed(() => this.userRoleSignal());

  private getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  private getStoredUserRole(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.USER_ROLE_KEY);
    }
    return null;
  }

  setToken(token: string): void {
    console.log('🔐 TokenService - Setting token:', token?.substring(0, 20) + '...');
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
    this.tokenSignal.set(token);
  }

  getToken(): string | null {
    const token = this.tokenSignal();
    console.log(
      '🔍 TokenService - Getting token:',
      token ? `${token.substring(0, 20)}...` : 'null',
    );
    return token;
  }

  getUserRole(): string | null {
    const role = this.userRoleSignal();
    console.log('👤 TokenService - Getting user role:', role);
    return role;
  }

  setUserRole(role: string): void {
    console.log('👤 TokenService - Setting user role:', role);
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USER_ROLE_KEY, role);
    }
    this.userRoleSignal.set(role);
  }

  clearAll(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_ROLE_KEY);
    }
    this.tokenSignal.set(null);
    this.userRoleSignal.set(null);
  }
}
