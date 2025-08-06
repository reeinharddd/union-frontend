import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, of, tap } from 'rxjs';

// Services
import { AsistenciaEventosService } from '../../../../core/services/event/asistencia-eventos.service';
import { EventService } from '../../../../core/services/event/event.service';

// Interfaces
import { Event } from '../../../../core/models/event/event.interface';

@Component({
  selector: 'app-event-detaill',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-detaill.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventDetaillComponent implements OnInit {
  // Signals
  private readonly _isLoading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _evento = signal<Event | null>(null);
  private readonly _isRegistering = signal(false);

  // Computed properties
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly evento = this._evento.asReadonly();
  readonly isRegistering = this._isRegistering.asReadonly();

  // Estado del registro
  readonly isRegistered = computed(() => {
    const evento = this.evento();
    if (!evento) return false;
    return this.asistenciaService.isRegistradoEnEvento(evento.id);
  });

  // ID del evento desde la ruta
  private eventoId: number = 0;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly eventService: EventService,
    private readonly asistenciaService: AsistenciaEventosService
  ) {}

  ngOnInit(): void {
    // Obtener el ID del evento desde la ruta
    this.route.params.subscribe(params => {
      this.eventoId = +params['id'];
      if (this.eventoId) {
        this.loadEventoDetalle();
        this.loadRegistroInfo();
      }
    });
  }

  /**
   * Cargar los detalles del evento
   */
  loadEventoDetalle(): void {
    console.log('📅 Cargando detalles del evento:', this.eventoId);
    this._isLoading.set(true);
    this._error.set(null);

    this.eventService.getById(this.eventoId).pipe(
      tap((evento) => {
        console.log('✅ Evento cargado:', evento);
        this._evento.set(evento);
      }),
      catchError((error) => {
        console.error('❌ Error al cargar evento:', error);
        this._error.set('Error al cargar los detalles del evento');
        return of(null);
      }),
      finalize(() => {
        this._isLoading.set(false);
      })
    ).subscribe();
  }

  /**
   * Cargar información de registro del usuario
   */
  loadRegistroInfo(): void {
    // Cargar las asistencias del usuario para verificar si está registrado
    this.asistenciaService.getMisAsistencias().subscribe();
  }

  /**
   * Registrarse al evento
   */
  registrarseEvento(): void {
    const evento = this.evento();
    if (!evento) return;

    console.log('🚀 Registrándose al evento:', evento.id);
    this._isRegistering.set(true);
    this._error.set(null);

    this.asistenciaService.registrarseEvento(evento.id).pipe(
      tap(() => {
        console.log('✅ Registro exitoso');
        // Recargar información de registro
        this.loadRegistroInfo();
      }),
      catchError((error) => {
        console.error('❌ Error al registrarse:', error);
        this._error.set('Error al registrarse al evento');
        return of(null);
      }),
      finalize(() => {
        this._isRegistering.set(false);
      })
    ).subscribe();
  }

  /**
   * Cancelar registro al evento
   */
  cancelarRegistro(): void {
    const evento = this.evento();
    if (!evento) return;

    console.log('🚫 Cancelando registro al evento:', evento.id);
    this._isRegistering.set(true);
    this._error.set(null);

    this.asistenciaService.cancelarRegistroPorEvento(evento.id).pipe(
      tap(() => {
        console.log('✅ Registro cancelado');
        // Recargar información de registro
        this.loadRegistroInfo();
      }),
      catchError((error) => {
        console.error('❌ Error al cancelar registro:', error);
        this._error.set('Error al cancelar el registro');
        return of(null);
      }),
      finalize(() => {
        this._isRegistering.set(false);
      })
    ).subscribe();
  }

  /**
   * Volver a la lista de eventos
   */
  volverALista(): void {
    this.router.navigate(['/student/events']);
  }

  /**
   * Ver mis registros
   */
  verMisRegistros(): void {
    this.router.navigate(['/student/my-register']);
  }

  /**
   * Formatear fecha del evento
   */
  formatearFecha(fecha: string): string {
    try {
      return new Date(fecha).toLocaleDateString('es-ES', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return 'Fecha no disponible';
    }
  }

  /**
   * Formatear hora del evento
   */
  formatearHora(fecha: string): string {
    try {
      return new Date(fecha).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return 'Hora no disponible';
    }
  }

  /**
   * Verificar si el evento ya pasó
   */
  eventoExpirado(): boolean {
    const evento = this.evento();
    if (!evento) return false;
    
    try {
      const fechaEvento = new Date(evento.fecha_inicio);
      const ahora = new Date();
      return fechaEvento < ahora;
    } catch {
      return false;
    }
  }

  /**
   * Verificar si se puede registrar al evento
   */
  puedeRegistrarse(): boolean {
    const evento = this.evento();
    if (!evento) return false;
    
    return !this.eventoExpirado() && !this.isRegistered();
  }

  /**
   * Obtener el estado del evento
   */
  getEstadoEvento(): 'proximo' | 'en_curso' | 'finalizado' {
    const evento = this.evento();
    if (!evento) return 'finalizado';
    
    try {
      const fechaInicio = new Date(evento.fecha_inicio);
      const fechaFin = evento.fecha_fin ? new Date(evento.fecha_fin) : fechaInicio;
      const ahora = new Date();
      
      if (ahora < fechaInicio) return 'proximo';
      if (ahora >= fechaInicio && ahora <= fechaFin) return 'en_curso';
      return 'finalizado';
    } catch {
      return 'finalizado';
    }
  }

  /**
   * Obtener texto del estado
   */
  getTextoEstado(): string {
    switch (this.getEstadoEvento()) {
      case 'proximo': return 'Próximo';
      case 'en_curso': return 'En curso';
      case 'finalizado': return 'Finalizado';
      default: return 'Sin determinar';
    }
  }

  /**
   * Obtener clase CSS del estado
   */
  getClaseEstado(): string {
    switch (this.getEstadoEvento()) {
      case 'proximo': return 'bg-blue-100 text-blue-800';
      case 'en_curso': return 'bg-green-100 text-green-800';
      case 'finalizado': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  }
}
