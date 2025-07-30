import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { TokenService } from '@app/core/services/auth/token.service';
import { ProjectService } from '@app/core/services/project/project.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule],
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  project: any = null;
  currentUserId: number | null = null;
  isProjectOwner = false;
  loading = true;
  error: string | null = null;
  private routeSub!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectService,
    private tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    // Asegurarnos que currentUserId es number (parseInt si es necesario)
    const userId = this.tokenService.getUserId();
    this.currentUserId = typeof userId === 'string' ? parseInt(userId, 10) : userId;

    this.routeSub = this.route.paramMap.subscribe((params: ParamMap) => {
      this.loadProject(params.get('id'));
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  loadProject(id: string | null): void {
    if (!id) return;

    this.loading = true;
    this.error = null;
    this.project = null;
    this.isProjectOwner = false; // Resetear estado

    const numericId = parseInt(id, 10);

    if (!isNaN(numericId)) {
      this.projectsService.getById(numericId).subscribe({
        next: (res: any) => {
          this.project = res;

          // Comparación segura entre números
          const creatorId =
            typeof this.project.creador_id === 'string'
              ? parseInt(this.project.creador_id, 10)
              : this.project.creador_id;

          this.isProjectOwner = this.currentUserId === creatorId;

          console.log('Owner check:', {
            current: this.currentUserId,
            creator: creatorId,
            isOwner: this.isProjectOwner,
          });

          this.loading = false;
        },
        error: err => {
          console.error('Error:', err);
          this.error = 'Error al cargar el proyecto';
          this.loading = false;
        },
      });
    } else {
      this.error = 'ID de proyecto inválido';
      this.loading = false;
    }
  }

  openCollaborationModal() {
    console.log('Abrir modal de colaboración');
  }
}
