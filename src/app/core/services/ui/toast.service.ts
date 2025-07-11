import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSignal = signal<Toast[]>([]);
  readonly toasts = this.toastsSignal.asReadonly();

  showSuccess(message: string, duration = 5000): void {
    this.addToast('success', message, duration);
  }

  showError(message: string, duration = 5000): void {
    this.addToast('error', message, duration);
  }

  showWarning(message: string, duration = 5000): void {
    this.addToast('warning', message, duration);
  }

  showInfo(message: string, duration = 5000): void {
    this.addToast('info', message, duration);
  }

  remove(id: string): void {
    this.toastsSignal.update(toasts => toasts.filter(toast => toast.id !== id));
  }

  private addToast(type: Toast['type'], message: string, duration: number): void {
    const id = this.generateId();
    const toast: Toast = { id, type, message, duration };

    this.toastsSignal.update(toasts => [...toasts, toast]);

    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
