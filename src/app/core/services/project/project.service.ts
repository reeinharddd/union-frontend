// Fabian Mendoza
import { computed, Injectable, signal } from '@angular/core';
import {
  CreateProjectRequest,
  Project,
  ProjectsFilters,
  ProjectsResponse,
} from '@app/core/models/project/project.interface';
import { Observable, tap } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { BaseService } from '../base/base.service';

import {
  ColabPage,
  CreateColabPageRequest, UpdateColabPageRequest,
} from '@app/core/models/project/colab.interface';

import {
  Block,
  CreateBlockRequest
} from '@app/core/models/project/block.interface';


@Injectable({
  providedIn: 'root',
})
export class ProjectService extends BaseService {
  protected readonly serviceName = 'ProjectService';

  // Estado local
  private readonly _projects = signal<Project[]>([]);
  private readonly _totalProjects = signal(0);
  private readonly _currentPage = signal(1);
  private readonly _limit = signal(10);

  readonly projects = this._projects.asReadonly();
  readonly totalProjects = this._totalProjects.asReadonly();
  readonly currentPage = this._currentPage.asReadonly();
  readonly limit = this._limit.asReadonly();

  // Estados computados
  readonly approvedProjects = computed(() =>
    this._projects().filter(project => project.estado_verificacion === 'aprobado'),
  );

  readonly publicProjects = computed(() =>
    this._projects().filter(project => project.vista_publica),
  );

  readonly totalPages = computed(() => Math.ceil(this._totalProjects() / this._limit()));

  getAll(filters: ProjectsFilters = {}): Observable<ProjectsResponse> {
    return this.handleRequest(
      this.apiClient.get<ProjectsResponse>(API_ENDPOINTS.PROJECTS.BASE, filters),
      'projects.getAll',
      { logRequest: true },
    ).pipe(
      tap(response => {
        this._projects.set(response.data);
        this._totalProjects.set(response.pagination.total);
        this._currentPage.set(response.pagination.page);
        this._limit.set(response.pagination.limit);

        console.log(
          ` Loaded ${response.data.length} projects (${response.pagination.total} total)`,
        );
      }),
    );
  }

  getById(id: number): Observable<Project> {
    return this.handleRequest(
      this.apiClient.get<Project>(API_ENDPOINTS.PROJECTS.BY_ID(id)),
      `projects.getById.${id}`,
      { logRequest: true },
    );
  }

  create(projectData: CreateProjectRequest): Observable<Project> {
    return this.handleRequest(
      this.apiClient.post<Project>(API_ENDPOINTS.PROJECTS.BASE, projectData),
      'projects.create',
      {
        showSuccessToast: true,
        successMessage: 'Proyecto creado exitosamente',
        logRequest: true,
      },
    ).pipe(
      tap(newProject => {
        this._projects.update(projects => [...projects, newProject]);
        this._totalProjects.update(total => total + 1);
      }),
    );
  }

  update(id: number, projectData: Partial<CreateProjectRequest>): Observable<Project> {
    return this.handleRequest(
      this.apiClient.put<Project>(API_ENDPOINTS.PROJECTS.BY_ID(id), projectData),
      `projects.update.${id}`,
      {
        showSuccessToast: true,
        successMessage: 'Proyecto actualizado exitosamente',
        logRequest: true,
      },
    ).pipe(
      tap(updatedProject => {
        this._projects.update(projects =>
          projects.map(project => (project.id === id ? updatedProject : project)),
        );
      }),
    );
  }

  delete(id: number): Observable<{ message: string }> {
    return this.handleRequest(
      this.apiClient.delete<{ message: string }>(API_ENDPOINTS.PROJECTS.BY_ID(id)),
      `projects.delete.${id}`,
      {
        showSuccessToast: true,
        successMessage: 'Proyecto eliminado exitosamente',
        logRequest: true,
      },
    ).pipe(
      tap(() => {
        this._projects.update(projects => projects.filter(project => project.id !== id));
        this._totalProjects.update(total => total - 1);
      }),
    );
  }

