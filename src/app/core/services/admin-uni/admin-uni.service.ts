import { computed, Injectable, signal } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { User } from '../../models/user/user.interface';
import { BaseService } from '../base/base.service';

// Interfaces específicas para AdminUni
export interface CreateStudentRequest {
  nombre: string;
  correo: string;
}

export interface Student extends User {
  matricula?: string;
}

export interface CreateStudentResponse {
  message: string;
  alumno: Student;
}

@Injectable({
  providedIn: 'root'
})
export class AdminUniService extends BaseService {
  protected readonly serviceName = 'AdminUniService';

  // Estado local con signals
  private readonly _students = signal<Student[]>([]);
  private readonly _loading = signal<boolean>(false);

  // Signals de solo lectura
  readonly students = this._students.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly studentsCount = computed(() => this._students().length);

  /**
   * ✅ Crear nuevo alumno - Endpoint POST /api/usuarios/alumnos
   * Solo los administradores universitarios pueden registrar alumnos
   * 
   * @param studentData - Datos del estudiante a crear
   * @returns Observable con la respuesta del servidor
   */
  createStudent(studentData: CreateStudentRequest): Observable<CreateStudentResponse> {
    console.log('📝 Creando nuevo estudiante:', studentData);
    
    return this.handleRequest(
      this.apiClient.post<CreateStudentResponse>('/usuarios/alumnos', studentData),
      'admin-uni.createStudent',
      {
        showSuccessToast: true,
        successMessage: 'Alumno registrado exitosamente. Token enviado por correo.',
        logRequest: true,
      }
    ).pipe(
      tap(response => {
        console.log('✅ Estudiante creado exitosamente:', response);
        // Agregar el nuevo estudiante a la lista local
        if (response.alumno) {
          this._students.update(students => [...students, response.alumno]);
        }
      }),
      catchError((error: any) => {
        console.error('❌ Error completo:', error);
        console.error('❌ Error body:', error.error);
        
        // Manejo específico de errores de base de datos
        if (error.status === 500) {
          const errorMessage = error.error?.error || error.error?.message || '';
          
          if (errorMessage.includes('llave duplicada') || 
              errorMessage.includes('duplicate key') ||
              errorMessage.includes('usuarios_pkey')) {
            console.error('❌ Error de clave primaria duplicada en usuarios');
            throw new Error('Error de base de datos: Conflicto de ID en tabla usuarios. Contacta al administrador técnico.');
          } else if (errorMessage.includes('Error al crear alumno')) {
            console.error('❌ Error general al crear alumno');
            throw new Error('Error al registrar el alumno. Verifica los datos e inténtalo nuevamente.');
          }
        } else if (error.status === 403) {
          const errorMessage = error.error?.error || 'Error de permisos';
          
          if (errorMessage.toLowerCase().includes('duplicado') || 
              errorMessage.toLowerCase().includes('ya existe')) {
            throw new Error('❌ El correo electrónico ya está registrado en el sistema');
          } else if (errorMessage.includes('No autorizado')) {
            throw new Error('❌ No tienes permisos para registrar alumnos. Verifica tu rol de Administración Universitaria');
          }
        }
        
        return throwError(() => error);
      })
    );
  }

  /**
   * ✅ Obtener todos los estudiantes/alumnos
   * Filtrar por rol_id = 2 (estudiantes)
   * 
   * @returns Observable con la lista de estudiantes
   */
  getStudents(): Observable<Student[]> {
    console.log('📋 Obteniendo lista de estudiantes...');
    
    return this.handleRequest(
      this.apiClient.get<Student[]>(`${API_ENDPOINTS.USERS.BASE}?rol_id=2`),
      'admin-uni.getStudents',
      { logRequest: true }
    ).pipe(
      tap(students => {
        console.log('✅ Estudiantes obtenidos:', students);
        this._students.set(students);
      })
    );
  }

  /**
   * ✅ Obtener estudiantes por universidad
   * Filtrar por universidad y rol_id = 2 (estudiantes)
   * Implementa REQ-4.11.5: Admin universitarios solo pueden acceder a datos de su institución
   * 
   * @param universityId - ID de la universidad
   * @returns Observable con la lista de estudiantes de esa universidad
   */
  getStudentsByUniversity(universityId: number): Observable<Student[]> {
    console.log('🏫 Obteniendo estudiantes por universidad:', universityId);
    
    return this.handleRequest(
      this.apiClient.get<Student[]>(`${API_ENDPOINTS.USERS.BASE}?rol_id=2&universidad_id=${universityId}`),
      'admin-uni.getStudentsByUniversity',
      { logRequest: true }
    ).pipe(
      tap(students => {
        console.log('✅ Estudiantes de universidad obtenidos:', students);
        this._students.set(students);
      }),
      catchError(error => {
        console.error('❌ Error obteniendo estudiantes por universidad:', error);
        
        if (error.status === 403) {
          throw new Error('❌ No tienes permisos para ver estudiantes de esta universidad');
        } else if (error.status === 404) {
          throw new Error('❌ Universidad no encontrada');
        }
        
        return throwError(() => error);
      })
    );
  }

  /**
   * ✅ Obtener un estudiante específico por ID
   * 
   * @param id - ID del estudiante
   * @returns Observable con los datos del estudiante
   */
  getStudentById(id: number): Observable<Student> {
    console.log('🔍 Obteniendo estudiante por ID:', id);
    
    return this.handleRequest(
      this.apiClient.get<Student>(API_ENDPOINTS.USERS.BY_ID(id)),
      `admin-uni.getStudent.${id}`,
      { logRequest: true }
    );
  }

  /**
   * ✅ Buscar estudiantes por nombre o correo
   * 
   * @param query - Término de búsqueda
   * @returns Observable con los resultados de búsqueda
   */
  searchStudents(query: string): Observable<Student[]> {
    console.log('🔍 Buscando estudiantes:', query);
    
    return this.handleRequest(
      this.apiClient.get<Student[]>(`${API_ENDPOINTS.USERS.BASE}?search=${query}&rol_id=2`),
      'admin-uni.searchStudents',
      { logRequest: true }
    );
  }

  /**
   * ✅ Limpiar estado del servicio
   */
  clearState(): void {
    this._students.set([]);
    this._loading.set(false);
  }
}
