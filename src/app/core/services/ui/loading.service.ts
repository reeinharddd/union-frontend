import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSignal = signal<boolean>(false);
  private loadingCountSignal = signal<number>(0);

  readonly isLoading = this.loadingSignal.asReadonly();

  show(): void {
    this.loadingCountSignal.update(count => count + 1);
    this.loadingSignal.set(true);
  }

  hide(): void {
    this.loadingCountSignal.update(count => Math.max(0, count - 1));

    if (this.loadingCountSignal() === 0) {
      this.loadingSignal.set(false);
    }
  }

  forceHide(): void {
    this.loadingCountSignal.set(0);
    this.loadingSignal.set(false);
  }
}
