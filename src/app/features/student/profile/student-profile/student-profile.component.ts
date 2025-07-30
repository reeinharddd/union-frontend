import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '@app/core/services/auth/auth.service';
import { ApiClientService } from '@app/core/services/base/api-client.service';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-profile.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentProfileComponent implements OnInit {
  // Señal para modo edición
  readonly isEditing = signal(false);
  // Señal para datos editables del perfil
  readonly editProfile = signal({
    nombre: '',
    biografia: '',
    github_url: '',
    linkedin_url: '',
    cv_url: '',
  });

  startEditProfile() {
    const profile = this.userProfile();
    this.editProfile.set({
      nombre: profile?.nombre || '',
      biografia: profile?.biografia || '',
      github_url: profile?.github_url || '',
      linkedin_url: profile?.linkedin_url || '',
      cv_url: profile?.cv_url || '',
    });
    this.isEditing.set(true);
  }

  updateEditProfile(field: string, value: string) {
    this.editProfile.update(profile => ({ ...profile, [field]: value }));
  }

  onSaveProfile(event: Event) {
    event.preventDefault();
    const userId = this.userProfile()?.id;
    if (!userId) return;

    this.apiClient.put(`/usuarios/${userId}`, this.editProfile()).subscribe({
      next: updatedUser => {
        this.userProfile.set(updatedUser);
        this.isEditing.set(false);
      },
      error: () => {
        this.errorMessage.set('Error al guardar los cambios');
        this.isEditing.set(false);
      },
    });
  }
  private readonly authService = inject(AuthService);
  private readonly apiClient = inject(ApiClientService);

  // Signals para manejar el estado
  readonly userProfile = signal<any>(null);
  readonly userUniversity = signal<any>(null);
  readonly userProjects = signal<any[]>([]);
  readonly userExperiences = signal<any[]>([]);
  readonly followerCount = signal<number>(0);
  readonly isLoading = signal(false);
  readonly isLoadingProjects = signal(false);
  readonly isLoadingExperiences = signal(false);
  readonly error = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadCompleteProfile();
  }

  private loadCompleteProfile(): void {
    const currentUser = this.authService.currentUser();

    console.log('🔍 Usuario actual:', currentUser);
    console.log('🔍 Tipo de usuario:', typeof currentUser);
    console.log(
      '🔍 Claves del usuario:',
      currentUser ? Object.keys(currentUser) : 'No hay usuario',
    );

    // También verificar localStorage directamente
    const storedUser = localStorage.getItem('currentUser');
    console.log('💾 Usuario en localStorage:', storedUser);
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        console.log('💾 Usuario parseado:', parsedUser);
        console.log('💾 Claves del usuario parseado:', Object.keys(parsedUser));
      } catch (e) {
        console.error('❌ Error al parsear usuario del localStorage:', e);
      }
    }

    if (!currentUser) {
      console.error('❌ No hay usuario autenticado');
      this.error.set('No hay usuario autenticado');
      return;
    }

    // Verificar diferentes posibles nombres de campos para el ID
    let userId = currentUser.id || (currentUser as any).user_id || (currentUser as any).usuario_id;

    console.log('🆔 ID encontrado:', userId);

    if (!userId) {
      console.error('❌ No hay ID de usuario disponible');
      console.error('❌ Propiedades disponibles:', Object.keys(currentUser));
      this.error.set('No se pudo obtener el ID del usuario');
      return;
    }

    console.log('🚀 Iniciando carga de perfil para usuario ID:', userId);
    this.isLoading.set(true);
    this.error.set(null);
    this.errorMessage.set(null);

    // 1. Cargar datos básicos del usuario
    this.loadUserProfile(userId);
  }

  private loadUserProfile(userId: number): void {
    console.log('📡 Llamando API: GET /usuarios/' + userId);
    // Endpoint: GET /api/usuarios/:id
    this.apiClient.get<any>(`/usuarios/${userId}`).subscribe({
      next: userProfile => {
        console.log('✅ Perfil de usuario cargado:', userProfile);
        this.userProfile.set(userProfile);

        // Si tiene universidad_id, cargar datos de la universidad
        if (userProfile.universidad_id) {
          console.log('🏫 Cargando universidad ID:', userProfile.universidad_id);
          this.loadUniversity(userProfile.universidad_id);
        }

        // Cargar datos relacionados
        this.loadUserExperiences(userId); // Habilitado: cargar experiencias del usuario
        this.loadFollowerCount(userId); // Habilitado: cargar conteo de seguidores
        this.loadUserProjects(userId);
        // this.loadUserProjects(userId); // Este endpoint no existe aún

        // Por ahora solo cargamos datos básicos
        this.isLoading.set(false);
      },
      error: err => {
        console.error('❌ Error al cargar perfil:', err);
        console.error('❌ Error detalles:', err.error);
        console.error('❌ Status:', err.status);
        this.error.set('Error al cargar el perfil del usuario');
        this.errorMessage.set(`Error HTTP ${err.status}: ${err.error?.error || err.message}`);
        this.isLoading.set(false);
      },
    });
  }

  private loadUniversity(universityId: number): void {
    // Endpoint: GET /universidades/:id
    this.apiClient.get<any>(`/universidades/${universityId}`).subscribe({
      next: university => {
        console.log('✅ Universidad cargada:', university);
        this.userUniversity.set(university);
      },
      error: err => {
        console.error('❌ Error al cargar universidad:', err);
      },
    });
  }

  private loadUserProjects(userId: number): void {
    this.isLoadingProjects.set(true);
    // Trae todas las participaciones y luego filtra por usuario
    this.apiClient.get<any[]>(`/participaciones-proyecto`).subscribe({
      next: allParticipations => {
        // Solo participaciones donde el usuario participa
        const myParticipations = allParticipations.filter(p => p.usuario_id === userId);
        const projectIds = myParticipations.map(p => p.proyecto_id);
        this.apiClient.get<any[]>(`/proyectos`).subscribe({
          next: allProjects => {
            // Excluir los proyectos donde el usuario es el creador
            const userProjects = allProjects.filter(
              proj => projectIds.includes(proj.id) && proj.creador_id !== userId,
            );
            console.log('✅ Proyectos donde participo (no soy creador):', userProjects);
            this.userProjects.set(userProjects);
            this.isLoadingProjects.set(false);
          },
          error: err => {
            console.error('❌ Error al cargar proyectos:', err);
            this.userProjects.set([]);
            this.isLoadingProjects.set(false);
            this.errorMessage.set('Error al cargar proyectos');
          },
        });
      },
      error: err => {
        console.error('❌ Error al cargar participaciones:', err);
        this.userProjects.set([]);
        this.isLoadingProjects.set(false);
        this.errorMessage.set('Error al cargar participaciones');
      },
    });
  }

  private loadUserExperiences(userId: number): void {
    this.isLoadingExperiences.set(true);
    // Endpoint: GET /experiencia-usuario (todas las experiencias, luego filtrar)
    this.apiClient.get<any[]>(`/experiencia-usuario`).subscribe({
      next: allExperiences => {
        // Filtrar solo las experiencias del usuario actual
        const userExperiences = allExperiences.filter(exp => exp.usuario_id === userId);
        console.log('✅ Todas las experiencias:', allExperiences);
        console.log('✅ Experiencias del usuario:', userExperiences);
        this.userExperiences.set(userExperiences);
        this.isLoadingExperiences.set(false);
      },
      error: err => {
        console.error('❌ Error al cargar experiencias:', err);
        this.userExperiences.set([]);
        this.isLoadingExperiences.set(false);
        this.errorMessage.set('Error al cargar experiencias');
      },
    });
  }

  private loadFollowerCount(userId: number): void {
    // Endpoint: GET /seguimientos - obtener todos y filtrar, o usar endpoint específico
    this.apiClient.get<any[]>(`/seguimientos`).subscribe({
      next: allSeguimientos => {
        // Filtrar solo los seguimientos donde este usuario es seguido
        const followers = allSeguimientos.filter(seg => seg.seguido_usuario_id === userId);
        console.log('✅ Todos los seguimientos:', allSeguimientos);
        console.log('✅ Seguidores del usuario:', followers);
        this.followerCount.set(followers.length);
      },
      error: err => {
        console.error('❌ Error al cargar seguidores:', err);
        this.followerCount.set(0);
      },
    });
  }

  // Métodos helper para el template
  getUserName(): string {
    const profile = this.userProfile();
    // Backend devuelve 'nombre', no 'name'
    return profile?.nombre || 'Nombre no disponible';
  }

  getUserEmail(): string {
    const profile = this.userProfile();
    // Backend devuelve 'correo', no 'email'
    return profile?.correo || 'Email no disponible';
  }

  getUserBio(): string {
    const profile = this.userProfile();
    return profile?.biografia || 'Sin biografía disponible';
  }

  getUniversityName(): string {
    const university = this.userUniversity();
    return university?.nombre || 'Universidad no especificada';
  }

  getUserCareer(): string {
    const profile = this.userProfile();
    // Puedes usar matricula como identificador de carrera o crear campo específico
    return profile?.matricula || 'Carrera no especificada';
  }

  getUserInitials(): string {
    const name = this.getUserName();
    if (name !== 'Nombre no disponible') {
      return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return 'US';
  }

  hasGithub(): boolean {
    return !!this.userProfile()?.github_url;
  }

  hasLinkedIn(): boolean {
    return !!this.userProfile()?.linkedin_url;
  }

  getGithubUrl(): string {
    return this.userProfile()?.github_url || '#';
  }

  getLinkedInUrl(): string {
    return this.userProfile()?.linkedin_url || '#';
  }

  hasCV(): boolean {
    return !!this.userProfile()?.cv_url;
  }

  getCVUrl(): string {
    return this.userProfile()?.cv_url || '#';
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Presente';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
    });
  }

  retryLoad(): void {
    this.loadCompleteProfile();
  }

  // Método helper para obtener el nombre completo (manteniendo compatibilidad)
  getFullUserName(): string {
    return this.getUserName();
  }

  // Método para verificar si el CV es público
  isCVPublic(): boolean {
    return !!this.userProfile()?.cv_publico;
  }

  // Método para obtener el teléfono si existe
  getUserPhone(): string {
    const profile = this.userProfile();
    return profile?.telefono || '';
  }

  // Método para verificar si el usuario está verificado
  isUserVerified(): boolean {
    return !!this.userProfile()?.verificado;
  }

  // Método para obtener la fecha de creación de la cuenta
  getAccountCreationDate(): string {
    const profile = this.userProfile();
    if (profile?.creado_en) {
      return this.formatDate(profile.creado_en);
    }
    return '';
  }
}
