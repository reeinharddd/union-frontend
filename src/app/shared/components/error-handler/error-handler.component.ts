import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-handler',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <button *ngIf="showRetry" (click)="onRetry()" class="retry-button">Reintentar</button>
    </div>
  `,
  styles: [
    `
      .error-container {
        text-align: center;
        padding: 2rem;
        background: #fee;
        border: 1px solid #fcc;
        border-radius: 8px;
        margin: 1rem 0;
      }

      .error-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .retry-button {
        background: #dc3545;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 1rem;
      }

      .retry-button:hover {
        background: #c82333;
      }
    `,
  ],
})
export class ErrorHandlerComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() error: any = null;
  @Input() title: string = 'Error al cargar los datos';
  @Input() message: string = 'No se pudieron cargar los datos desde el servidor.';
  @Input() showRetry: boolean = true;
  @Input() retryCallback?: () => void;

  onRetry(): void {
    if (this.retryCallback) {
      this.retryCallback();
    }
  }
}
