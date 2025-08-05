import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Forum } from '../../../../core/models/forum/forum.interface';
import { ForumService } from '../forum.service';

@Component({
  selector: 'app-forum-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forum-list.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForumListComponent {
  private forumService = inject(ForumService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  forums$ = this.forumService.getAll();

  crearForo() {
    this.router.navigate(['admin', 'foros', 'new']);
  }

  editarForo(id: number) {
    this.router.navigate(['admin', 'foros', id, 'edit']);
  }

  eliminarForo(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este foro?')) {
      this.forumService.delete(id).subscribe({
        next: () => {
          this.forums$ = this.forumService.getAll();
          this.cdr.markForCheck();
        },
        error: err => {
          console.error('Error eliminando foro:', err);
        },
      });
    }
  }

  verForo(id: number) {
    this.router.navigate(['admin', 'foros', id]);
  }

  getActiveForums(): number {
    // Lógica para contar foros activos
    return 0; // Placeholder
  }

  getTotalDiscussions(): number {
    // Lógica para contar total de discusiones
    return 0; // Placeholder
  }

  trackByForum(_index: number, forum: Forum): number {
    return forum.id;
  }
}
