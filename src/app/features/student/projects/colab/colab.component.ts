import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ColabPage, CreateColabPageRequest } from '@app/core/models/project/colab.interface';
import { AuthService } from '@app/core/services/auth/auth.service';
import { ProjectService } from '@app/core/services/project/project.service';
import { BlockListComponent } from './block-list-component/block-list-component.component';

@Component({
  standalone: true,
  selector: 'app-colab',
  imports: [
    CommonModule,
    FormsModule,
    BlockListComponent,
  ],
  templateUrl: './colab.component.html',
})
export class ColabComponent implements OnInit {
  projectId!: number;
  pages        = signal<ColabPage[]>([]);
  permiso      = signal<'edit'|'view'|'none'>('none');
  viewMode     = signal<'edit'|'view'>('view');
  showCreate   = signal(false);
  newTitle     = signal('');
  newDesc      = signal('');
  selectedPage?: ColabPage;

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
        if (res.permiso !== 'none') {
          this.projectSvc.getColabPages(this.projectId)
            .subscribe(pgs => {
              this.pages.set(pgs);
              this.selectedPage = pgs[0];
            });
        }
      });
  }

  selectPage(page: ColabPage|null) {
    if (!page && this.permiso() === 'edit') {
      this.showCreate.set(true);
      return;
    }
    this.showCreate.set(false);
    this.selectedPage = page ?? this.pages()[0];
  }

  createPage() {
    if (!this.newTitle() || !this.newDesc()) return;
    const userId = this.auth.currentUser()?.id!;
    const dto: CreateColabPageRequest & {
      proyecto_id: number;
      permisos_lectura: string[];
      permisos_escritura: string[];
      orden: number;
    } = {
      titulo: this.newTitle(),
      descripcion: this.newDesc(),
      proyecto_id: this.projectId,
      permisos_lectura: [userId.toString()],
      permisos_escritura: [userId.toString()],
      orden: this.pages().length,
    };
console.log('Creating page with DTO:', dto);
    this.projectSvc.createColabPage(this.projectId, dto)
      .subscribe(page => {
        this.pages.update(arr => [...arr, page]);
        this.newTitle.set('');
        this.newDesc.set('');
        this.showCreate.set(false);
        this.selectedPage = page;
      });
  }

  deletePage(pageId: number) {
    this.projectSvc.deleteColabPage(pageId)
      .subscribe(() => {
        this.pages.update(arr => arr.filter(p => p.id !== pageId));
        this.selectedPage = this.pages()[0];
      });
  }
}
