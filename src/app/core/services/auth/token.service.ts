import { Injectable } from '@angular/core';
import { User } from '@app/core/models/auth/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN_KEY = 'authToken';
  private readonly USER_KEY = 'currentUser';

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    console.log('🔐 Token stored');
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  setStoredUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    console.log('👤 User data stored');
  }

  getStoredUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    if (userData) {
      try {
        return JSON.parse(userData) as User;
      } catch (error) {
        console.error('❌ Error parsing stored user data:', error);
        return null;
      }
    }
    return null;
  }

  isValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Verificar si el token tiene el formato básico de JWT
      const parts = token.split('.');
      if (parts.length !== 3) return false;

      // Decodificar el payload para verificar expiración
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      return payload.exp > currentTime;
    } catch (error) {
      console.error('❌ Invalid token format:', error);
      return false;
    }
  }

  // ✅ AGREGAR: Método isAuthenticated que faltaba
  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getStoredUser();

    // Verificar que tenemos tanto token como usuario, y que el token es válido
    return !!(token && user && this.isValidToken());
  }

  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    console.log('🗑️ Token cleared');
  }

  clearStoredUser(): void {
    localStorage.removeItem(this.USER_KEY);
    console.log('🗑️ User data cleared');
  }

  hasValidToken(): boolean {
    return this.isValidToken();
  }

  getUserRole(): string {
    const user = this.getStoredUser();
    return user?.rol_id?.toString() || '';
  }

  // ✅ AGREGAR: Método adicional para obtener el rol como número
  getUserRoleId(): number | null {
    const user = this.getStoredUser();
    return user?.rol_id || null;
  }

  // ✅ AGREGAR: Método para obtener el ID del usuario
  getUserId(): number | null {
    const user = this.getStoredUser();
    return user?.id || null;
  }

  // ✅ AGREGAR: Método para verificar si el usuario tiene un rol específico
  hasRole(roleId: number): boolean {
    const userRoleId = this.getUserRoleId();
    return userRoleId === roleId;
  }

  // ✅ AGREGAR: Método para limpiar toda la sesión
  clearSession(): void {
    this.clearToken();
    this.clearStoredUser();
    console.log('🧹 Complete session cleared');
  }
}
