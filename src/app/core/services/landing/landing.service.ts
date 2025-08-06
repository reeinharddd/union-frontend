import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ENDPOINTS } from '@app/core/constants/api-endpoints';
import { API_CONFIG } from '@app/core/constants/api-endpoints';

export interface ContactFormData {
  nombre: string;
  correo: string;
  rol: 'admin_uni' | 'promotor';
  universidad?: string;
  region?: string;
}

export interface ContactFormResponse {
  success: boolean;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class LandingService {
  constructor(private http: HttpClient) {}

  sendContactForm(formData: ContactFormData): Observable<ContactFormResponse> {
    return this.http.post<ContactFormResponse>(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.LANDING.CONTACT}`,
      formData,
    );
  }
}
