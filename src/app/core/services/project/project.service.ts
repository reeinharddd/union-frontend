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
  CreateColabPageRequest,
  PermisoResponse,
} from '@app/core/models/project/colab.interface';

import { Block, CreateBlockRequest } from '@app/core/models/project/block.interface';


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
    // Permiso
  getPermiso(projectId: number, userId: number) {
    return this.handleRequest(
      this.apiClient.get<PermisoResponse>(
        API_ENDPOINTS.PROJECTS.PERMIT(projectId, userId)
      ),
      `projects.getPermiso.${projectId}.${userId}`
    );
  }

  // Listar páginas colaborativas de un proyecto
  getColabPages(projectId: number) {
    return this.handleRequest(
      this.apiClient.get<ColabPage[]>(
      API_ENDPOINTS.COLAB_PAGE.LIST(projectId)
    ),
    `projects.getColabPages.${projectId}`
    );
  }

  // Crear página
  createColabPage(projectId: number, dto: CreateColabPageRequest) {
    const payload = { ...dto, proyecto_id: projectId };

    return this.handleRequest(
      this.apiClient.post<ColabPage>(
        API_ENDPOINTS.COLAB_PAGE.CREATE,  // "/paginas-colaborativas"
        payload
      ),
      `projects.createColabPage.${projectId}`,
      { showSuccessToast: true, successMessage: 'Página creada' }
    );
  }

  // Actualizar página
  updateColabPage(pageId: number, dto: Partial<CreateColabPageRequest>) {
    return this.handleRequest(
      this.apiClient.put<ColabPage>(
        API_ENDPOINTS.COLAB_PAGE.BY_ID(pageId),
        dto
      ),
      `projects.updateColabPage.${pageId}`,
      { showSuccessToast: true, successMessage: 'Página actualizada' }
    );
  }

  // Eliminar página
  deleteColabPage(pageId: number) {
    return this.handleRequest(
      this.apiClient.delete<{ message: string }>(
        API_ENDPOINTS.COLAB_PAGE.BY_ID(pageId)
      ),
      `projects.deleteColabPage.${pageId}`,
      { showSuccessToast: true, successMessage: 'Página eliminada' }
    );
  }

  // Listar bloques
getBlocks(pageId: number) {
  return this.apiClient
    .get<Block[]>(API_ENDPOINTS.BLOQUES.BY_PAGE(pageId));
}

// Crear
createBlock(pageId: number, dto: CreateBlockRequest) {
  return this.apiClient
    .post<Block>(API_ENDPOINTS.BLOQUES.BY_PAGE(pageId), dto);
}

// Actualizar
updateBlock(blockId: number, dto: Partial<CreateBlockRequest>) {
  return this.apiClient
    .put<Block>(API_ENDPOINTS.BLOQUES.BY_ID(blockId), dto);
}

// Borrar
deleteBlock(blockId: number) {
  return this.apiClient
    .delete<{ message: string }>(API_ENDPOINTS.BLOQUES.BY_ID(blockId));
}

}
