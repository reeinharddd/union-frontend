import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '../../../../core/models/project/project.interface';
import { ProjectService } from '../../../../core/services/project/project.service';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-detail.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectDetailComponent implements OnInit {
  // Servicios inyectados
  private projectService = inject(ProjectService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Signals para manejo reactivo del estado
  project = signal<Project | null>(null);
  isLoading = signal(false);
  showVerificationModal = signal(false);
  showEditModal = signal(false);

  // ID del proyecto obtenido de la ruta
  projectId = signal<number | null>(null);

  // Formularios reactivos
  verificationForm: FormGroup;
  editForm: FormGroup;

  // Estados de verificación disponibles
  estadosVerificacion = [
    { value: 'pendiente', label: 'Pendiente', color: 'yellow', icon: 'clock' },
    { value: 'aprobado', label: 'Aprobado', color: 'green', icon: 'check-circle' },
    { value: 'rechazado', label: 'Rechazado', color: 'red', icon: 'times-circle' },
  ];

  constructor() {
    // Inicializar formulario de verificación
    this.verificationForm = this.fb.group({
      estado_verificacion: ['', Validators.required],
      comentario: ['', [Validators.maxLength(500)]],
    });

    // Inicializar formulario de edición
    this.editForm = this.fb.group({
      vista_publica: [false],
      comentario_admin: ['', [Validators.maxLength(500)]],
    });
  }

  ngOnInit(): void {
    // Obtener ID del proyecto de la ruta
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.projectId.set(parseInt(id, 10));
      this.cargarProyecto();
    } else {
      this.mostrarError('ID de proyecto no válido');
      this.router.navigate(['/admin-uni/projects']);
    }
  }

  /**
   * Cargar detalles del proyecto
   */
  cargarProyecto(): void {
    const id = this.projectId();
    if (!id) return;

    this.isLoading.set(true);
    console.log('Cargando proyecto con ID:', id);

    this.projectService.getById(id).subscribe({
      next: proyecto => {
        console.log('Proyecto cargado:', proyecto);
        console.log('repositorio_url:', proyecto.repositorio_url);
        console.log('demo_url:', proyecto.demo_url);
        console.log('Todas las propiedades del proyecto:', Object.keys(proyecto));
        this.project.set(proyecto);

        // Precargar formularios con datos actuales
        this.verificationForm.patchValue({
          estado_verificacion: proyecto.estado_verificacion,
        });

        this.editForm.patchValue({
          vista_publica: proyecto.vista_publica,
        });
      },
      error: error => {
        console.error('Error al cargar proyecto:', error);
        if (error.status === 404) {
          this.mostrarError('Proyecto no encontrado');
        } else {
          this.mostrarError('Error al cargar el proyecto');
        }
        this.router.navigate(['/admin-uni/projects']);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }

  /**
   * Abrir modal de verificación
   */
  abrirModalVerificacion(): void {
    const proyecto = this.project();
    if (!proyecto) return;

    console.log('Abriendo modal de verificación para proyecto:', proyecto.nombre);
    this.verificationForm.patchValue({
      estado_verificacion: proyecto.estado_verificacion,
      comentario: '',
    });
    this.showVerificationModal.set(true);
  }

  /**
   * Cerrar modal de verificación
   */
  cerrarModalVerificacion(): void {
    this.showVerificationModal.set(false);
    this.verificationForm.reset();
  }

  /**
   * Verificar proyecto
   */
  verificarProyecto(): void {
    const proyecto = this.project();
    if (this.verificationForm.invalid || !proyecto) {
      this.verificationForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const formData = this.verificationForm.value;

    const updateData: any = {
      estado_verificacion: formData.estado_verificacion,
    };

    console.log('Verificando proyecto:', proyecto.id, updateData);

    this.projectService.update(proyecto.id, updateData).subscribe({
      next: response => {
        console.log('Proyecto verificado exitosamente:', response);
        const estadoLabel = this.estadosVerificacion.find(
          e => e.value === formData.estado_verificacion,
        )?.label;
        this.mostrarExito(`Proyecto ${estadoLabel?.toLowerCase()} exitosamente`);

        this.cerrarModalVerificacion();
        this.cargarProyecto(); // Recargar datos actualizados
      },
      error: error => {
        console.error('Error al verificar proyecto:', error);
        this.manejarErrorVerificacion(error);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }

  /**
   * Abrir modal de edición
   */
  abrirModalEdicion(): void {
    const proyecto = this.project();
    if (!proyecto) return;

    console.log('Abriendo modal de edición para proyecto:', proyecto.nombre);
    this.editForm.patchValue({
      vista_publica: proyecto.vista_publica,
      comentario_admin: '',
    });
    this.showEditModal.set(true);
  }

  /**
   * Cerrar modal de edición
   */
  cerrarModalEdicion(): void {
    this.showEditModal.set(false);
    this.editForm.reset();
  }

  /**
   * Actualizar configuración del proyecto
   */
  actualizarProyecto(): void {
    const proyecto = this.project();
    if (this.editForm.invalid || !proyecto) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const formData = this.editForm.value;

    const updateData: any = {
      vista_publica: formData.vista_publica,
    };

    console.log('Actualizando proyecto:', proyecto.id, updateData);

    this.projectService.update(proyecto.id, updateData).subscribe({
      next: response => {
        console.log('Proyecto actualizado exitosamente:', response);
        this.mostrarExito('Configuración del proyecto actualizada exitosamente');

        this.cerrarModalEdicion();
        this.cargarProyecto(); // Recargar datos actualizados
      },
      error: error => {
        console.error('Error al actualizar proyecto:', error);
        this.manejarErrorVerificacion(error);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }

  /**
   * Volver a la lista de proyectos
   */
  volverALista(): void {
    this.router.navigate(['/admin-uni/projects']);
  }

  /**
   * Obtener configuración del estado de verificación
   */
  obtenerConfigEstado(estado: string) {
    return (
      this.estadosVerificacion.find(e => e.value === estado) || {
        value: estado,
        label: estado,
        color: 'gray',
        icon: 'question',
      }
    );
  }

  /**
   * Obtener clase CSS según estado de verificación
   */
  obtenerClaseEstado(estado: string): string {
    const config = this.obtenerConfigEstado(estado);
    return `bg-${config.color}-100 text-${config.color}-800`;
  }

  /**
   * Formatear fecha para mostrar
   */
  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  /**
   * Formatear fecha relativa (hace X tiempo)
   */
  formatearFechaRelativa(fecha: string): string {
    const fechaCreacion = new Date(fecha);
    const ahora = new Date();
    const diferenciaDias = Math.floor(
      (ahora.getTime() - fechaCreacion.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diferenciaDias === 0) {
      return 'Hoy';
    } else if (diferenciaDias === 1) {
      return 'Hace 1 día';
    } else if (diferenciaDias < 7) {
      return `Hace ${diferenciaDias} días`;
    } else if (diferenciaDias < 30) {
      const semanas = Math.floor(diferenciaDias / 7);
      return `Hace ${semanas} semana${semanas > 1 ? 's' : ''}`;
    } else if (diferenciaDias < 365) {
      const meses = Math.floor(diferenciaDias / 30);
      return `Hace ${meses} mes${meses > 1 ? 'es' : ''}`;
    } else {
      const años = Math.floor(diferenciaDias / 365);
      return `Hace ${años} año${años > 1 ? 's' : ''}`;
    }
  }

  /**
   * Verificar si el proyecto es reciente (últimos 7 días)
   */
  esProyectoReciente(fecha: string): boolean {
    const fechaCreacion = new Date(fecha);
    const ahora = new Date();
    const diferenciaDias = (ahora.getTime() - fechaCreacion.getTime()) / (1000 * 60 * 60 * 24);
    return diferenciaDias <= 7;
  }

  /**
   * Verificar si una URL es válida
   */
  esUrlValida(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Verificar si el proyecto tiene enlaces disponibles
   */
  tieneEnlaces(): boolean {
    const proyecto = this.project();
    if (!proyecto) return false;

    return this.tieneRepositorio() || this.tieneDemo();
  }

  /**
   * Verificar si tiene repositorio válido
   */
  tieneRepositorio(): boolean {
    const proyecto = this.project();
    return !!(
      proyecto?.repositorio_url &&
      proyecto.repositorio_url.trim() &&
      proyecto.repositorio_url !== 'null'
    );
  }

  /**
   * Verificar si tiene demo válido
   */
  tieneDemo(): boolean {
    const proyecto = this.project();
    return !!(proyecto?.demo_url && proyecto.demo_url.trim() && proyecto.demo_url !== 'null');
  }

  /**
   * Obtener URL completa con protocolo
   */
  obtenerUrlCompleta(url: string): string {
    if (!url) return '';

    // Si ya tiene protocolo, devolverla tal como está
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // Si no tiene protocolo, agregar https://
    return `https://${url}`;
  }

  // Métodos de utilidad
  private manejarErrorVerificacion(error: any): void {
    console.log('Manejando error:', error);

    if (error.status === 404) {
      this.mostrarError('El proyecto no fue encontrado');
    } else if (error.status === 400) {
      this.mostrarError('Datos inválidos');
    } else if (error.status === 401) {
      this.mostrarError('No tienes permisos para realizar esta acción');
    } else if (error.status === 0) {
      this.mostrarError('No se pudo conectar con el servidor');
    } else {
      const mensajeError = error.error?.message || error.message || 'Error desconocido';
      this.mostrarError(`Error: ${mensajeError}`);
    }
  }

  private mostrarExito(mensaje: string): void {
    // Implementar sistema de notificaciones
    alert(mensaje); // Temporal
  }

  private mostrarError(mensaje: string): void {
    // Implementar sistema de notificaciones
    alert(mensaje); // Temporal
  }
}
