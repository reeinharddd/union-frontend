import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_CONFIG } from '@app/core/constants/api-endpoints';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BackupApiClientService {
  private baseUrl = `${API_CONFIG.BASE_URL}/admin-backup`;

  constructor(private http: HttpClient) {}

  ejecutarRespaldoCompleto(): Observable<Blob> {
    return this.http.post(
      `${this.baseUrl}/execute-bat`,
      {},
      {
        responseType: 'blob',
      },
    );
  }

  ejecutarRespaldoParcial(tables: string[]): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/partial`,
      { tables },
      {
        responseType: 'blob',
      },
    );
  }

  restaurarCompleto(): Observable<any> {
    return this.http.post(`${this.baseUrl}/restore-full`, {});
  }

  restaurarParcial(): Observable<any> {
    return this.http.post(`${this.baseUrl}/restore-partial`, {});
  }

  exportarTablaCsv(table: string): Observable<Blob> {
    //const params = new HttpParams().set('schema', schema);
    return this.http.get(`${this.baseUrl}/export-csv/${table}`, { responseType: 'blob' });
  }
}
