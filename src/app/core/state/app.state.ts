// src/app/core/state/app.state.ts
import { Injectable, signal, computed } from '@angular/core';
import { User } from '@app/core/models/auth/auth.interface';

export interface AppError {
  message: string;
  code?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any;
  timestamp: Date;
}

export interface LoadingState {
  [key: string]: boolean;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class AppState {
  // Estados de loading
  private readonly _loadingState = signal<LoadingState>({});
  readonly loadingState = this._loadingState.asReadonly();

  // Estado de errores
  private readonly _errors = signal<AppError[]>([]);
  readonly errors = this._errors.asReadonly();

  // Estado de usuario autenticado
  private readonly _currentUser = signal<User | null>(null);
  readonly currentUser = this._currentUser.asReadonly();

  // Estados computados
  readonly isAnyLoading = computed(() => {
    const state = this._loadingState();
    return Object.values(state).some(loading => loading);
  });

  readonly hasErrors = computed(() => this._errors().length > 0);

  // Métodos para loading
  setLoading(key: string, loading: boolean): void {
    this._loadingState.update(state => ({
      ...state,
      [key]: loading
    }));
  }

  // Métodos para errores
  addError(error: AppError): void {
    this._errors.update(errors => [...errors, error]);
  }

  removeError(index: number): void {
    this._errors.update(errors => errors.filter((_, i) => i !== index));
  }

  clearErrors(): void {
    this._errors.set([]);
  }

  // Métodos para usuario
  setCurrentUser(user: User): void {
    this._currentUser.set(user);
  }

  clearCurrentUser(): void {
    this._currentUser.set(null);
  }
}
