import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth/auth.service';
import { ApiClientService } from '@app/core/services/base/api-client.service';
import { catchError, finalize, of, tap } from 'rxjs';

interface Project {
  id: number;
  titulo: string;
  descripcion: string;
  objetivo: string;
  tecnologias: string;
  estado: string;
  fecha_inicio: string;
  fecha_limite: string;
  creador_id: number;
  universidad_id: number;
  verificado: boolean;
  creado_en: string;
  actualizado_en: string;
  creador?: {
    id: number;
    nombre: string;
    apellido?: string;
    correo: string;
  };
  universidad?: {
    id: number;
    nombre: string;
  };
  participantes_count?: number;
}

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-list.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectListComponent implements OnInit {
  private readonly apiClient = inject(ApiClientService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Signals para manejar el estado
  readonly projects = signal<Project[]>([]);
  readonly filteredProjects = signal<Project[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly selectedFilter = signal<string>('all');

  // Filtros disponibles
  readonly filters = [
    { value: 'all', label: 'Todos los proyectos', icon: '📋' },
    { value: 'active', label: 'Activos', icon: '🚀' },
    { value: 'verified', label: 'Verificados', icon: '✅' },
    { value: 'my_university', label: 'Mi Universidad', icon: '🏛️' },
    { value: 'completed', label: 'Completados', icon: '🎯' },
  ];

  ngOnInit(): void {
    this.loadProjects();
  }

  private loadProjects(): void {
    this.isLoading.set(true);
    this.error.set(null);

    console.log('🚀 Cargando lista de proyectos...');

    this.apiClient
      .get<Project[]>('/proyectos')
      .pipe(
        tap((projects: Project[]) => {
          console.log('✅ Proyectos cargados:', projects);
          console.log('📊 Total de proyectos:', projects.length);

          // Enriquecer con información adicional si está disponible
          const enrichedProjects = projects.map(project => ({
            ...project,
            participantes_count: 0, // Se puede cargar después
          }));

          this.projects.set(enrichedProjects);
          this.applyFilter(this.selectedFilter());
        }),
        catchError(error => {
          console.error('❌ Error al cargar proyectos:', error);
          console.error('❌ Detalles del error:', error.error);
          console.error('❌ Status:', error.status);
          this.error.set('Error al cargar la lista de proyectos');
          return of([]);
        }),
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe();
  }

  // Aplicar filtros
  applyFilter(filterValue: string): void {
    this.selectedFilter.set(filterValue);
    const allProjects = this.projects();
    const currentUser = this.authService.currentUser();
    const userUniversityId = currentUser?.universidad_id;

    let filtered: Project[] = [];

    switch (filterValue) {
      case 'all':
        filtered = allProjects;
        break;
      case 'active':
        filtered = allProjects.filter(
          project => project.estado === 'activo' || project.estado === 'en_progreso',
        );
        break;
      case 'verified':
        filtered = allProjects.filter(project => project.verificado);
        break;
      case 'my_university':
        filtered = allProjects.filter(project => project.universidad_id === userUniversityId);
        break;
      case 'completed':
        filtered = allProjects.filter(project => project.estado === 'completado');
        break;
      default:
        filtered = allProjects;
    }

    console.log(`🔍 Filtro aplicado: ${filterValue}, Resultados: ${filtered.length}`);
    this.filteredProjects.set(filtered);
  }

  // Métodos helper para el template
  getProjectsCount(): number {
    return this.filteredProjects().length;
  }

  getTotalProjectsCount(): number {
    return this.projects().length;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  getStatusInSpanish(status: string): string {
    const statusMap: { [key: string]: string } = {
      activo: 'Activo',
      en_progreso: 'En Progreso',
      completado: 'Completado',
      pausado: 'Pausado',
      cancelado: 'Cancelado',
    };
    return statusMap[status] || status;
  }

  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      activo: 'bg-green-100 text-green-800',
      en_progreso: 'bg-blue-100 text-blue-800',
      completado: 'bg-purple-100 text-purple-800',
      pausado: 'bg-yellow-100 text-yellow-800',
      cancelado: 'bg-red-100 text-red-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  }

  getCreatorName(project: Project): string {
    if (project.creador) {
      return `${project.creador.nombre} ${project.creador.apellido || ''}`.trim();
    }
    return 'Creador no disponible';
  }

  getUniversityName(project: Project): string {
    return project.universidad?.nombre || 'Universidad no especificada';
  }

  isMyProject(project: Project): boolean {
    const currentUser = this.authService.currentUser();
    return project.creador_id === currentUser?.id;
  }

  // Navegación
  viewProjectDetails(projectId: number): void {
    this.router.navigate(['/student/projects', projectId]);
    console.log('👁️ Navegando a detalles del proyecto:', projectId);
  }

  joinProject(projectId: number): void {
    // Implementar lógica para unirse al proyecto
    console.log('➕ Intentando unirse al proyecto:', projectId);
    // Aquí puedes agregar la lógica para enviar solicitud de participación
  }

  // Métodos de utilidad
  retryLoad(): void {
    this.loadProjects();
  }

  refreshProjects(): void {
    this.loadProjects();
  }

  canJoinProject(project: Project): boolean {
    return (
      !this.isMyProject(project) &&
      (project.estado === 'activo' || project.estado === 'en_progreso')
    );
  }

  getFilteredProjectsByStatus(): { [key: string]: number } {
    const allProjects = this.projects();
    return {
      total: allProjects.length,
      active: allProjects.filter(p => p.estado === 'activo' || p.estado === 'en_progreso').length,
      verified: allProjects.filter(p => p.verificado).length,
      completed: allProjects.filter(p => p.estado === 'completado').length,
    };
  }

  truncateText(text: string, maxLength: number = 150): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  // TrackBy function para optimizar ngFor
  trackByProjectId(_index: number, project: Project): number {
    return project.id;
  }
}
