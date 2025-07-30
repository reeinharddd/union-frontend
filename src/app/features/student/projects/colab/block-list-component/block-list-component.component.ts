import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Block, CreateBlockRequest } from '@app/core/models/project/block.interface';
import { ProjectService } from '@app/core/services/project/project.service';
import { SafeUrlPipe } from '@app/shared/pipes/Safe-url.pipe';

@Component({
  standalone: true,
  selector: 'app-block-list-component',
  imports: [CommonModule, FormsModule, DragDropModule, SafeUrlPipe],
  templateUrl: './block-list-component.component.html',
})
export class BlockListComponent implements OnInit {
  @Input() pageId!: number;
  @Input() canEdit = false;

  blocks = signal<Block[]>([]);

  // Formulario de nuevo bloque
  newType     = signal<'texto' | 'video' | 'embed'>('texto');
  newText     = signal('');
  newVideoUrl = signal('');
  newEmbedUrl = signal('');

  constructor(private projectSvc: ProjectService) {}

  ngOnInit() {
    this.loadBlocks();
  }

  loadBlocks() {
    this.projectSvc.getBlocks(this.pageId)
      .subscribe(bs => this.blocks.set(bs));
  }

  drop(event: CdkDragDrop<Block[]>) {
    moveItemInArray(this.blocks(), event.previousIndex, event.currentIndex);
    const ordenPayload = this.blocks().map((b, i) => ({ id: b.id, orden: i }));
    this.projectSvc.reorderBlocks(ordenPayload).subscribe();
  }

  add() {
    // Construye el DTO según tipo
    const base: Partial<CreateBlockRequest> = { orden: this.blocks().length };
    let dto: CreateBlockRequest;

    if (this.newType() === 'texto') {
      dto = { ...base, tipo: 'texto', contenido: { text: this.newText() } };
    } else if (this.newType() === 'video') {
      dto = { ...base, tipo: 'video', contenido: { videoUrl: this.newVideoUrl() } };
    } else {
      dto = { ...base, tipo: 'embed', contenido: { embedUrl: this.newEmbedUrl() } };
    }

    this.projectSvc.createBlock(this.pageId, dto)
      .subscribe(b => {
        this.blocks.update(arr => [...arr, b]);
        this.resetForm();
      });
  }

  remove(id: number) {
    this.projectSvc.deleteBlock(id)
      .subscribe(() => this.blocks.update(arr => arr.filter(b => b.id !== id)));
  }

  private resetForm() {
    this.newType.set('texto');
    this.newText.set('');
    this.newVideoUrl.set('');
    this.newEmbedUrl.set('');
  }
}
