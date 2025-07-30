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
    BlockListComponent
  ],
  templateUrl: './colab.component.html',
})
export class ColabComponent implements OnInit {
  // 1) Declara projectId aquí:
  projectId!: number;

  pages          = signal<ColabPage[]>([]);
  loading        = signal(false);
  permiso        = signal<'edit'|'view'|'none'>('none');
  newTitle       = signal('');
  newDesc        = signal('');
  showCreateForm = signal(false);
  selectedPage?: ColabPage;

  constructor(
    private projectSvc: ProjectService,
    private auth: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Asigna projectId desde la URL
    this.projectId = Number(this.route.snapshot.paramMap.get('projectId'));

    const userId = this.auth.currentUser()?.id!;
    this.loading.set(true);
    this.projectSvc.getPermiso(this.projectId, userId).subscribe(res => {
      this.permiso.set(res.permiso);
      if (res.permiso !== 'none') {
        this.projectSvc.getColabPages(this.projectId).subscribe(pgs => {
          this.pages.set(pgs);
          console.log('🚀 Páginas cargadas:', this.pages());  // 2) Verifica aquí
          this.selectedPage = pgs[0];
        });
      }
      this.loading.set(false);
    });
  }

  selectPage(page: ColabPage|null) {
    if (!page && this.permiso() === 'edit') {
      this.showCreateForm.set(true);
      return;
    }
    this.showCreateForm.set(false);
    this.selectedPage = page ?? this.pages()[0];
  }

  createPage() {
    if (!this.newTitle() || !this.newDesc()) return;
    const dto: CreateColabPageRequest = {
      titulo: this.newTitle(),
      descripcion: this.newDesc(),
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

  deletePage(pageId: number) {
    this.projectSvc.deleteColabPage(pageId)
      .subscribe(() => {
        this.pages.update(arr => arr.filter(p => p.id !== pageId));
        this.selectedPage = this.pages()[0];
      });
  }
}
