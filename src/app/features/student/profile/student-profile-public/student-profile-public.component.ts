import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProfileService } from '../../../../core/services/user/profile.service';

@Component({
  selector: 'app-student-profile-public',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-profile-public.component.html',
  styles: `
    @tailwind base;
    @tailwind components;
    @tailwind utilities;

    @layer utilities {
      .neo-shadow {
        box-shadow:
          5px 5px 10px #d1d9e6,
          -5px -5px 10px #ffffff;
      }

      .dark .neo-shadow {
        box-shadow:
          5px 5px 10px #1a1a1a,
          -5px -5px 10px #2c2c2c;
      }

      .neo-inset {
        box-shadow:
          inset 5px 5px 10px #d1d9e6,
          inset -5px -5px 10px #ffffff;
      }

      .dark .neo-inset {
        box-shadow:
          inset 5px 5px 10px #1a1a1a,
          inset -5px -5px 10px #2c2c2c;
      }

      .line-clamp-2 {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentProfilePublicComponent implements OnInit, OnDestroy {
  // ✅ Servicios inyectados según arquitectura UniON
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly profileService = inject(ProfileService);

  // ✅ Suscripción para manejar cambios de ruta
  private routeSubscription?: Subscription;

  // ✅ Acceso a señales del servicio
  readonly student = this.profileService.student;
  readonly university = this.profileService.university;
  readonly experiences = this.profileService.experiences;
  readonly projects = this.profileService.projects;
  readonly forumActivity = this.profileService.forumActivity;
  readonly loading = this.profileService.loading;
  readonly error = this.profileService.error;
  readonly isFollowing = this.profileService.isFollowing;
  readonly isOwnProfile = this.profileService.isOwnProfile;
  readonly projectsCount = this.profileService.projectsCount;
  readonly forumsCount = this.profileService.forumsCount;
  readonly connectionsCount = this.profileService.connectionsCount;

  ngOnInit(): void {
    // ✅ Suscribirse a cambios de parámetros de ruta para detectar cambios de usuario
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const studentId = params.get('id');

      if (!studentId || isNaN(Number(studentId))) {
        console.error('❌ ID de estudiante inválido');
        return;
      }

      // Limpiar estado anterior antes de cargar nuevo perfil
      this.profileService.clearProfile();

      // Usar el servicio para cargar el perfil
      console.log('👤 Cargando perfil del estudiante:', studentId);
      this.profileService.loadStudentProfile(Number(studentId)).subscribe();
    });
  }

  ngOnDestroy(): void {
    // Limpiar suscripción para evitar memory leaks
    this.routeSubscription?.unsubscribe();

    // Limpiar estado al destruir el componente
    this.profileService.clearProfile();
  }

  /**
   * ✅ Seguir/dejar de seguir usuario según REQ-4.6.1
   */
  followUser(studentId: number): void {
    this.profileService.followUser(studentId);
  }

  /**
   * ✅ Iniciar conversación según REQ-4.14.1 y REQ-4.14.3
   */
  async startConversation(studentId: number): Promise<void> {
    const result = await this.profileService.startConversation(studentId);
    if (result.success && result.conversationId) {
      this.router.navigate(['/chat', result.conversationId]);
    }
  }

  /**
   * ✅ Ver detalles de proyecto según REQ-4.8.1
   */
  viewProject(projectId: number): void {
    console.log('📊 Navegando a proyecto:', projectId);
    this.router.navigate(['/proyectos', projectId]);
  }

  /**
   * ✅ Navegar a perfil de universidad
   */
  viewUniversity(universityId: number): void {
    console.log('🏛️ Navegando a universidad:', universityId);
    this.router.navigate(['/universidades', universityId]);
  }

  /**
   * ✅ Ir atrás en la navegación
   */
  goBack(): void {
    window.history.back();
  }

  /**
   * ✅ Obtener año de graduación
   */
  getGraduationYear(): string {
    return this.profileService.getGraduationYear();
  }

  /**
   * ✅ Obtener habilidades del estudiante
   */
  getStudentSkills(): string[] {
    return this.profileService.getStudentSkills();
  }

  /**
   * ✅ TrackBy function para debugging de actividad en foros
   */
  trackActivityBy(index: number, item: any): any {
    console.log('🔍 Tracking activity:', {
      index,
      id: item.id,
      tipo: item.tipo,
      titulo: item.titulo,
      contenido: item.contenido?.substring(0, 50) + '...',
    });
    return item.id + '_' + item.tipo;
  }
}
