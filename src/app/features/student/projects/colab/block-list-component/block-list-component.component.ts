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

  blockedDomains = [
    'facebook.com',
    'instagram.com',
    'tiktok.com',
    'linkedin.com',
    'drive.google.com',
    'twitter.com',
    'reddit.com',
  ];

  // Detecta si la url puede ser embebida 
  isEmbeddable(url: string): boolean {
    if (!url) return false;
    if (this.isYoutubeUrl(url)) return true;
    return !this.blockedDomains.some(domain => url.includes(domain));
  }

  // Detecta si es YouTube
  isYoutubeUrl(url: string): boolean {
    return /youtube\.com|youtu\.be/.test(url);
  }

  // Convierte links de YouTube normales a formato embed
  getEmbeddableUrl(url: string): string {
    if (!url) return '';
    if (this.isYoutubeUrl(url)) {
      // https://www.youtube.com/watch?v=VIDEO_ID  -->  https://www.youtube.com/embed/VIDEO_ID
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


}

