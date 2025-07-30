import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  ColabPage
} from '@app/core/models/project/colab.interface';
import { AuthService } from '@app/core/services/auth/auth.service';
import { ProjectService } from '@app/core/services/project/project.service';
import { BlockListComponent } from './block-list-component/block-list-component.component';

@Component({
  standalone: true,
  selector: 'app-colab',
  imports: [
    CommonModule,
    FormsModule,
    BlockListComponent
  ],
  templateUrl: './colab.component.html',
})
export class ColabComponent implements OnInit {
  projectId     !: number;
  pages          = signal<ColabPage[]>([]);
  permiso        = signal<'edit'|'view'|'none'>('none');
  showCreateForm = signal(false);
  newTitle       = signal('');
  newDesc        = signal('');
  selectedPage?: ColabPage;
  /** 1) NUEVA señal para el modo de vista */
  viewMode       = signal<'view'|'edit'>('view');

  constructor(
    private projectSvc: ProjectService,
    private auth: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.projectId = Number(this.route.snapshot.paramMap.get('projectId'));
    const userId = this.auth.currentUser()?.id!;
    this.projectSvc.getPermiso(this.projectId, userId)
      .subscribe(res => {
        this.permiso.set(res.permiso);
        this.viewMode.set(res.permiso === 'edit' ? 'edit' : 'view');
        if (res.permiso !== 'none') {
          this.projectSvc.getColabPages(this.projectId)
            .subscribe(pgs => this.pages.set(pgs));
        }
      });
  }
  /**
   * Selecciona una página o abre el formulario de creación
   */
  selectPage(page: ColabPage | null) {
    if (page === null && this.permiso() === 'edit') {
      this.showCreateForm.set(true);
      return;
    }
    this.showCreateForm.set(false);
    this.selectedPage = page ?? this.pages()[0];
  }

  /**
   * Crea una nueva página colaborativa y la selecciona
   */
  createPage() {
  const userId = this.auth.currentUser()?.id!;
  if (!this.newTitle() || !this.newDesc()) return;

  // Construimos el objeto completo que pide el backend
  const dto = {
    titulo:          this.newTitle(),
    descripcion:     this.newDesc(),
    proyecto_id:     this.projectId,
    permisos_lectura:[ userId ],  
    permisos_escritura:[ userId ], 
    orden:           (this.pages().length), 
  };

  this.projectSvc.createColabPage(this.projectId, dto)
    .subscribe(page => {
      this.pages.update(arr => [...arr, page]);
      this.newTitle.set('');
      this.newDesc.set('');
      this.showCreateForm.set(false);
      this.selectedPage = page;
    });
}

  /**
   * Elimina la página seleccionada y ajusta la lista
   */
  deletePage(pageId: number) {
    this.projectSvc.deleteColabPage(pageId)
      .subscribe(() => {
        this.pages.update(arr => arr.filter(p => p.id !== pageId));
        this.selectedPage = this.pages()[0];
      });
  }
}
