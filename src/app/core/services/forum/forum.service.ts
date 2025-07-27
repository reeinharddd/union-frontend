import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { BaseService } from '../base/base.service';
import { CreateThreadRequest, Forum, Thread } from '@app/core/models/forum/forum.interface';

@Injectable({
  providedIn: 'root',
})
export class ForumService extends BaseService {
  protected readonly serviceName = 'ForumService';

  private readonly _forums = signal<Forum[]>([]);
  private readonly _threads = signal<Thread[]>([]);

  readonly forums = this._forums.asReadonly();
  readonly threads = this._threads.asReadonly();

  getForums(): Observable<Forum[]> {
    return this.handleRequest(
      this.apiClient.get<Forum[]>(API_ENDPOINTS.FORUMS.BASE),
      'forums.getAll',
      { logRequest: true },
    ).pipe(
      tap(forums => {
        this._forums.set(forums);
        console.log(`💬 Loaded ${forums.length} forums`);
      }),
    );
  }

  getThreads(
    filters: { foro_id?: number; limit?: number; offset?: number; search?: string } = {},
  ): Observable<Thread[]> {
    return this.handleRequest(this.apiClient.get<Thread[]>('/hilos', filters), 'threads.getAll', {
      logRequest: true,
    }).pipe(
      tap(threads => {
        this._threads.set(threads);
        console.log(`🧵 Loaded ${threads.length} threads`);
      }),
    );
  }

  createThread(threadData: CreateThreadRequest): Observable<Thread> {
    return this.handleRequest(this.apiClient.post<Thread>('/hilos', threadData), 'threads.create', {
      showSuccessToast: true,
      successMessage: 'Hilo creado exitosamente',
      logRequest: true,
    }).pipe(
      tap(newThread => {
        this._threads.update(threads => [...threads, newThread]);
      }),
    );
  }
}
