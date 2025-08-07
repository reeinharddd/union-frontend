
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Project, ProjectsFilters } from '../../../core/models/project/project.interface';
import { ProjectService } from '../../../core/services/project/project.service';
import { UserService } from '../../../core/services/user/user.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './projects.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsComponent implements OnInit {
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.cargarProyectos().then(() => {
      this.cargarNombresCreadores();
    });
  }

  /**
   * Cargar los nombres de los creadores de los proyectos actuales
   */
  private cargarNombresCreadores(): void {
    // Limpiar el cache para evitar mostrar nombres incorrectos si cambia la lista
    this.userNames = {};
    const proyectos = this.projects();
    const ids = Array.from(new Set(proyectos.map(p => p.creador_id)));
    let pending = ids.length;
    if (pending === 0) {
      this.cdr.markForCheck();
      return;
    }
    ids.forEach(id => {
      this.userService.getById(id).subscribe({
        next: (user) => {
          this.userNames[id] = user.nombre || 'Desconocido';
          pending--;
          if (pending === 0) this.cdr.markForCheck();
        },
        error: () => {
          this.userNames[id] = 'Desconocido';
          pending--;
          if (pending === 0) this.cdr.markForCheck();
        }
      });
    });
  }

  // Diccionario para cachear nombres de usuario por id
  public userNames: { [key: number]: string } = {};

  // Servicios inyectados
  private projectService = inject(ProjectService);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // Signals para manejo reactivo del estado
  projects = signal<Project[]>([]);
  isLoading = signal(false);
  showVerificationModal = signal(false);
  selectedProject = signal<Project | null>(null);

  // Estadísticas para dashboard
  estadisticas = signal({
    total_proyectos: 0,
    proyectos_pendientes: 0,
    proyectos_aprobados: 0,
    proyectos_rechazados: 0,
    proyectos_publicos: 0,
    nuevos_este_mes: 0
  });

  // Paginación
  currentPage = signal(1);
  totalPages = signal(1);
  itemsPerPage = 10;

  // Formulario de verificación
  verificationForm: FormGroup;

  // Estados de verificación disponibles
  estadosVerificacion = [
    { value: 'pendiente', label: 'Pendiente', color: 'yellow' },
    { value: 'aprobado', label: 'Aprobado', color: 'green' },
    { value: 'rechazado', label: 'Rechazado', color: 'red' }
  ];

  constructor() {
    // Inicializar formulario de verificación
    this.verificationForm = this.fb.group({
      estado_verificacion: ['', Validators.required],
      comentario: ['', [Validators.maxLength(500)]]
    });
  }

  /**
   * Cargar lista de proyectos de la universidad
   * REQ-4.8: Mostrar proyectos de la universidad
   */
  cargarProyectos(): Promise<void> {
    const filtros: ProjectsFilters = {
      universidad_id: this.obtenerUniversidadId(),
      limit: this.itemsPerPage,
      offset: (this.currentPage() - 1) * this.itemsPerPage
    };

    console.log('Cargando proyectos con filtros:', filtros);

    return new Promise((resolve, reject) => {
      this.projectService.getAll(filtros).subscribe({
        next: (response) => {
          console.log('Respuesta del backend para proyectos:', response);
          
          if (response && response.data) {
            this.projects.set(response.data);
            this.totalPages.set(response.pagination?.totalPages || 1);
            console.log('Proyectos cargados:', response.data.length);
          } else if (Array.isArray(response)) {
            // Si el backend devuelve directamente un array
            this.projects.set(response);
            this.totalPages.set(1);
            console.log('Proyectos cargados (array directo):', response.length);
          } else {
            console.warn('Estructura de respuesta inesperada:', response);
            this.projects.set([]);
            this.totalPages.set(1);
          }
          
          resolve();
          // Cargar nombres de creadores cada vez que se actualizan los proyectos
          this.cargarNombresCreadores();
        },
        error: (error) => {
          console.error('Error al cargar proyectos:', error);
          
          if (error.status === 404) {
            // No hay proyectos, no es un error real
            this.projects.set([]);
            resolve();
            return;
          } else {
            this.mostrarError('Error al cargar los proyectos: ' + (error.message || 'Error desconocido'));
          }
          
          this.projects.set([]);
          reject(error);
        }
      });
    });
  }

  /**
   * Calcular estadísticas basadas en los proyectos cargados
   */
  private calcularEstadisticas(): Promise<void> {
    return new Promise((resolve) => {
      const proyectos = this.projects();
      const ahora = new Date();
      const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      
      const estadisticasCalculadas = {
        total_proyectos: proyectos.length,
        proyectos_pendientes: proyectos.filter(p => p.estado_verificacion === 'pendiente').length,
        proyectos_aprobados: proyectos.filter(p => p.estado_verificacion === 'aprobado').length,
        proyectos_rechazados: proyectos.filter(p => p.estado_verificacion === 'rechazado').length,
        proyectos_publicos: proyectos.filter(p => p.vista_publica).length,
        nuevos_este_mes: proyectos.filter(p => {
          const fechaCreacion = new Date(p.creado_en);
          return fechaCreacion >= inicioMes;
        }).length
      };

      console.log('Estadísticas de proyectos calculadas:', estadisticasCalculadas);
      this.estadisticas.set(estadisticasCalculadas);
      resolve();
    });
  }

  /**
   * Abrir modal de verificación de proyecto
   * REQ-4.8: Verificación de proyectos por instituciones
   */
  abrirModalVerificacion(proyecto: Project): void {
    console.log('Abriendo modal de verificación para proyecto:', proyecto);
    this.selectedProject.set(proyecto);
    
    // Precargar el estado actual del proyecto
    this.verificationForm.patchValue({
      estado_verificacion: proyecto.estado_verificacion,
      comentario: ''
    });
    
    this.showVerificationModal.set(true);
  }

  /**
   * Cerrar modal de verificación
   */
  cerrarModalVerificacion(): void {
    this.showVerificationModal.set(false);
    this.selectedProject.set(null);
    this.verificationForm.reset();
  }

  /**
   * Verificar proyecto (aprobar, rechazar o mantener pendiente)
   * REQ-4.8: Verificación de proyectos por instituciones
   */
  verificarProyecto(): void {
    console.log('Iniciando verificación de proyecto...');
    console.log('Formulario válido:', this.verificationForm.valid);
    console.log('Proyecto seleccionado:', this.selectedProject());
    console.log('Valores del formulario:', this.verificationForm.value);
    
    if (this.verificationForm.invalid || !this.selectedProject()) {
      console.log('Formulario inválido o no hay proyecto seleccionado');
      this.verificationForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const proyectoId = this.selectedProject()!.id;
    const formData = this.verificationForm.value;
    
    // Preparar datos de actualización
    const updateData: any = {
      estado_verificacion: formData.estado_verificacion
    };

    console.log('ID del proyecto a verificar:', proyectoId);
    console.log('Datos a enviar:', updateData);

    this.projectService.update(proyectoId, updateData).subscribe({
      next: (response) => {
        console.log('Respuesta exitosa de verificación:', response);
        
        const estadoLabel = this.estadosVerificacion.find(e => e.value === formData.estado_verificacion)?.label;
        this.mostrarExito(`Proyecto ${estadoLabel?.toLowerCase()} exitosamente`);
        
        this.cerrarModalVerificacion();
        
        // Recargar proyectos y recalcular estadísticas
        this.cargarProyectos().then(() => {
          this.calcularEstadisticas();
        });
      },
      error: (error) => {
        console.error('Error completo al verificar proyecto:', error);
        console.error('Estado del error:', error.status);
        console.error('Mensaje del error:', error.message);
        console.error('Respuesta del error:', error.error);
        this.manejarErrorVerificacion(error);
      },
      complete: () => {
        console.log('Proceso de verificación completado');
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Ver detalles del proyecto
   */
  verDetallesProyecto(proyecto: Project): void {
    console.log('Navegando a detalles del proyecto:', proyecto.id);
    this.router.navigate(['/admin-uni/project-detail', proyecto.id]);
  }

  /**
   * Cambiar página de proyectos
   */
  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPages()) {
      console.log(`Cambiando a página ${nuevaPagina}`);
      this.currentPage.set(nuevaPagina);
      
      this.cargarProyectos().then(() => {
        this.calcularEstadisticas();
        console.log(`Página ${nuevaPagina} cargada. Proyectos: ${this.projects().length}`);
      }).catch((error) => {
        console.error('Error al cambiar página:', error);
        this.mostrarError('Error al cargar la página');
      });
    }
  }

  /**
   * Obtener clase CSS según estado de verificación
   */
  obtenerClaseEstado(estado: string): string {
    const estadoConfig = this.estadosVerificacion.find(e => e.value === estado);
    const color = estadoConfig?.color || 'gray';
    
    return `bg-${color}-100 text-${color}-800`;
  }

  /**
   * Obtener label legible del estado
   */
  obtenerLabelEstado(estado: string): string {
    return this.estadosVerificacion.find(e => e.value === estado)?.label || estado;
  }

  /**
   * Formatear fecha para mostrar
   */
  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  /**
   * Verificar si el proyecto es reciente (creado en los últimos 7 días)
   */
  esProyectoReciente(fecha: string): boolean {
    const fechaCreacion = new Date(fecha);
    const ahora = new Date();
    const diferenciaDias = (ahora.getTime() - fechaCreacion.getTime()) / (1000 * 60 * 60 * 24);
    return diferenciaDias <= 7;
  }

  // Métodos de utilidad
  private obtenerUniversidadId(): number {
    // TODO: Obtener del token JWT o estado de autenticación
    // Por ahora returno un valor por defecto para testing
    const universidadId = 1;
    console.log('Universidad ID obtenida:', universidadId);
    return universidadId;
  }

  private manejarErrorVerificacion(error: any): void {
    console.log('Manejando error de verificación:', error);
    
    if (error.status === 404) {
      this.mostrarError('El proyecto no fue encontrado');
    } else if (error.status === 400) {
      this.mostrarError('Datos de verificación inválidos');
    } else if (error.status === 401) {
      this.mostrarError('No tienes permisos para verificar proyectos');
    } else if (error.status === 0) {
      this.mostrarError('No se pudo conectar con el servidor. Verifica tu conexión');
    } else {
      const mensajeError = error.error?.message || error.message || 'Error desconocido';
      this.mostrarError(`Error al verificar el proyecto: ${mensajeError}`);
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
