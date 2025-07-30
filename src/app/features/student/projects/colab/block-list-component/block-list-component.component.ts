// Fabian Mendoza
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, signal } from '@angular/core';
import { Block } from '@app/core/models/project/block.interface';
import { ProjectService } from '@app/core/services/project/project.service';
import { SafeUrlPipe } from '@app/shared/pipes/Safe-url.pipe';

@Component({
  standalone: true,
  selector: 'app-block-list',
  imports: [CommonModule, DragDropModule, SafeUrlPipe],
  templateUrl: './block-list-component.component.html',
})
export class BlockListComponent implements OnInit {
  @Input() pageId!: number;
  @Input() canEdit = false;
  blocks = signal<Block[]>([]);

  constructor(private projectSvc: ProjectService) {}

  ngOnInit() {
    this.loadBlocks();
  }

  loadBlocks() {
    this.projectSvc.getBlocks(this.pageId)
      .subscribe(bs => this.blocks.set(bs));
  }

  /** Maneja reordenación drag & drop */
  drop(event: CdkDragDrop<Block[]>) {
    moveItemInArray(this.blocks(), event.previousIndex, event.currentIndex);
    const ordenPayload = this.blocks().map((b, i) => ({ id: b.id, orden: i }));
    this.projectSvc.reorderBlocks(ordenPayload).subscribe();
  }

  /** Añade bloque de prueba */
  add() {
    const dto = {
      tipo: 'texto',
      contenido: { text: 'Nuevo bloque de prueba' },
      orden: this.blocks().length
    };
    this.projectSvc.createBlock(this.pageId, dto)
      .subscribe(b => this.blocks.update(arr => [...arr, b]));
  }

  /** Elimina bloque */
  remove(id: number) {
    this.projectSvc.deleteBlock(id)
      .subscribe(() => this.blocks.update(arr => arr.filter(b => b.id !== id)));
  }
}
