import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@app/core/services/auth/auth.service';
import { ApiClientService } from '@app/core/services/base/api-client.service';
import { AsistenciaEventosService } from '@app/core/services/event/asistencia-eventos.service';
import { catchError, finalize, of, tap } from 'rxjs';

interface Event {
  id: number;
  titulo: string;
  descripcion: string;
  fecha_inicio: string;
  hora_evento?: string;
  hora_inicio?: string;
  hora_fin?: string;
  modalidad: 'presencial' | 'virtual' | 'hibrida';
  lugar?: string;
  enlace_virtual?: string;
  cupo_limite?: number;
  cupo_maximo?: number;
  universidad_id: number;
  tipo_evento_id: number;
  estado: 'activo' | 'cancelado' | 'finalizado';
  created_at: string;
  updated_at: string;
  asistentes_count?: number;
  is_registered?: boolean;
}

interface EventType {
  id: number;
  nombre: string;
  descripcion?: string;
}

interface University {
  id: number;
  nombre: string;
  dominio: string;
}

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-list.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventListComponent implements OnInit {
  private readonly apiClient = inject(ApiClientService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly asistenciaService = inject(AsistenciaEventosService);

  // Signals para manejar el estado
  readonly events = signal<Event[]>([]);
  readonly filteredEvents = signal<Event[]>([]);
  readonly isLoading = signal(false);
  readonly error = signal<string | null>(null);
  readonly selectedFilter = signal<string>('all');

  // Additional signals for search and filters
  readonly searchTerm = signal<string>('');
  readonly selectedEventType = signal<number | null>(null);
  readonly selectedDateFilter = signal<string>('all');
  readonly eventTypes = signal<EventType[]>([]);
  readonly universities = signal<University[]>([]);
  readonly registeredEventIds = signal<number[]>([]);
  readonly isRegistering = signal(false);

  // Pagination signals
  readonly currentPage = signal(1);
  readonly itemsPerPage = 12;
  readonly totalPages = computed(() => Math.ceil(this.filteredEvents().length / this.itemsPerPage));

  // Statistics computed signals
  readonly totalEvents = computed(() => this.events().length);

  readonly eventsThisMonth = computed(() => {
    return this.events().filter(event => {
      // Validate event has fecha_inicio property
      if (!event.fecha_inicio) {
        console.warn('⚠️ Evento sin fecha:', event);
        return false;
      }
      return this.isThisMonth(this.parseEventDate(event.fecha_inicio));
    }).length;
  });

  readonly registeredEvents = computed(() => {
    // Usar las asistencias del servicio para mayor precisión
    return this.asistenciaService.totalMisAsistencias();
  });

  readonly upcomingEvents = computed(() => {
    const now = new Date();
    return this.events().filter(event => {
      // Validate event has fecha_inicio property
      if (!event.fecha_inicio) {
        console.warn('⚠️ Evento sin fecha:', event);
        return false;
      }
      return this.parseEventDate(event.fecha_inicio) >= now;
    }).length;
  });

  // Filtros disponibles
  readonly filters = [
    { value: 'all', label: 'Todos los eventos', icon: '📅' },
    { value: 'upcoming', label: 'Próximos', icon: '⏰' },
    { value: 'my_university', label: 'Mi Universidad', icon: '🏛️' },
    { value: 'virtual', label: 'Virtuales', icon: '💻' },
    { value: 'presencial', label: 'Presenciales', icon: '📍' },
    { value: 'registered', label: 'Mis Registros', icon: '✅' },
  ];

  ngOnInit(): void {
    this.loadEvents();
    this.loadEventTypes();
    this.loadUniversities();
    this.loadMisAsistencias();
  }

  private loadEvents(): void {
    this.isLoading.set(true);
    this.error.set(null);

    console.log('🚀 Cargando lista de eventos...');

    this.apiClient
      .get<Event[]>('/eventos')
      .pipe(
        tap((events: Event[]) => {
          console.log('✅ Eventos cargados:', events);
          console.log('📊 Total de eventos:', events.length);

          // Log eventos sin fecha para debugging
          const eventsWithoutDate = events.filter(e => !e.fecha_inicio);
          if (eventsWithoutDate.length > 0) {
            console.warn('⚠️ Eventos sin fecha_inicio encontrados:', eventsWithoutDate);
          }

          // Log formato de fechas para debugging
          if (events.length > 0) {
            console.log('🗓️ Ejemplos de fechas recibidas:');
            events.slice(0, 3).forEach((event, index) => {
              console.log(`  Evento ${index + 1}:`, {
                id: event.id,
                titulo: event.titulo,
                fecha_inicio: event.fecha_inicio,
                tipo: typeof event.fecha_inicio,
              });
            });
          }

          // Enriquecer con información adicional
          const enrichedEvents = events.map(event => ({
            ...event,
            asistentes_count: event.asistentes_count || 0,
            is_registered: event.is_registered || false,
          }));

          this.events.set(enrichedEvents);
          this.applyFilter(this.selectedFilter());
        }),
        catchError(error => {
          console.error('❌ Error al cargar eventos:', error);
          console.error('❌ Detalles del error:', error.error);
          console.error('❌ Status:', error.status);
          this.error.set('Error al cargar la lista de eventos');
          return of([]);
        }),
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe();
  }

  private loadEventTypes(): void {
    console.log('🚀 Cargando tipos de eventos...');

    this.apiClient
      .get<EventType[]>('/event-types')
      .pipe(
        tap((types: EventType[]) => {
          console.log('✅ Tipos de eventos cargados:', types);
          this.eventTypes.set(types);
        }),
        catchError(error => {
          console.error('❌ Error al cargar tipos de eventos:', error);
          // No es crítico, continúa sin tipos
          this.eventTypes.set([]);
          return of([]);
        }),
      )
      .subscribe();
  }

  private loadUniversities(): void {
    console.log('🚀 Cargando universidades...');

    this.apiClient
      .get<University[]>('/universidades')
      .pipe(
        tap((universities: University[]) => {
          console.log('✅ Universidades cargadas:', universities);
          this.universities.set(universities);
        }),
        catchError(error => {
          console.error('❌ Error al cargar universidades:', error);
          // No es crítico, continúa sin universidades
          this.universities.set([]);
          return of([]);
        }),
      )
      .subscribe();
  }

  private loadMisAsistencias(): void {
    console.log('🚀 Cargando mis asistencias...');

    this.asistenciaService
      .getMisAsistencias()
      .pipe(
        tap(asistencias => {
          console.log('✅ Mis asistencias cargadas:', asistencias);
          // Extraer los IDs de eventos a los que estoy registrado
          const eventIds = asistencias.map(asistencia => asistencia.evento_id);
          this.registeredEventIds.set(eventIds);
        }),
        catchError(error => {
          console.error('❌ Error al cargar mis asistencias:', error);
          // No es crítico, continúa sin asistencias
          this.registeredEventIds.set([]);
          return of([]);
        }),
      )
      .subscribe();
  }

  // Aplicar filtros
  applyFilter(filterValue: string): void {
    this.selectedFilter.set(filterValue);
    const allEvents = this.events();
    const currentUser = this.authService.currentUser();
    const userUniversityId = currentUser?.universidad_id;
    const now = new Date();

    let filtered: Event[] = [];

    switch (filterValue) {
      case 'all':
        filtered = allEvents;
        break;
      case 'upcoming':
        filtered = allEvents.filter(event => {
          if (!event.fecha_inicio) return false;
          return this.parseEventDate(event.fecha_inicio) >= now;
        });
        break;
      case 'my_university':
        filtered = allEvents.filter(event => event.universidad_id === userUniversityId);
        break;
      case 'virtual':
        filtered = allEvents.filter(
          event => event.modalidad === 'virtual' || event.modalidad === 'hibrida',
        );
        break;
      case 'presencial':
        filtered = allEvents.filter(
          event => event.modalidad === 'presencial' || event.modalidad === 'hibrida',
        );
        break;
      case 'registered':
        filtered = allEvents.filter(event => event.is_registered);
        break;
      default:
        filtered = allEvents;
    }

    console.log(`🔍 Filtro aplicado: ${filterValue}, Resultados: ${filtered.length}`);
    this.filteredEvents.set(filtered);
  }

  // Métodos helper para el template
  getEventsCount(): number {
    return this.filteredEvents().length;
  }

  getTotalEventsCount(): number {
    return this.events().length;
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Fecha no especificada';
    try {
      const date = this.parseEventDate(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      console.error('❌ Error al formatear fecha:', dateString, error);
      return 'Fecha inválida';
    }
  }

  formatTime(timeString: string): string {
    if (!timeString) return '';
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getModalityIcon(modality: string): string {
    const icons = {
      virtual: '💻',
      presencial: '📍',
      hibrida: '🔄',
    };
    return icons[modality as keyof typeof icons] || '📅';
  }

  getModalityColor(modality: string): string {
    const colors = {
      virtual: 'bg-blue-100 text-blue-800',
      presencial: 'bg-green-100 text-green-800',
      hibrida: 'bg-purple-100 text-purple-800',
    };
    return colors[modality as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  }

  isEventUpcoming(event: Event): boolean {
    if (!event.fecha_inicio) {
      console.warn('⚠️ Evento sin fecha en isEventUpcoming:', event);
      return false;
    }
    const eventDate = this.parseEventDate(event.fecha_inicio);
    const now = new Date();
    return eventDate >= now;
  }

  isEventToday(event: Event): boolean {
    if (!event.fecha_inicio) {
      console.warn('⚠️ Evento sin fecha en isEventToday:', event);
      return false;
    }
    const eventDate = this.parseEventDate(event.fecha_inicio);
    const today = new Date();
    return this.isSameDay(eventDate, today);
  }

  getUniversityName(universityId: number): string {
    const university = this.universities().find(u => u.id === universityId);
    return university?.nombre || 'Universidad no especificada';
  }

  // Navegación y acciones
  registerForEvent(eventId: number): void {
    console.log('📝 Registrándose al evento:', eventId);
    this.isRegistering.set(true);

    this.asistenciaService
      .registrarseEvento(eventId)
      .pipe(
        tap(asistencia => {
          console.log('✅ Registrado al evento exitosamente:', asistencia);
          // Actualizar la lista de eventos registrados
          const currentIds = this.registeredEventIds();
          this.registeredEventIds.set([...currentIds, eventId]);
        }),
        catchError(error => {
          console.error('❌ Error al registrarse al evento:', error);
          this.error.set('Error al registrarse al evento');
          return of(null);
        }),
        finalize(() => {
          this.isRegistering.set(false);
        }),
      )
      .subscribe();
  }

  // Métodos de utilidad
  retryLoad(): void {
    this.loadEvents();
    this.loadMisAsistencias();
  }

  refreshEvents(): void {
    this.loadEvents();
    this.loadMisAsistencias();
  }

  getFilteredEventsByStatus(): { [key: string]: number } {
    const allEvents = this.events();
    const now = new Date();

    return {
      total: allEvents.length,
      upcoming: allEvents.filter(e => {
        if (!e.fecha_inicio) return false;
        try {
          return this.parseEventDate(e.fecha_inicio) >= now;
        } catch {
          return false;
        }
      }).length,
      virtual: allEvents.filter(e => e.modalidad === 'virtual' || e.modalidad === 'hibrida').length,
      registered: allEvents.filter(e => e.is_registered).length,
    };
  }

  truncateText(text: string, maxLength: number = 120): string {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  // TrackBy function para optimizar ngFor
  trackByEventId(_index: number, event: Event): number {
    return event.id;
  }

  // Search methods
  onSearchChange(event: any): void {
    const term = event.target.value;
    this.searchTerm.set(term);
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchTerm.set('');
    this.applyFilters();
  }

  // Filter methods
  onEventTypeChange(event: any): void {
    const typeId = event.target.value ? parseInt(event.target.value, 10) : null;
    this.selectedEventType.set(typeId);
    this.applyFilters();
  }

  onDateFilterChange(event: any): void {
    const filter = event.target.value;
    this.selectedDateFilter.set(filter);
    this.applyFilters();
  }

  clearEventTypeFilter(): void {
    this.selectedEventType.set(null);
    this.applyFilters();
  }

  clearDateFilter(): void {
    this.selectedDateFilter.set('all');
    this.applyFilters();
  }

  clearAllFilters(): void {
    this.searchTerm.set('');
    this.selectedEventType.set(null);
    this.selectedDateFilter.set('all');
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return !!(this.searchTerm() || this.selectedEventType() || this.selectedDateFilter() !== 'all');
  }

  getEventTypeName(typeId: number | null): string {
    if (!typeId) return 'Tipo no especificado';
    const type = this.eventTypes().find(t => t.id === typeId);
    return type?.nombre || 'Tipo no especificado';
  }

  getDateFilterLabel(filter: string): string {
    const labels: { [key: string]: string } = {
      today: 'Hoy',
      week: 'Esta semana',
      month: 'Este mes',
      upcoming: 'Próximos',
    };
    return labels[filter] || filter;
  }

  // Date utility methods
  isThisMonth(date: Date): boolean {
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }

  isThisWeek(date: Date): boolean {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return date >= startOfWeek && date <= endOfWeek;
  }

  // Parse database date format (2025-07-09 00:00:00)
  parseEventDate(dateString: string): Date {
    // Validate input
    if (!dateString || typeof dateString !== 'string') {
      console.warn('⚠️ Fecha de evento inválida:', dateString);
      return new Date(); // Return current date as fallback
    }

    try {
      console.log('🔍 Parseando fecha:', dateString);

      // Remove any extra quotes or whitespace
      const cleanDateString = dateString.trim().replace(/['"]/g, '');

      // Handle ISO format (2025-07-09T00:00:00.000Z)
      if (cleanDateString.includes('T') || cleanDateString.includes('Z')) {
        const date = new Date(cleanDateString);
        if (!isNaN(date.getTime())) {
          console.log('✅ Fecha ISO parseada:', date);
          return date;
        }
      }

      // Handle datetime format: "2025-07-09 00:00:00"
      if (cleanDateString.includes(' ') && cleanDateString.includes(':')) {
        const isoString = cleanDateString.replace(' ', 'T');
        const date = new Date(isoString);
        if (!isNaN(date.getTime())) {
          console.log('✅ Fecha datetime parseada:', date);
          return date;
        }
      }

      // Handle date only format: "2025-07-09"
      if (cleanDateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        const date = new Date(cleanDateString + 'T00:00:00');
        if (!isNaN(date.getTime())) {
          console.log('✅ Fecha simple parseada:', date);
          return date;
        }
      }

      // Try direct Date constructor as fallback
      const fallbackDate = new Date(cleanDateString);
      if (!isNaN(fallbackDate.getTime())) {
        console.log('✅ Fecha fallback parseada:', fallbackDate);
        return fallbackDate;
      }

      // If all parsing attempts fail
      console.error('❌ No se pudo parsear la fecha:', cleanDateString);
      return new Date(); // Return current date as final fallback
    } catch (error) {
      console.error('❌ Error al parsear fecha:', dateString, error);
      return new Date(); // Return current date as fallback
    }
  }

  // Event registration methods
  isEventRegistered(eventId: number): boolean {
    // Usar tanto el signal local como el servicio para mayor precisión
    const localRegistered = this.registeredEventIds().includes(eventId);
    const serviceRegistered = this.asistenciaService.isRegistradoEnEvento(eventId);

    // Si hay discrepancia, usar el del servicio como fuente de verdad
    if (localRegistered !== serviceRegistered) {
      console.warn('⚠️ Discrepancia en estado de registro:', {
        eventId,
        localRegistered,
        serviceRegistered,
      });
      return serviceRegistered;
    }

    return localRegistered;
  }

  canRegisterToEvent(event: Event): boolean {
    // No se puede registrar si no tiene fecha definida
    if (!event.fecha_inicio) {
      return false;
    }
    return this.isEventUpcoming(event) && !this.isEventRegistered(event.id);
  }

  registerToEvent(eventId: number): void {
    this.isRegistering.set(true);

    this.asistenciaService
      .registrarseEvento(eventId)
      .pipe(
        tap(asistencia => {
          console.log('✅ Registrado al evento exitosamente:', asistencia);
          const currentIds = this.registeredEventIds();
          this.registeredEventIds.set([...currentIds, eventId]);
        }),
        catchError(error => {
          console.error('❌ Error al registrarse al evento:', error);
          this.error.set('Error al registrarse al evento');
          return of(null);
        }),
        finalize(() => {
          this.isRegistering.set(false);
        }),
      )
      .subscribe();
  }

  unregisterFromEvent(eventId: number): void {
    this.asistenciaService
      .cancelarRegistroPorEvento(eventId)
      .pipe(
        tap(() => {
          console.log('✅ Registro cancelado exitosamente');
          const currentIds = this.registeredEventIds();
          this.registeredEventIds.set(currentIds.filter(id => id !== eventId));
        }),
        catchError(error => {
          console.error('❌ Error al cancelar registro:', error);
          this.error.set('Error al cancelar registro');
          return of(null);
        }),
      )
      .subscribe();
  }

  viewEventDetails(eventId: number): void {
    this.router.navigate(['/student/events', eventId]);
  }

  /**
   * Navegar a la página de mis registros
   */
  navigateToMyRegisters(): void {
    this.router.navigate(['/student/my-register']);
  }

  getEventDisabledReason(event: Event): string {
    if (!event.fecha_inicio) {
      return 'Fecha por confirmar';
    }
    if (!this.isEventUpcoming(event)) {
      return 'Evento finalizado';
    }
    if (event.cupo_limite && event.cupo_limite <= 0) {
      return 'Sin cupos';
    }
    return 'No disponible';
  }

  // Pagination methods
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const total = this.totalPages();
    const current = this.currentPage();

    for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
      pages.push(i);
    }

    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  private applyFilters(): void {
    let events = this.events();

    // Apply search filter
    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      events = events.filter(
        event =>
          event.titulo.toLowerCase().includes(term) ||
          event.descripcion.toLowerCase().includes(term) ||
          this.getUniversityName(event.universidad_id).toLowerCase().includes(term),
      );
    }

    // Apply event type filter
    if (this.selectedEventType()) {
      events = events.filter(event => event.tipo_evento_id === this.selectedEventType());
    }

    // Apply date filter
    if (this.selectedDateFilter() !== 'all') {
      const now = new Date();
      events = events.filter(event => {
        // Skip events without fecha_inicio
        if (!event.fecha_inicio) {
          console.warn('⚠️ Evento sin fecha en filtros:', event);
          return false;
        }

        try {
          const eventDate = this.parseEventDate(event.fecha_inicio);

          switch (this.selectedDateFilter()) {
            case 'today':
              return this.isSameDay(eventDate, now);
            case 'week':
              return this.isThisWeek(eventDate);
            case 'month':
              return this.isThisMonth(eventDate);
            case 'upcoming':
              return eventDate >= now;
            default:
              return true;
          }
        } catch (error) {
          console.error('❌ Error al filtrar por fecha:', event.fecha_inicio, error);
          return false;
        }
      });
    }

    this.filteredEvents.set(events);
  }

  // Format methods
  formatEventDate(dateString: string): string {
    if (!dateString) {
      console.warn('⚠️ Fecha de evento vacía en formatEventDate');
      return 'Fecha por confirmar';
    }

    try {
      const date = this.parseEventDate(dateString);

      // Check if the parsed date is valid
      if (isNaN(date.getTime())) {
        console.error('❌ Fecha inválida después del parsing:', dateString);
        return 'Fecha por confirmar';
      }

      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      console.error('❌ Error al formatear fecha del evento:', dateString, error);
      return 'Fecha por confirmar';
    }
  }

  formatEventTime(timeString: string | undefined): string {
    if (!timeString) return '';
    // Handle time format from database if it comes with date
    if (timeString.includes(' ')) {
      const timePart = timeString.split(' ')[1];
      const time = new Date(`2000-01-01T${timePart}`);
      return time.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else {
      const time = new Date(`2000-01-01T${timeString}`);
      return time.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  }

  getEventStatusClass(event: Event): string {
    const now = new Date();

    if (event.estado === 'cancelado') {
      return 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800';
    }

    if (!event.fecha_inicio) {
      return 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800';
    }

    try {
      const eventDate = this.parseEventDate(event.fecha_inicio);

      if (eventDate < now || event.estado === 'finalizado') {
        return 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800';
      }
    } catch (error) {
      console.error('❌ Error al obtener estado del evento:', error);
      return 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800';
    }

    return 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800';
  }

  getEventStatusText(event: Event): string {
    const now = new Date();

    if (event.estado === 'cancelado') {
      return 'Cancelado';
    }

    if (!event.fecha_inicio) {
      return 'Fecha por definir';
    }

    try {
      const eventDate = this.parseEventDate(event.fecha_inicio);

      if (eventDate < now || event.estado === 'finalizado') {
        return 'Finalizado';
      }
    } catch (error) {
      console.error('❌ Error al obtener texto del estado:', error);
      return 'Fecha inválida';
    }

    return 'Activo';
  }
}
