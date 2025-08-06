import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, of, tap } from 'rxjs';

// Services
import { AsistenciaEvento, AsistenciaEventosService } from '../../../../core/services/event/asistencia-eventos.service';
import { EventService } from '../../../../core/services/event/event.service';

// Interfaces
import { Event } from '../../../../core/models/event/event.interface';

interface MiRegistro {
  asistencia: AsistenciaEvento;
  evento: Event | null;
}

@Component({
  selector: 'app-my-register',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './my-register.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyRegisterComponent implements OnInit {
  // Signals
  private readonly _isLoading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _misRegistros = signal<MiRegistro[]>([]);

  // Computed properties
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly misRegistros = this._misRegistros.asReadonly();
  readonly totalRegistros = computed(() => this.misRegistros().length);

  // Filtros
  private readonly _filtroEstado = signal<'todos' | 'activos' | 'finalizados'>('todos');
  readonly filtroEstado = this._filtroEstado.asReadonly();

  // Registros filtrados
  readonly registrosFiltrados = computed(() => {
    const registros = this.misRegistros();
    const filtro = this.filtroEstado();
    
    if (filtro === 'todos') {
      return registros;
    }
    
    const ahora = new Date();
    return registros.filter(registro => {
      if (!registro.evento) return false;
      const fechaEvento = new Date(registro.evento.fecha_inicio);
      
      if (filtro === 'activos') {
        return fechaEvento >= ahora;
      } else {
        return fechaEvento < ahora;
      }
    });
  });

  // Estadísticas computadas
  readonly registrosActivos = computed(() => {
    const ahora = new Date();
    return this.misRegistros().filter(registro => {
      if (!registro.evento) return false;
      return new Date(registro.evento.fecha_inicio) >= ahora;
    }).length;
  });

  readonly registrosFinalizados = computed(() => {
    const ahora = new Date();
    return this.misRegistros().filter(registro => {
      if (!registro.evento) return false;
      return new Date(registro.evento.fecha_inicio) < ahora;
    }).length;
  });

  // Estado de cancelación
  private readonly _cancelingRegistroId = signal<number | null>(null);
  readonly cancelingRegistroId = this._cancelingRegistroId.asReadonly();

  constructor(
    private readonly asistenciaService: AsistenciaEventosService,
    private readonly eventService: EventService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadMisRegistros();
  }

  /**
   * Cargar todos los registros del usuario
   */
  loadMisRegistros(): void {
    console.log('📋 Cargando mis registros...');
    this._isLoading.set(true);
    this._error.set(null);

    // Obtenemos las asistencias del usuario actual
    this.asistenciaService.getMisAsistencias().pipe(
      tap((asistencias) => {
        console.log('✅ Asistencias cargadas:', asistencias.length);
        // Luego obtenemos los datos completos de los eventos
        this.loadEventosParaRegistros(asistencias);
      }),
      catchError((error) => {
        console.error('❌ Error al cargar mis registros:', error);
        this._error.set('Error al cargar tus registros de eventos');
        return of([]);
      }),
      finalize(() => {
        this._isLoading.set(false);
      })
    ).subscribe();
  }

  /**
   * Cargar los datos completos de los eventos para los registros
   */
  private loadEventosParaRegistros(asistencias: AsistenciaEvento[]): void {
    console.log('📊 Procesando asistencias:', asistencias);

    if (asistencias.length === 0) {
      this._misRegistros.set([]);
      return;
    }

    // Cargar todos los eventos para obtener los detalles
    this.eventService.getAll().pipe(
      tap((eventos) => {
        console.log('📋 Eventos disponibles:', eventos.length);
        
        // Crear los registros combinando asistencias con datos de eventos
        const registros: MiRegistro[] = asistencias.map(asistencia => {
          const evento = eventos.find(e => e.id === asistencia.evento_id) || null;
          return {
            asistencia,
            evento
          };
        });

        console.log('✅ Registros procesados:', registros.length);
        this._misRegistros.set(registros);
      }),
      catchError((error) => {
        console.error('❌ Error al cargar eventos:', error);
        // En caso de error, creamos registros solo con datos de asistencia
        const registros: MiRegistro[] = asistencias.map(asistencia => ({
          asistencia,
          evento: null
        }));
        this._misRegistros.set(registros);
        return of([]);
      })
    ).subscribe();
  }

  /**
   * Cambiar filtro de estado
   */
  cambiarFiltro(filtro: 'todos' | 'activos' | 'finalizados'): void {
    this._filtroEstado.set(filtro);
  }

  /**
   * Cancelar un registro específico
   */
  cancelarRegistro(registro: MiRegistro): void {
    console.log('🚫 Cancelando registro:', registro.asistencia.id);
    
    this._cancelingRegistroId.set(registro.asistencia.id);
    this._error.set(null);

    this.asistenciaService.cancelarRegistro(registro.asistencia.id).pipe(
      tap(() => {
        console.log('✅ Registro cancelado exitosamente');
        // Recargar la lista
        this.loadMisRegistros();
      }),
      catchError((error) => {
        console.error('❌ Error al cancelar registro:', error);
        this._error.set('Error al cancelar el registro');
        return of(null);
      }),
      finalize(() => {
        this._cancelingRegistroId.set(null);
      })
    ).subscribe();
  }

  /**
   * Ver detalles del evento
   */
  verEvento(registro: MiRegistro): void {
    if (registro.evento) {
      this.router.navigate(['/student/events', registro.evento.id]);
    }
  }

  /**
   * Navegar a la lista de eventos
   */
  navegarAEventos(): void {
    this.router.navigate(['/student/events']);
  }

  /**
   * Formatear fecha de registro
   */
  formatearFechaRegistro(fecha: string): string {
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha no disponible';
    }
  }

  /**
   * Formatear fecha del evento
   */
  formatearFechaEvento(fecha: string): string {
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha no disponible';
    }
  }

  /**
   * Verificar si un evento ya finalizó
   */
  eventoFinalizado(registro: MiRegistro): boolean {
    if (!registro.evento) return false;
    try {
      const fechaEvento = new Date(registro.evento.fecha_inicio);
      const ahora = new Date();
      return fechaEvento < ahora;
    } catch {
      return false;
    }
  }

  /**
   * Obtener estado del registro
   */
  getEstadoRegistro(registro: MiRegistro): 'activo' | 'finalizado' | 'sin_evento' {
    if (!registro.evento) return 'sin_evento';
    return this.eventoFinalizado(registro) ? 'finalizado' : 'activo';
  }

  /**
   * Recargar datos
   */
  recargar(): void {
    this.loadMisRegistros();
  }
}
