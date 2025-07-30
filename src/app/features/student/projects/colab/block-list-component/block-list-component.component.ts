// Fabian Mendoza
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  signal,
} from '@angular/core';
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
export class BlockListComponent implements OnInit, OnChanges {
  @Input() pageId!: number;
  @Input() canEdit = false;

  blocks = signal<Block[]>([]);

  // Formulario de nuevo bloque
  newType = signal<'texto' | 'video' | 'embed'>('texto');
  newText = signal('');
  newVideoUrl = signal('');
  newEmbedUrl = signal('');
  showCreate = signal(false);

  editingBlockId = signal<number | null>(null);
  menuBlockId = signal<number | null>(null);

  // Pop up de confirmación de borrado
  showDeleteConfirm = signal(false);
  blockToDelete: Block | null = null;

  constructor(private projectSvc: ProjectService) {}

  ngOnInit() {
    this.loadBlocks();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pageId']) {
      this.loadBlocks();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.block-options-menu') && !target.closest('.block-options-btn')) {
      this.menuBlockId.set(null);
    }
  }

  openMenu(event: MouseEvent, b: Block) {
    event.stopPropagation();
    this.menuBlockId.set(b.id);
  }

  closeMenu() {
    this.menuBlockId.set(null);
  }

  loadBlocks() {
    this.projectSvc.getBlocks(this.pageId).subscribe(bs => this.blocks.set(bs));
  }

  drop(event: CdkDragDrop<Block[]>) {
    moveItemInArray(this.blocks(), event.previousIndex, event.currentIndex);
    const ordenPayload = this.blocks().map((b, i) => ({ id: b.id, orden: i }));
    this.projectSvc.reorderBlocks(ordenPayload).subscribe();
  }

  add() {
    const base: Partial<CreateBlockRequest> = { orden: this.blocks().length };
    let dto: CreateBlockRequest;

    if (this.newType() === 'texto') {
      dto = { ...base, tipo: 'texto', contenido: { text: this.newText() } };
    } else if (this.newType() === 'video') {
      dto = { ...base, tipo: 'video', contenido: { videoUrl: this.newVideoUrl() } };
    } else if (this.newType() === 'embed') {
      dto = { ...base, tipo: 'embed', contenido: { embedUrl: this.newEmbedUrl() } };
    } else {
      // fallback a texto
      dto = { ...base, tipo: 'texto', contenido: { text: this.newText() } };
    }

    this.projectSvc.createBlock(this.pageId, dto).subscribe(b => {
      this.blocks.update(arr => [...arr, b]);
      this.resetForm();
    });
  }

  remove(id: number) {
    this.projectSvc
      .deleteBlock(id)
      .subscribe(() => this.blocks.update(arr => arr.filter(b => b.id !== id)));
  }

  // --- Menú de acciones ---
  toggleActionMenu(b: Block) {
    this.menuBlockId.set(this.menuBlockId() === b.id ? null : b.id);
    console.log('menuBlockId:', this.menuBlockId());
  }

  openDeleteConfirm(b: Block) {
    this.blockToDelete = b;
    this.showDeleteConfirm.set(true);
    this.menuBlockId.set(null);
  }

  cancelDelete() {
    this.blockToDelete = null;
    this.showDeleteConfirm.set(false);
  }

  deleteConfirmed() {
    if (this.blockToDelete) {
      this.remove(this.blockToDelete.id);
      this.blockToDelete = null;
      this.showDeleteConfirm.set(false);
    }
  }

  // --- Edición (básica) ---
  editBlock(b: Block) {
    this.editingBlockId.set(b.id);
  }

  saveBlock(bloque: Block) {
    let contenido: CreateBlockRequest['contenido'];

    switch (bloque.tipo) {
      case 'texto':
        contenido = { text: bloque.contenido.text || '' };
        break;
      case 'video':
        contenido = { videoUrl: bloque.contenido.videoUrl || '' };
        break;
      case 'embed':
        contenido = { embedUrl: bloque.contenido.embedUrl || '' };
        break;
      case 'image':
        contenido = { imageUrl: bloque.contenido.imageUrl || '' };
        break;
      default:
        contenido = { text: bloque.contenido.text || '' };
    }

    const updatedBlock: Partial<CreateBlockRequest> = {
      tipo: bloque.tipo,
      contenido: contenido,
      orden: bloque.orden,
    };

    this.projectSvc.updateBlock(bloque.id, updatedBlock).subscribe(() => {
      this.blocks.update(arr => arr.map(b => (b.id === bloque.id ? { ...b, ...updatedBlock } : b)));
      this.editingBlockId.set(null);
    });
  }

  // --- Ancho de bloque ---
  toggleBlockWidth(b: any) {
    if (!b.width) b.width = 1;
    b.width = b.width === 3 ? 1 : b.width + 1;
    // update al bloque en backend (futuro)
  }
  getBlockWidthClass(b: any) {
    switch (b.width) {
      case 2:
        return 'col-span-2';
      case 3:
        return 'col-span-3';
      default:
        return 'col-span-1';
    }
  }

  // --- Seguridad para embebidos ---
  blockedDomains = [
    'facebook.com',
    'instagram.com',
    'tiktok.com',
    'linkedin.com',
    'drive.google.com',
    'twitter.com',
    'reddit.com',
  ];

  isEmbeddable(url: string): boolean {
    if (!url) return false;
    if (this.isYoutubeUrl(url)) return true;
    return !this.blockedDomains.some(domain => url.includes(domain));
  }

  isYoutubeUrl(url: string): boolean {
    return /youtube\.com|youtu\.be/.test(url);
  }

  getEmbeddableUrl(url: string): string {
    if (!url) return '';
    if (this.isYoutubeUrl(url)) {
      let videoId = '';
      if (url.includes('watch?v=')) {
        videoId = url.split('watch?v=')[1]?.split('&')[0];
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0];
      }
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    return url;
  }

  // --- Utilidades ---
  onImgError(event: any) {
    event.target.src = 'assets/placeholder.png';
  }

  private resetForm() {
    this.newType.set('texto');
    this.newText.set('');
    this.newVideoUrl.set('');
    this.newEmbedUrl.set('');
    this.showCreate.set(false);
  }

  closeActionMenu() {
    this.menuBlockId.set(null);
  }

  confirmDeleteBlock(b: Block) {
    this.blockToDelete = b;
    this.showDeleteConfirm.set(true);
    this.closeActionMenu();
  }
}
