import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TagService } from '../tag.service';

@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tag-list.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagListComponent {
  private tagService = inject(TagService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  tags$ = this.tagService.getAll();

  crearTag() {
    this.router.navigate(['admin', 'tags', 'new']);
  }

  editarTag(id: number) {
    this.router.navigate(['admin', 'tags', id, 'edit']);
  }

  eliminarTag(id: number) {
    this.tagService.delete(id).subscribe({
      next: () => {
        this.tags$ = this.tagService.getAll();
        this.cdr.markForCheck();
      },
      error: err => {
        console.error('Error eliminando tag:', err);
      },
    });
  }

  getCategoriesCount(tags: any[]): number {
    if (!tags || tags.length === 0) return 0;
    const uniqueCategories = new Set(tags.map(tag => tag.categoria).filter(cat => cat));
    return uniqueCategories.size;
  }
}
