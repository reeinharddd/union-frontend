import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../event.service';
@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-list.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventListComponent {
  private eventService = inject(EventService);
  private cdr = inject(ChangeDetectorRef);
  events$ = this.eventService.getAll();

  eliminarEvento(id: number) {
    this.eventService.delete(id).subscribe({
      next: () => {
        this.events$ = this.eventService.getAll();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error eliminando evento:', err);
      }
    });
  }

  crearEvento() {
    this.router.navigate(['admin', 'events', 'create']);
  }

  private router = inject(Router);

  editarEvento(id: number) {
    this.router.navigate(['admin', 'events', id, 'edit']);
  }
}