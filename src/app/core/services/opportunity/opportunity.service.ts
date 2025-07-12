import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiClientService } from '../base/api-client.service';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { Opportunity, CreateOpportunityRequest } from '../../models/opportunity/opportunity.interface';

@Injectable({
  providedIn: 'root'
})
export class OpportunityService {
  private readonly apiClient = inject(ApiClientService);

  private opportunitiesSignal = signal<Opportunity[]>([]);
  readonly opportunities = this.opportunitiesSignal.asReadonly();

  getAll(): Observable<Opportunity[]> {
    return this.apiClient.get<Opportunity[]>(API_ENDPOINTS.OPPORTUNITIES.BASE)
      .pipe(
        tap(opportunities => this.opportunitiesSignal.set(opportunities))
      );
  }

  getById(id: number): Observable<Opportunity> {
    return this.apiClient.get<Opportunity>(API_ENDPOINTS.OPPORTUNITIES.BY_ID(id));
  }

  create(opportunity: CreateOpportunityRequest): Observable<Opportunity> {
    return this.apiClient.post<Opportunity>(API_ENDPOINTS.OPPORTUNITIES.BASE, opportunity)
      .pipe(
        tap(newOpportunity => {
          this.opportunitiesSignal.update(opportunities => [...opportunities, newOpportunity]);
        })
      );
  }

  update(id: number, opportunity: Partial<CreateOpportunityRequest>): Observable<Opportunity> {
    return this.apiClient.put<Opportunity>(API_ENDPOINTS.OPPORTUNITIES.BY_ID(id), opportunity)
      .pipe(
        tap(updatedOpportunity => {
          this.opportunitiesSignal.update(opportunities =>
            opportunities.map(o => o.id === id ? updatedOpportunity : o)
          );
        })
      );
  }

  delete(id: number): Observable<{ message: string }> {
    return this.apiClient.delete<{ message: string }>(API_ENDPOINTS.OPPORTUNITIES.BY_ID(id))
      .pipe(
        tap(() => {
          this.opportunitiesSignal.update(opportunities =>
            opportunities.filter(o => o.id !== id)
          );
        })
      );
  }
}
