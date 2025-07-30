import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BackupApiClientService {
  private baseUrl = 'http://localhost:3000/api/admin-backup';

  constructor(private http: HttpClient) {}

  ejecutarRespaldoCompleto(): Observable<any> {
    return this.http.post(`${this.baseUrl}/execute-bat`, {});
  }

  ejecutarRespaldoParcial(tables: string[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/partial`, { tables });
  }

  restaurarCompleto(): Observable<any> {
    return this.http.post(`${this.baseUrl}/restore-full`, {});
  }

  restaurarParcial(): Observable<any> {
    return this.http.post(`${this.baseUrl}/restore-partial`, {});
  }

  exportarTablaCsv(table: string, schema: string = 'public'): Observable<Blob> {
    const params = new HttpParams().set('schema', schema);
    return this.http.get(`${this.baseUrl}/export-csv/${table}`, { params, responseType: 'blob' });
  }
}
