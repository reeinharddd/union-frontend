import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { TokenService } from '@app/core/services/auth/token.service';
import { ProjectService } from '@app/core/services/project/project.service';
import { Subscription } from 'rxjs';

import { ChangeDetectorRef, inject } from '@angular/core';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush, // Mejora de rendimiento
})
export class ProjectDetailComponent implements OnInit, OnDestroy {
  project: any = null;
  currentUserId: number | null = null;
  isProjectOwner = false;
  loading = true;
  error: string | null = null;
  private routeSub!: Subscription;

  private readonly cdr = inject(ChangeDetectorRef);

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
          this.cdr.markForCheck(); // Asegurarse de que la vista se actualice
        },
        error: err => {
          console.error('Error:', err);
          this.error = 'Error al cargar el proyecto';
          this.loading = false;
          this.cdr.markForCheck(); // Asegurarse de que la vista se actualice
        },
      });
    } else {
      this.error = 'ID de proyecto inválido';
      this.loading = false;
    }
  }

  inviteGlobalError = '';
  inviteGlobalSuccess = '';

  // Método para aprobar proyecto
  showInviteModal = false;
  inviteEmail = '';
  inviteError = '';
  inviteSuccess = '';
  inviteLoading = false;

  openInviteModal() {
    this.inviteEmail = '';
    this.inviteError = '';
    this.inviteSuccess = '';
    this.inviteLoading = false;
    this.showInviteModal = true;
  }

  closeInviteModal() {
    this.showInviteModal = false;
    this.inviteError = '';
    this.inviteSuccess = '';
    this.inviteEmail = '';
    this.inviteLoading = false;
  }

  // Invitar por email
  sendInvitation() {
    if (!this.inviteEmail) return;
    if (!this.currentUserId) {
      this.inviteError = 'Usuario no autenticado';
      return;
    }
    this.inviteLoading = true;
    this.inviteError = '';
    this.inviteSuccess = '';

    this.projectsService
      .inviteUserToProject(this.inviteEmail, this.project.id, 2, this.currentUserId)
      .subscribe({
        error: err => {
          // Accede explícitamente al mensaje de error correcto
          if (err.error && typeof err.error === 'object' && err.error.error) {
            this.inviteError = err.error.error; // <-- el mensaje exacto del backend
          } else if (err.error && err.error.message) {
            this.inviteError = err.error.message;
          } else {
            this.inviteError = 'Error enviando invitación';
          }
          this.inviteLoading = false;

          // Muestra globalmente después de cerrar el modal
          setTimeout(() => {
            this.closeInviteModal();
            this.inviteGlobalError = this.inviteError;
            setTimeout(() => (this.inviteGlobalError = ''), 4000);
          }, 900);
        },
        next: () => {
          this.inviteSuccess = '¡Invitación enviada!';
          this.inviteLoading = false;

          setTimeout(() => {
            this.closeInviteModal();
            this.inviteGlobalSuccess = this.inviteSuccess;
            setTimeout(() => (this.inviteGlobalSuccess = ''), 4000);
          }, 800); // Deja ver el éxito dentro del modal un instante
        },
      });
  }
}
