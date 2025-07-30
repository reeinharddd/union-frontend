// Fabian Mendoza
import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Pipe, PipeTransform, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Block } from '@app/core/models/project/block.interface';
import { ProjectService } from '@app/core/services/project/project.service';

@Pipe({ standalone: true, name: 'safeUrl' })
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

@Component({
  standalone: true,
  selector: 'app-block-list',
  imports: [CommonModule, SafeUrlPipe],
  template: `
    <div *ngIf="blocks().length === 0" class="italic text-gray-500 mb-2">
      Sin bloques aún
    </div>
    <div *ngFor="let b of blocks()" class="p-4 border rounded mb-4">
      <ng-container [ngSwitch]="b.tipo">
        <!-- Texto -->
        <p *ngSwitchCase="'texto'" class="mb-2">{{ b.contenido.text }}</p>

        <!-- Video embebido -->
        <div *ngSwitchCase="'video'" class="mb-2">
          <iframe
            [src]="b.contenido.url | safeUrl"
            class="w-full h-64"
            frameborder="0"
            allowfullscreen>
          </iframe>
        </div>

        <!-- Imagen -->
        <div *ngSwitchCase="'imagen'" class="mb-2">
          <img
            [src]="b.contenido.url"
            [alt]="b.contenido.alt"
            class="max-w-full h-auto rounded"
          />
        </div>

        <!-- Fallback -->
        <p *ngSwitchDefault class="text-red-600">
          Tipo de bloque desconocido: {{ b.tipo }}
        </p>
      </ng-container>

      <button
        *ngIf="canEdit"
        (click)="remove(b.id)"
        class="text-sm text-red-500 hover:underline"
      >
        Borrar bloque
      </button>
    </div>

    <button
      *ngIf="canEdit"
      (click)="add()"
      class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Añadir bloque de prueba
    </button>
  `
})
export class BlockListComponent implements OnInit {
  @Input() pageId!: number;
  @Input() canEdit = false;

  blocks = signal<Block[]>([]);

  constructor(
    private projectSvc: ProjectService
  ) {}

  ngOnInit() {
    this.loadBlocks();
  }

  loadBlocks() {
    this.projectSvc.getBlocks(this.pageId)
      .subscribe(bs => this.blocks.set(bs));
  }

  add() {
    const dto = {
      tipo: 'texto',
      contenido: { text: 'Nuevo bloque de prueba' },
      orden: this.blocks().length
    };
    this.projectSvc.createBlock(this.pageId, dto)
      .subscribe(b => this.blocks.update(arr => [...arr, b]));
  }

  remove(id: number) {
    this.projectSvc.deleteBlock(id)
      .subscribe(() =>
        this.blocks.update(arr => arr.filter(b => b.id !== id))
      );
  }
}
