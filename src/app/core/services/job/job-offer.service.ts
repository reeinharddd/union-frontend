// src/app/core/services/job/job-offer.service.ts
import { computed, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { BaseService } from '../base/base.service';
import { JobOffer, JobOffersFilters } from '@app/core/models/job/job.interface';


@Injectable({
  providedIn: 'root'
})
export class JobOfferService extends BaseService {
  protected readonly serviceName = 'JobOfferService';

  private readonly _jobOffers = signal<JobOffer[]>([]);
  readonly jobOffers = this._jobOffers.asReadonly();

  readonly activeJobOffers = computed(() =>
    this._jobOffers().filter(job => job.estado === 'activo')
  );

  getAll(filters: JobOffersFilters = {}): Observable<{ data: JobOffer[] }> {
    return this.handleRequest(
      this.apiClient.get<{ data: JobOffer[] }>('/ofertas-laborales', filters),
      'jobOffers.getAll',
      { logRequest: true }
    ).pipe(
      tap(response => {
        this._jobOffers.set(response.data);
        console.log(`💼 Loaded ${response.data.length} job offers`);
      })
    );
  }
}
