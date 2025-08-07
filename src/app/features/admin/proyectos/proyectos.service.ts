import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_CONFIG } from '@app/core/constants/api-endpoints';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProyectosService {
  private apiUrl = `${API_CONFIG.BASE_URL}/proyectos`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(proyecto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, proyecto);
  }

  update(id: string, proyecto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, proyecto);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