  // Métodos específicos para proyectos
  approveProject(id: number): Observable<Project> {
    return this.handleRequest(
      this.apiClient.put<Project>(API_ENDPOINTS.PROJECTS.BY_ID(id), {
        estado_verificacion: 'aprobado',
      }),
      `projects.approve.${id}`,
      {
        showSuccessToast: true,
        successMessage: 'Proyecto aprobado exitosamente',
        logRequest: true,
      },
    ).pipe(
      tap(updatedProject => {
        this._projects.update(projects =>
          projects.map(project => (project.id === id ? updatedProject : project)),
        );
      }),
    );
  }

  rejectProject(id: number): Observable<Project> {
    return this.handleRequest(
      this.apiClient.put<Project>(API_ENDPOINTS.PROJECTS.BY_ID(id), {
        estado_verificacion: 'rechazado',
      }),
      `projects.reject.${id}`,
      {
        showSuccessToast: true,
        successMessage: 'Proyecto rechazado',
        logRequest: true,
      },
    ).pipe(
      tap(updatedProject => {
        this._projects.update(projects =>
          projects.map(project => (project.id === id ? updatedProject : project)),
        );
      }),
    );
  }

  getMyProjects(): Observable<ProjectsResponse> {
    const currentUser = this.appState.currentUser();
    if (!currentUser) {
      return new Observable(subscriber => {
        subscriber.next({
          data: [],
          pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
        });
        subscriber.complete();
      });
    }

    return this.getAll({ creador_id: currentUser.id }).pipe(
      tap(response => {
        console.log(`👤 Loaded ${response.data.length} projects for user ${currentUser.id}`);
      }),
    );
  }
   /**
   * Obtiene el permiso del usuario sobre un proyecto
   */
  getPermiso(projectId: number, userId: number): Observable<{ permiso: 'edit' | 'view' | 'none' }> {
    return this.handleRequest(
      this.apiClient.get<{ permiso: 'edit' | 'view' | 'none' }>(
        API_ENDPOINTS.PROJECTS.PERMIT(projectId, userId)
      ),
      `projects.getPermiso.${projectId}.${userId}`
    );
  }

  /**
   * Lista las páginas colaborativas de un proyecto
   */
  getColabPages(projectId: number): Observable<ColabPage[]> {
    return this.handleRequest(
      this.apiClient.get<ColabPage[]>(API_ENDPOINTS.COLAB_PAGE.LIST(projectId)),
      `projects.getColabPages.${projectId}`
    );
  }
  // Servicio
createColabPage(
  projectId: number,
  dto: CreateColabPageRequest & { proyecto_id: number; permisos_lectura: String[]; permisos_escritura: String[]; orden: number }
): Observable<ColabPage> {
  return this.handleRequest(
    this.apiClient.post<ColabPage>(API_ENDPOINTS.COLAB_PAGE.CREATE, dto),
    `projects.createColabPage.${projectId}`
  );
}

  updateColabPage(id: number, dto: UpdateColabPageRequest): Observable<ColabPage> {
    return this.handleRequest(
      this.apiClient.put<ColabPage>(API_ENDPOINTS.COLAB_PAGE.UPDATE(id), dto),
      `projects.updateColabPage.${id}`
    );
  }
  deleteColabPage(id: number): Observable<void> {
    return this.handleRequest(
      this.apiClient.delete<void>(API_ENDPOINTS.COLAB_PAGE.DELETE(id)),
      `projects.deleteColabPage.${id}`
    );
  }

  /**
   * Crea un bloque en una página colaborativa
   */
    // Bloques
  getBlocks(pageId: number): Observable<Block[]> {
    return this.handleRequest(
      this.apiClient.get<Block[]>(API_ENDPOINTS.BLOQUES.BY_PAGE(pageId)),
      `projects.getBlocks.${pageId}`
    );
  }
  createBlock(pageId: number, dto: CreateBlockRequest): Observable<Block> {
    return this.handleRequest(
      this.apiClient.post<Block>(API_ENDPOINTS.BLOQUES.BY_PAGE(pageId), dto),
      `projects.createBlock.${pageId}`
    );
  }
  deleteBlock(id: number): Observable<void> {
    return this.handleRequest(
      this.apiClient.delete<void>(API_ENDPOINTS.BLOQUES.BY_ID(id)),
      `projects.deleteBlock.${id}`
    );
  }
  reorderBlocks(payload: { id: number; orden: number }[]): Observable<void> {
    return this.handleRequest(
      this.apiClient.post<void>(API_ENDPOINTS.BLOQUES.REORDER, payload),
      `projects.reorderBlocks`
    );
  }
}