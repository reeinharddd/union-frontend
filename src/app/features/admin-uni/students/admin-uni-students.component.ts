import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  AdminUniService,
  CreateStudentRequest,
} from '@app/core/services/admin-uni/admin-uni.service';
import { AuthService } from '@app/core/services/auth/auth.service';

@Component({
  selector: 'app-admin-student',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admin-uni-students.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUniStudentsComponent implements OnInit {
  // Servicios inyectados
  private readonly adminUniService = inject(AdminUniService);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  // Signals para el estado del componente
  readonly isCreating = signal<boolean>(false);
  readonly showCreateForm = signal<boolean>(false);
  readonly searchQuery = signal<string>('');

  // Formulario reactivo para crear estudiante
  createStudentForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    correo: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.pattern(/^[0-9]{10}$/)]], // Opcional, pero si se proporciona debe ser válido
  });

  // Acceso a los signals del servicio
  get students() {
    return this.adminUniService.students;
  }
  get loading() {
    return this.adminUniService.loading;
  }
  get studentsCount() {
    return this.adminUniService.studentsCount;
  }

  // ✅ Obtener la universidad del administrador actual
  get currentUserUniversity() {
    const currentUser = this.authService.currentUser();
    return currentUser?.universidad_id;
  }

  ngOnInit(): void {
    this.loadStudents();
  }

  /**
   * ✅ Cargar lista de estudiantes de la universidad del admin
   * Solo muestra estudiantes de la misma universidad según REQ-4.11.5
   */
  loadStudents(): void {
    const universityId = this.currentUserUniversity;

    if (!universityId) {
      console.error('❌ No se pudo determinar la universidad del administrador');
      return;
    }

    console.log('📋 Cargando estudiantes de la universidad:', universityId);

    this.adminUniService.getStudentsByUniversity(universityId).subscribe({
      next: students => {
        console.log('✅ Estudiantes cargados para universidad', universityId, ':', students);
      },
      error: error => {
        console.error('❌ Error cargando estudiantes de la universidad:', error);
      },
    });
  }

  /**
   * ✅ Mostrar/ocultar formulario de creación
   */
  toggleCreateForm(): void {
    this.showCreateForm.update(show => !show);
    if (!this.showCreateForm()) {
      this.resetCreateForm();
    }
  }

  /**
   * ✅ Crear nuevo estudiante
   */
  createStudent(): void {
    if (this.createStudentForm.valid) {
      this.isCreating.set(true);

      const studentData: CreateStudentRequest = this.createStudentForm.value;

      this.adminUniService.createStudent(studentData).subscribe({
        next: response => {
          console.log('✅ Estudiante creado exitosamente:', response);
          this.resetCreateForm();
          this.showCreateForm.set(false);
          this.isCreating.set(false);
          // Recargar la lista para mostrar el nuevo estudiante
          this.loadStudents();
        },
        error: error => {
          console.error('❌ Error creando estudiante:', error);
          this.isCreating.set(false);
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  /**
   * ✅ Buscar estudiantes
   */
  searchStudents(): void {
    const query = this.searchQuery();
    if (query.trim()) {
      this.adminUniService.searchStudents(query).subscribe({
        next: results => {
          console.log('🔍 Resultados de búsqueda:', results);
        },
        error: error => {
          console.error('❌ Error en búsqueda:', error);
        },
      });
    } else {
      this.loadStudents(); // Si no hay query, mostrar todos
    }
  }

  /**
   * ✅ Limpiar búsqueda
   */
  clearSearch(): void {
    this.searchQuery.set('');
    this.loadStudents();
  }

  /**
   * ✅ Obtener iniciales del nombre
   */
  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  /**
   * ✅ Verificar si un campo del formulario tiene error
   */
  hasFieldError(fieldName: string): boolean {
    const field = this.createStudentForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * ✅ Obtener mensaje de error para un campo
   */
  getFieldError(fieldName: string): string {
    const field = this.createStudentForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['email']) return 'Correo electrónico inválido';
      if (field.errors['minlength']) return `${fieldName} muy corto`;
      if (field.errors['pattern']) return 'Formato inválido';
    }
    return '';
  }

  /**
   * ✅ Resetear formulario
   */
  private resetCreateForm(): void {
    this.createStudentForm.reset();
    this.createStudentForm.markAsUntouched();
  }

  /**
   * ✅ Marcar todos los campos como tocados para mostrar errores
   */
  private markFormGroupTouched(): void {
    Object.keys(this.createStudentForm.controls).forEach(key => {
      this.createStudentForm.get(key)?.markAsTouched();
    });
  }
}
