/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@app/core/services/auth/auth.service';
import { ApiClientService } from '@app/core/services/base/api-client.service';

@Component({
  selector: 'app-right-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './right-sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RightSidebarComponent implements OnInit {
  show = false;
  private readonly authService = inject(AuthService);
  private readonly apiClient = inject(ApiClientService);

  readonly userProjects = signal<any[]>([]);
  readonly isLoadingProjects = signal(false);
  readonly errorMessage = signal<string | null>(null);

  // Formulario para crear proyecto
  readonly isCreatingProject = signal(false);
  readonly projectForm = signal({ nombre: '', descripcion: '' });

  ngOnInit(): void {
    this.loadUserProjects();
  }
  private loadUserProjects(): void {
    const currentUser = this.authService.currentUser();
    const userId =
      currentUser?.id || (currentUser as any)?.user_id || (currentUser as any)?.usuario_id;
    if (!userId) {
      this.errorMessage.set('No se pudo obtener el ID del usuario');
      return;
    }
    this.isLoadingProjects.set(true);
    this.apiClient.get<any[]>(`/proyectos`).subscribe({
      next: allProjects => {
        const userProjects = allProjects.filter(proj => proj.creador_id === userId);
        this.userProjects.set(userProjects);
        this.isLoadingProjects.set(false);
      },
    });
  }
}
