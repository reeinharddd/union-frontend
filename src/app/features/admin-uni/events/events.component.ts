import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  AdminUniEventsService,
  EstadoEvento,
  EventoCreacionRequest,
  EventoUniversitario,
  TipoEvento,
} from '../../../core/services/admin-uni/admin-uni-events.services';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './events.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsComponent implements OnInit {
  // Servicios inyectados
  private eventsService = inject(AdminUniEventsService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  // Signals para manejo reactivo del estado
  eventos = signal<EventoUniversitario[]>([]);
  tiposEventos = signal<TipoEvento[]>([]);
  estadosEventos = signal<EstadoEvento[]>([]);
  isLoading = signal(false);
  showCreateModal = signal(false);
  showEditModal = signal(false);
  selectedEvento = signal<EventoUniversitario | null>(null);

  // Estadísticas para dashboard
  estadisticas = signal({
    total_eventos: 0,
    eventos_activos: 0,
    eventos_proximos: 0,
    eventos_finalizados: 0,
    total_registros: 0,
    capacidad_utilizada: 0,
  });

  // Paginación
  currentPage = signal(1);
  totalPages = signal(1);
  itemsPerPage = 10;

  // Formularios reactivos
  createEventForm: FormGroup;
  editEventForm: FormGroup;

  constructor() {
    // Inicializar formulario de creación - REQ-4.14.1
    this.createEventForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]],
      tipo: ['presencial', Validators.required],
      event_type_id: [1, Validators.required],
      state_id: [1, Validators.required],
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', Validators.required],
      ubicacion: [''],
      enlace_acceso: [''],
      capacidad_maxima: [null, [Validators.min(1), Validators.max(1000)]],
    });

    // Inicializar formulario de edición
    this.editEventForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]],
      tipo: ['presencial', Validators.required],
      event_type_id: [1, Validators.required],
      state_id: [1, Validators.required],
      fecha_inicio: ['', Validators.required],
      fecha_fin: ['', Validators.required],
      ubicacion: [''],
      enlace_acceso: [''],
      capacidad_maxima: [null, [Validators.min(1), Validators.max(1000)]],
    });
  }

  ngOnInit(): void {
    this.cargarDatosIniciales();
    this.configurarValidadoresFecha();
  }

  /**
   * Cargar datos iniciales necesarios para el componente
   * REQ-4.14.2: Mostrar eventos disponibles
   */
  private cargarDatosIniciales(): void {
    this.isLoading.set(true);
    console.log('Iniciando carga de datos iniciales...');

    // Cargar tipos y estados primero, luego eventos y estadísticas
    Promise.all([this.cargarTiposEventos(), this.cargarEstadosEventos()])
      .then(() => {
        // Después de cargar tipos y estados, cargar eventos
        return this.cargarEventos();
      })
      .then(() => {
        // Después de cargar eventos, calcular estadísticas
        return this.cargarEstadisticas();
      })
      .then(() => {
        console.log('Todos los datos cargados exitosamente');
        console.log('Eventos cargados:', this.eventos().length);
        console.log('Estadísticas finales:', this.estadisticas());
      })
      .catch(error => {
        console.error('Error en carga inicial de datos:', error);
        this.mostrarError('Error al cargar los datos iniciales');
      })
      .finally(() => {
        this.isLoading.set(false);
      });
  }

  /**
   * Cargar lista de eventos
   * REQ-4.14.2: Mostrar eventos disponibles
   */
  cargarEventos(): Promise<void> {
    console.log('Cargando eventos...');

    return new Promise((resolve, reject) => {
      this.eventsService.obtenerEventos().subscribe({
        next: (response: any) => {
          // Usar any temporalmente para debug
          console.log('Respuesta del backend para eventos:', response); // Debug

          // Verificar estructura de respuesta del backend
          if (response && Array.isArray(response)) {
            // Si el backend devuelve directamente un array
            this.eventos.set(response);
            this.totalPages.set(1); // Por defecto si no hay paginación
            console.log('Eventos cargados (array directo):', response.length);
          } else if (response && response.eventos) {
            // Si el backend devuelve objeto con propiedad eventos
            this.eventos.set(response.eventos);
            this.totalPages.set(response.total_pages || 1);
            console.log('Eventos cargados (objeto.eventos):', response.eventos.length);
          } else if (response && response.data) {
            // Si el backend devuelve objeto con propiedad data
            this.eventos.set(response.data);
            this.totalPages.set(response.total_pages || 1);
            console.log('Eventos cargados (objeto.data):', response.data.length);
          } else {
            // Respuesta vacía o estructura desconocida
            console.warn('Estructura de respuesta inesperada:', response);
            this.eventos.set([]);
            this.totalPages.set(1);
          }

          // Log de eventos cargados para debugging
          const eventosActuales = this.eventos();
          console.log(`Total eventos cargados: ${eventosActuales.length}`);
          if (eventosActuales.length > 0) {
            console.log('Primer evento como ejemplo:', eventosActuales[0]);
          }

          resolve();
        },
        error: error => {
          console.error('Error al cargar eventos:', error);

          if (error.status === 404) {
            // No es realmente un error, solo no hay resultados
            this.eventos.set([]);
            resolve(); // Resolver en lugar de rechazar
            return;
          } else {
            this.mostrarError(
              'Error al cargar los eventos: ' + (error.message || 'Error desconocido'),
            );
          }

          this.eventos.set([]); // Limpiar eventos en caso de error
          reject(error);
        },
      });
    });
  }

  /**
   * Cargar tipos de eventos disponibles
   */
  private cargarTiposEventos(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.eventsService.obtenerTiposEventos().subscribe({
        next: tipos => {
          console.log('Tipos de eventos cargados:', tipos);
          this.tiposEventos.set(tipos);

          // Establecer el primer tipo como valor por defecto si hay tipos disponibles
          if (tipos.length > 0) {
            this.createEventForm.patchValue({ event_type_id: tipos[0].id });
            this.editEventForm.patchValue({ event_type_id: tipos[0].id });
          }

          resolve();
        },
        error: error => {
          console.error('Error al cargar tipos de eventos:', error);
          reject(error);
        },
      });
    });
  }

  /**
   * Cargar estados de eventos disponibles
   */
  private cargarEstadosEventos(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.eventsService.obtenerEstadosEventos().subscribe({
        next: estados => {
          this.estadosEventos.set(estados);
          resolve();
        },
        error: error => {
          console.error('Error al cargar estados de eventos:', error);
          reject(error);
        },
      });
    });
  }

  /**
   * Cargar estadísticas para el dashboard
   */
  private cargarEstadisticas(): Promise<void> {
    return new Promise(resolve => {
      this.eventsService.obtenerEstadisticasEventos().subscribe({
        next: stats => {
          console.log('Estadísticas del backend:', stats);
          this.estadisticas.set(stats);
          resolve();
        },
        error: error => {
          console.error('Error al cargar estadísticas:', error);
          // Si no hay estadísticas del backend, calcular localmente
          this.calcularEstadisticasLocales();
          resolve();
        },
      });
    });
  }

  /**
   * Calcular estadísticas basadas en los eventos cargados localmente
   */
  private calcularEstadisticasLocales(): void {
    const eventos = this.eventos();
    const ahora = new Date();

    const estadisticasCalculadas = {
      total_eventos: eventos.length,
      eventos_activos: eventos.filter(e => e.state_id === 1).length, // Estado activo
      eventos_proximos: eventos.filter(e => {
        const fechaEvento = new Date(e.fecha_inicio);
        return fechaEvento > ahora;
      }).length,
      eventos_finalizados: eventos.filter(e => {
        const fechaEvento = new Date(e.fecha_fin);
        return fechaEvento < ahora;
      }).length,
      total_registros: eventos.reduce((total, evento) => {
        // Si hay una propiedad de registros/asistencias, sumarla
        return total + (evento.capacidad_maxima || 0);
      }, 0),
      capacidad_utilizada: eventos.reduce((total, evento) => {
        // Calcular capacidad utilizada basada en eventos
        return total + (evento.capacidad_maxima || 0);
      }, 0),
    };

    console.log('Estadísticas calculadas localmente:', estadisticasCalculadas);
    this.estadisticas.set(estadisticasCalculadas);
  }

  /**
   * Crear nuevo evento
   * REQ-4.14.1: Solo universidades pueden crear eventos
   */
  crearEvento(): void {
    console.log('Iniciando creación de evento...');
    console.log('Formulario válido:', this.createEventForm.valid);
    console.log('Valores del formulario:', this.createEventForm.value);

    if (this.createEventForm.invalid) {
      console.log('Formulario inválido, marcando todos los campos como tocados');
      this.createEventForm.markAllAsTouched();

      // Log de errores específicos
      Object.keys(this.createEventForm.controls).forEach(key => {
        const control = this.createEventForm.get(key);
        if (control && control.invalid) {
          console.log(`Campo ${key} inválido:`, control.errors);
        }
      });
      return;
    }

    this.isLoading.set(true);

    // Preparar datos del evento con formato correcto
    const formData = this.createEventForm.value;

    // Enviar solo campos básicos para debugging
    const eventoData: EventoCreacionRequest = {
      titulo: formData.titulo?.trim() || '',
      descripcion: formData.descripcion?.trim() || '',
      tipo: formData.tipo || 'presencial',
      event_type_id: Number(formData.event_type_id) || 1,
      state_id: Number(formData.state_id) || 1,
      fecha_inicio: this.formatearFechaParaBackend(formData.fecha_inicio),
      fecha_fin: this.formatearFechaParaBackend(formData.fecha_fin),
      universidad_id: this.obtenerUniversidadId(),
      creador_id: this.obtenerCreadorId(), // Agregar el creador_id requerido
    };

    // Validaciones adicionales
    if (!eventoData.titulo || eventoData.titulo.length < 3) {
      this.mostrarError('El título debe tener al menos 3 caracteres');
      this.isLoading.set(false);
      return;
    }

    if (!eventoData.descripcion || eventoData.descripcion.length < 5) {
      this.mostrarError('La descripción debe tener al menos 5 caracteres');
      this.isLoading.set(false);
      return;
    }

    if (!eventoData.fecha_inicio || !eventoData.fecha_fin) {
      this.mostrarError('Las fechas de inicio y fin son requeridas');
      this.isLoading.set(false);
      return;
    }

    // Agregar campos opcionales solo si tienen valor
    if (formData.ubicacion && formData.ubicacion.trim() !== '') {
      (eventoData as any).ubicacion = formData.ubicacion.trim();
    }

    if (formData.enlace_acceso && formData.enlace_acceso.trim() !== '') {
      (eventoData as any).enlace_acceso = formData.enlace_acceso.trim();
    }

    if (formData.capacidad_maxima && formData.capacidad_maxima > 0) {
      (eventoData as any).capacidad_maxima = Number(formData.capacidad_maxima);
    }

    console.log('Datos a enviar al backend:', eventoData);
    console.log('Tipo de datos que se envían:');
    Object.keys(eventoData).forEach(key => {
      const value = (eventoData as any)[key];
      console.log(`${key}: "${value}" (tipo: ${typeof value})`);
    });

    this.eventsService.crearEvento(eventoData).subscribe({
      next: response => {
        console.log('Respuesta exitosa del backend:', response);

        // Manejo resiliente de la respuesta
        let tituloEvento = 'evento';
        if (response && typeof response === 'object') {
          if (response.evento && response.evento.titulo) {
            tituloEvento = response.evento.titulo;
          } else if ((response as any).titulo) {
            tituloEvento = (response as any).titulo;
          }
        }

        this.mostrarExito(`Evento "${tituloEvento}" creado exitosamente`);
        this.cerrarModalCrear();

        // Recargar eventos y recalcular estadísticas
        this.cargarEventos().then(() => {
          this.calcularEstadisticasLocales();
          this.cdr.markForCheck();
        });

        // Opcional: navegar al evento recién creado
        // this.router.navigate(['/admin-uni/eventos', response.evento.id]);
      },
      error: error => {
        console.error('Error completo al crear evento:', error);
        console.error('Estado del error:', error.status);
        console.error('Mensaje del error:', error.message);
        console.error('Respuesta del error:', error.error);
        this.manejarErrorCreacion(error);
      },
      complete: () => {
        console.log('Proceso de creación completado');
        this.isLoading.set(false);
      },
    });
  }

  /**
   * Editar evento existente
   * REQ-4.14.1: Solo universidades pueden editar eventos
   */
  editarEvento(): void {
    console.log('Iniciando edición de evento...');
    console.log('Formulario válido:', this.editEventForm.valid);
    console.log('Evento seleccionado:', this.selectedEvento());
    console.log('Valores del formulario:', this.editEventForm.value);

    if (this.editEventForm.invalid || !this.selectedEvento()) {
      console.log('Formulario inválido o no hay evento seleccionado');
      this.editEventForm.markAllAsTouched();

      // Log de errores específicos
      Object.keys(this.editEventForm.controls).forEach(key => {
        const control = this.editEventForm.get(key);
        if (control && control.invalid) {
          console.log(`Campo ${key} inválido:`, control.errors);
        }
      });
      return;
    }

    this.isLoading.set(true);
    const eventoId = this.selectedEvento()!.id!;

    // Preparar datos del evento con formato correcto usando EventoActualizacionRequest
    const formData = this.editEventForm.value;
    const eventoData: any = {
      titulo: formData.titulo?.trim() || '',
      descripcion: formData.descripcion?.trim() || '',
      tipo: formData.tipo || 'presencial',
      event_type_id: Number(formData.event_type_id) || 1,
      state_id: Number(formData.state_id) || 1,
      fecha_inicio: this.formatearFechaParaBackend(formData.fecha_inicio),
      fecha_fin: this.formatearFechaParaBackend(formData.fecha_fin),
      universidad_id: this.obtenerUniversidadId(),
      creador_id: this.obtenerCreadorId(),
    };

    // Validaciones adicionales
    if (!eventoData.titulo || eventoData.titulo.length < 3) {
      this.mostrarError('El título debe tener al menos 3 caracteres');
      this.isLoading.set(false);
      return;
    }

    if (!eventoData.descripcion || eventoData.descripcion.length < 5) {
      this.mostrarError('La descripción debe tener al menos 5 caracteres');
      this.isLoading.set(false);
      return;
    }

    if (!eventoData.fecha_inicio || !eventoData.fecha_fin) {
      this.mostrarError('Las fechas de inicio y fin son requeridas');
      this.isLoading.set(false);
      return;
    }

    // Agregar campos opcionales solo si tienen valor
    if (formData.ubicacion && formData.ubicacion.trim() !== '') {
      eventoData.ubicacion = formData.ubicacion.trim();
    }

    if (formData.enlace_acceso && formData.enlace_acceso.trim() !== '') {
      eventoData.enlace_acceso = formData.enlace_acceso.trim();
    }

    if (formData.capacidad_maxima && formData.capacidad_maxima > 0) {
      eventoData.capacidad_maxima = Number(formData.capacidad_maxima);
    }

    console.log('ID del evento a editar:', eventoId);
    console.log('Datos a enviar al backend:', eventoData);
    console.log('Tipo de datos que se envían:');
    Object.keys(eventoData).forEach(key => {
      const value = eventoData[key];
      console.log(`${key}: "${value}" (tipo: ${typeof value})`);
    });

    this.eventsService.actualizarEvento(eventoId, eventoData).subscribe({
      next: response => {
        console.log('Respuesta exitosa de edición:', response);

        // Manejo resiliente de la respuesta
        let tituloEvento = 'evento';
        if (response && typeof response === 'object') {
          if (response.evento && response.evento.titulo) {
            tituloEvento = response.evento.titulo;
          } else if ((response as any).titulo) {
            tituloEvento = (response as any).titulo;
          }
        }

        this.mostrarExito(`Evento "${tituloEvento}" actualizado exitosamente`);
        this.cerrarModalEditar();

        // Recargar eventos y recalcular estadísticas
        this.cargarEventos().then(() => {
          this.calcularEstadisticasLocales();
        });

        // Actualizar el evento seleccionado con los nuevos datos si está disponible
        if (response.evento) {
          this.selectedEvento.set(response.evento);
        }
      },
      error: error => {
        console.error('Error completo al editar evento:', error);
        console.error('Estado del error:', error.status);
        console.error('Mensaje del error:', error.message);
        console.error('Respuesta del error:', error.error);
        this.manejarErrorCreacion(error); // Reutilizar el manejador de errores
      },
      complete: () => {
        console.log('Proceso de edición completado');
        this.isLoading.set(false);
      },
    });
  }

  /**
   * Eliminar evento
   * REQ-4.14.1: Solo universidades pueden eliminar eventos
   */
  eliminarEvento(evento: EventoUniversitario): void {
    if (!confirm(`¿Estás seguro de eliminar el evento "${evento.titulo}"?`)) {
      return;
    }

    this.isLoading.set(true);

    this.eventsService.eliminarEvento(evento.id!).subscribe({
      next: () => {
        this.mostrarExito('Evento eliminado exitosamente');

        // Recargar eventos y recalcular estadísticas
        this.cargarEventos().then(() => {
          this.calcularEstadisticasLocales();
        });
      },
      error: error => {
        console.error('Error al eliminar evento:', error);
        this.mostrarError('Error al eliminar el evento');
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }

  /**
   * Cambiar estado del evento
   * REQ-4.14.1: Control de estado del evento
   */
  cambiarEstadoEvento(evento: EventoUniversitario, nuevoStateId: number): void {
    this.eventsService.cambiarEstadoEvento(evento.id!, nuevoStateId).subscribe({
      next: () => {
        this.mostrarExito('Estado del evento actualizado');

        // Recargar eventos y recalcular estadísticas
        this.cargarEventos().then(() => {
          this.calcularEstadisticasLocales();
        });
      },
      error: error => {
        console.error('Error al cambiar estado:', error);
        this.mostrarError('Error al cambiar el estado del evento');
      },
    });
  }

  /**
   * Ver asistentes del evento
   * REQ-4.15.3: Consultar listado de asistentes
   */
  verAsistentes(evento: EventoUniversitario): void {
    this.router.navigate(['/admin-uni/eventos', evento.id, 'asistentes']);
  }

  /**
   * Exportar lista de asistentes
   * REQ-4.15.5: Exportar asistentes para reportes (Simulación temporal)
   */
  exportarAsistentes(evento: EventoUniversitario, formato: 'csv' | 'excel' = 'csv'): void {
    // Simulación temporal hasta que se implemente el método en el servicio
    const content =
      formato === 'csv'
        ? `evento_id,titulo,nombre,email,universidad,asistio\n${evento.id},"${evento.titulo}",Sin datos disponibles,,,`
        : `evento_id\ttitulo\tnombre\temail\tuniversidad\tasistio\n${evento.id}\t"${evento.titulo}"\tSin datos disponibles\t\t\t`;

    const mimeType = formato === 'csv' ? 'text/csv' : 'application/vnd.ms-excel';
    const blob = new Blob([content], { type: mimeType });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `asistentes_${evento.titulo.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.${formato}`;
    link.click();
    window.URL.revokeObjectURL(url);

    this.mostrarExito('Lista de asistentes exportada exitosamente (simulación)');
  }

  // Métodos de navegación y paginación
  cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPages()) {
      console.log(`Cambiando a página ${nuevaPagina}`);
      this.currentPage.set(nuevaPagina);

      // Cargar eventos de la nueva página y recalcular estadísticas
      this.cargarEventos()
        .then(() => {
          this.calcularEstadisticasLocales();
          console.log(`Página ${nuevaPagina} cargada. Eventos: ${this.eventos().length}`);
        })
        .catch(error => {
          console.error('Error al cambiar página:', error);
          this.mostrarError('Error al cargar la página');
        });
    }
  }

  // Métodos de modal
  abrirModalCrear(): void {
    this.createEventForm.reset();

    // Establecer valores por defecto
    this.createEventForm.patchValue({
      state_id: 1,
    });

    // Si hay tipos de eventos disponibles, seleccionar el primero
    if (this.tiposEventos().length > 0) {
      this.createEventForm.patchValue({ event_type_id: this.tiposEventos()[0].id });
    }

    // Si hay modalidades disponibles, seleccionar la primera
    const modalidades = this.modalidades;
    if (modalidades.length > 0) {
      this.createEventForm.patchValue({ tipo: modalidades[0].value });
    }

    this.showCreateModal.set(true);
  }

  cerrarModalCrear(): void {
    this.showCreateModal.set(false);
    this.createEventForm.reset();
  }

  abrirModalEditar(evento: EventoUniversitario): void {
    console.log('Abriendo modal de edición para evento:', evento);
    this.selectedEvento.set(evento);

    // Formatear fechas para inputs datetime-local
    const eventoFormateado = {
      titulo: evento.titulo || '',
      descripcion: evento.descripcion || '',
      tipo: evento.tipo || 'presencial',
      event_type_id: evento.event_type_id || 1,
      state_id: evento.state_id || 1,
      fecha_inicio: this.formatearFechaParaInput(evento.fecha_inicio),
      fecha_fin: this.formatearFechaParaInput(evento.fecha_fin),
      ubicacion: evento.ubicacion || '',
      enlace_acceso: evento.enlace_acceso || '',
      capacidad_maxima: evento.capacidad_maxima || null,
    };

    console.log('Datos formateados para el formulario:', eventoFormateado);

    // Resetear el formulario primero y luego establecer valores
    this.editEventForm.reset();
    this.editEventForm.patchValue(eventoFormateado);

    // Validar que el formulario se cargó correctamente
    console.log('Estado del formulario después de cargar:', this.editEventForm.value);
    console.log('Formulario válido después de cargar:', this.editEventForm.valid);

    this.showEditModal.set(true);
  }

  cerrarModalEditar(): void {
    this.showEditModal.set(false);
    this.selectedEvento.set(null);
    this.editEventForm.reset();
  }

  // Métodos de validación y utilidad
  private configurarValidadoresFecha(): void {
    // Validador para formulario de creación
    const validarFechasCreacion = () => {
      const fechaInicio = this.createEventForm.get('fecha_inicio')?.value;
      const fechaFin = this.createEventForm.get('fecha_fin')?.value;

      if (fechaInicio && fechaFin && new Date(fechaFin) <= new Date(fechaInicio)) {
        this.createEventForm.get('fecha_fin')?.setErrors({ fechaInvalida: true });
      } else {
        // Limpiar error si las fechas son válidas
        const errors = this.createEventForm.get('fecha_fin')?.errors;
        if (errors && errors['fechaInvalida']) {
          delete errors['fechaInvalida'];
          this.createEventForm
            .get('fecha_fin')
            ?.setErrors(Object.keys(errors).length ? errors : null);
        }
      }
    };

    // Validador para formulario de edición
    const validarFechasEdicion = () => {
      const fechaInicio = this.editEventForm.get('fecha_inicio')?.value;
      const fechaFin = this.editEventForm.get('fecha_fin')?.value;

      if (fechaInicio && fechaFin && new Date(fechaFin) <= new Date(fechaInicio)) {
        this.editEventForm.get('fecha_fin')?.setErrors({ fechaInvalida: true });
      } else {
        // Limpiar error si las fechas son válidas
        const errors = this.editEventForm.get('fecha_fin')?.errors;
        if (errors && errors['fechaInvalida']) {
          delete errors['fechaInvalida'];
          this.editEventForm
            .get('fecha_fin')
            ?.setErrors(Object.keys(errors).length ? errors : null);
        }
      }
    };

    // Suscribirse a cambios en ambos formularios
    this.createEventForm.get('fecha_inicio')?.valueChanges.subscribe(validarFechasCreacion);
    this.createEventForm.get('fecha_fin')?.valueChanges.subscribe(validarFechasCreacion);

    this.editEventForm.get('fecha_inicio')?.valueChanges.subscribe(validarFechasEdicion);
    this.editEventForm.get('fecha_fin')?.valueChanges.subscribe(validarFechasEdicion);
  }

  private obtenerUniversidadId(): number {
    // TODO: Obtener del token JWT o estado de autenticación
    // Por ahora returno un valor por defecto para testing
    const universidadId = 1;
    console.log('Universidad ID obtenida:', universidadId);
    return universidadId;
  }

  private obtenerCreadorId(): number {
    // TODO: Obtener del token JWT o estado de autenticación
    // Por ahora returno un valor por defecto para testing
    const creadorId = 1;
    console.log('Creador ID obtenido:', creadorId);
    return creadorId;
  }

  private manejarErrorCreacion(error: any): void {
    console.log('Manejando error de creación:', error);
    console.log('Error completo:', JSON.stringify(error, null, 2));

    // Log específico de errores de validación
    if (error.error && error.error.details) {
      console.log('Detalles de validación:', error.error.details);
      console.log('Resumen del error:', error.error.summary);
    }

    if (error.status === 409) {
      this.mostrarError('Ya existe un evento con ese nombre en las fechas seleccionadas');
    } else if (error.status === 400) {
      // Obtener mensaje específico del backend si está disponible
      let mensajeError = 'Datos del evento inválidos';

      if (error.error && error.error.details && Array.isArray(error.error.details)) {
        // Construir mensaje con todos los errores de validación
        const errores = error.error.details
          .map((detail: any) => {
            if (detail.field && detail.message) {
              return `${detail.field}: ${detail.message}`;
            }
            return detail.message || detail;
          })
          .join('; ');
        mensajeError = `Errores de validación: ${errores}`;
      } else if (error.error?.message) {
        mensajeError = error.error.message;
      } else if (error.message) {
        mensajeError = error.message;
      }

      this.mostrarError(mensajeError);
    } else if (error.status === 401) {
      this.mostrarError('No tienes permisos para crear eventos');
    } else if (error.status === 422) {
      this.mostrarError('Los datos enviados no son válidos. Verifica la información');
    } else if (error.status === 0) {
      this.mostrarError('No se pudo conectar con el servidor. Verifica tu conexión');
    } else {
      const mensajeError = error.error?.message || error.message || 'Error desconocido';
      this.mostrarError(`Error al crear el evento: ${mensajeError}`);
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

  // Getters para el template
  get modalidades() {
    return this.eventsService.obtenerModalidades();
  }

  get estadosComunes() {
    return this.eventsService.obtenerEstadosComunes();
  }

  // Métodos para el template
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
   * Formatear fecha para inputs datetime-local
   * Los inputs datetime-local requieren formato YYYY-MM-DDTHH:mm
   */
  private formatearFechaParaInput(fecha: string): string {
    if (!fecha) return '';

    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  /**
   * Formatear fecha para enviar al backend
   * Convierte fecha del input a formato ISO string
   */
  private formatearFechaParaBackend(fecha: string): string {
    if (!fecha) return '';

    try {
      // Los inputs datetime-local devuelven formato 'YYYY-MM-DDTHH:mm'
      // Convertir a ISO string para el backend
      const date = new Date(fecha);
      return date.toISOString();
    } catch (error) {
      console.error('Error al formatear fecha para backend:', error);
      return fecha; // Devolver original si hay error
    }
  }

  obtenerNombreTipo(eventTypeId: number): string {
    const tipo = this.tiposEventos().find(t => t.id === eventTypeId);
    return tipo?.nombre || 'Sin tipo';
  }

  obtenerNombreEstado(stateId: number): string {
    const estado = this.estadosEventos().find(e => e.id === stateId);
    return estado?.nombre || 'Sin estado';
  }

  esEventoPasado(fecha: string): boolean {
    return new Date(fecha) < new Date();
  }

  calcularDiasRestantes(fecha: string): number {
    const diff = new Date(fecha).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}
