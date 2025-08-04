import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, firstValueFrom, of, tap } from 'rxjs';
import { User } from '../../models/auth/auth.interface';
import { AuthService } from '../auth/auth.service';
import { ApiClientService } from '../base/api-client.service';
import { ConversationService } from '../conversation/conversation.service';
import { ToastService } from '../ui/toast.service';

// ✅ Interfaces según especificaciones UniON REQ-4.22.3
export interface Student extends User {
  apellido: string;
  universidad_id: number;
  año_graduacion?: number;
  avatar?: string;
  biografia?: string;
  habilidades?: string[];
}

export interface University {
  id: number;
  nombre: string;
  dominio: string;
  logo?: string;
}

// ✅ Experiencias profesionales según REQ-4.22.3 y REQ-4.22.4
export interface Experience {
  id: number;
  usuario_id: number;
  tipo: string;
  titulo: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin?: string;
  creado_en: string;
}

// ✅ Proyectos académicos según REQ-4.8.1 y REQ-4.10.2
export interface Project {
  id: number;
  nombre: string;
  descripcion: string;
  tecnologias?: string;
  estado: 'activo' | 'pausado' | 'cerrado';
  verificado: boolean;
  creador_id: number;
  creado_en: string;
}

// ✅ Actividad en foros según REQ-4.19.1
// Estructura: hilos = foros de discusión, respuestas_hilo = comentarios en foros
export interface ForumActivity {
  id: number;
  titulo?: string; // Para foros de discusión creados por usuarios (tabla hilos)
  contenido: string;
  creado_en: string;
  tipo: 'hilo' | 'respuesta'; // hilo = foro de discusión, respuesta = comentario
  foro_id?: number; // ID del foro donde se creó la discusión
  hilo_id?: number; // ID del foro donde se hizo el comentario
  creador_id?: number; // Para foros creados por usuarios
  usuario_id?: number; // Para comentarios hechos por usuarios
}

// ✅ Seguimiento entre usuarios según tabla de seguimientos
export interface Following {
  id: number;
  seguidor_id: number;
  seguido_usuario_id: number;
  seguido_proyecto_id?: number | null;
  creado_en: string;
}

// ✅ Datos para crear un nuevo seguimiento (sin ID)
export interface CreateFollowing {
  seguidor_id: number;
  seguido_usuario_id: number;
  seguido_proyecto_id?: number | null;
}

// ✅ Habilidades del usuario según tabla user_skills
export interface UserSkill {
  id: number;
  usuario_id: number;
  skill_name: string;
  proficiency_level?: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly apiClient = inject(ApiClientService);
  private readonly toastService = inject(ToastService);
  private readonly conversationService = inject(ConversationService);
  private readonly authService = inject(AuthService);

  // ✅ Señales reactivas para manejo de estado según Angular 17+
  private readonly _student = signal<Student | null>(null);
  private readonly _university = signal<University | null>(null);
  private readonly _experiences = signal<Experience[]>([]);
  private readonly _projects = signal<Project[]>([]);
  private readonly _forumActivity = signal<ForumActivity[]>([]);
  private readonly _userSkills = signal<UserSkill[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _isFollowing = signal(false);
  private readonly _followersCount = signal(0);

  // ✅ Signals de solo lectura
  readonly student = this._student.asReadonly();
  readonly university = this._university.asReadonly();
  readonly experiences = this._experiences.asReadonly();
  readonly projects = this._projects.asReadonly();
  readonly forumActivity = this._forumActivity.asReadonly();
  readonly userSkills = this._userSkills.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly isFollowing = this._isFollowing.asReadonly();
  readonly followersCount = this._followersCount.asReadonly();

  // ✅ Computadas para estadísticas según REQ-4.6.1
  readonly projectsCount = computed(() => this._projects().length);
  // readonly forumsCount = computed(() => this._forumActivity().length); // ❌ COMENTADO TEMPORALMENTE
  readonly forumsCount = computed(() => 0); // ❌ TEMPORAL - RETORNA 0
  readonly connectionsCount = computed(() => this._followersCount()); // ✅ Usar conteo real de seguidores

  // ✅ Verificar si es el perfil propio
  readonly isOwnProfile = computed(() => {
    const currentUser = this.authService.currentUser();
    const profileStudent = this._student();
    return currentUser && profileStudent && currentUser.id === profileStudent.id;
  });

  /**
   * ✅ Cargar perfil completo del estudiante según REQ-4.22.5
   */
  loadStudentProfile(studentId: number): Observable<Student | null> {
    this._loading.set(true);
    this._error.set(null);

    return this.apiClient.get<Student>(`/usuarios/${studentId}`).pipe(
      tap(student => {
        this._student.set(student);
        console.log('👤 Estudiante cargado:', student);
        
        // Cargar datos relacionados según especificaciones
        this.loadUniversity(student.universidad_id);
        this.loadExperiences(studentId);
        this.loadProjects(studentId);
        this.loadUserSkills(studentId);
        this.loadFollowersCount(studentId);
        // this.loadForumActivity(studentId); // ❌ COMENTADO TEMPORALMENTE
        this.checkFollowingStatus(studentId);
      }),
      catchError(error => {
        console.error('❌ Error cargando estudiante:', error);
        this._error.set('No se pudo cargar el perfil del estudiante');
        this._loading.set(false);
        return of(null);
      })
    );
  }

  /**
   * ✅ Cargar información de la universidad según REQ-4.6.1
   */
  private loadUniversity(universityId: number): void {
    this.apiClient.get<University>(`/universidades/${universityId}`).pipe(
      tap(university => {
        this._university.set(university);
        console.log('🏛️ Universidad cargada:', university);
      }),
      catchError(error => {
        console.error('❌ Error cargando universidad:', error);
        return of(null);
      })
    ).subscribe();
  }

  /**
   * ✅ Cargar experiencias profesionales según REQ-4.22.3 y REQ-4.22.4
   */
  private loadExperiences(studentId: number): void {
    console.log('🔍 Cargando experiencias para usuario:', studentId);
    
    this.apiClient.get<Experience[]>(`/experiencia-usuario`).pipe(
      tap(allExperiences => {
        console.log('📋 Todas las experiencias del servidor:', allExperiences);
        
        // Filtrar solo las experiencias del usuario específico
        const userExperiences = allExperiences.filter(exp => exp.usuario_id === studentId);
        console.log('🎯 Experiencias filtradas para usuario', studentId, ':', userExperiences);
        
        if (userExperiences && userExperiences.length > 0) {
          // Ordenar por fecha de inicio descendente según REQ-4.22.4
          const sortedExperiences = userExperiences.sort((a, b) => 
            new Date(b.fecha_inicio).getTime() - new Date(a.fecha_inicio).getTime()
          );
          this._experiences.set(sortedExperiences);
          console.log('💼 Experiencias finales cargadas y ordenadas:', sortedExperiences);
        } else {
          console.log('ℹ️ No se encontraron experiencias para el usuario', studentId);
          this._experiences.set([]);
        }
      }),
      catchError(error => {
        console.error('❌ Error cargando experiencias:', error);
        this._experiences.set([]);
        return of([]);
      })
    ).subscribe();
  }

  /**
   * ✅ Cargar proyectos académicos según REQ-4.8.1 y REQ-4.10.2
   */
  private loadProjects(studentId: number): void {
    console.log('🔍 Cargando proyectos para usuario:', studentId);
    
    this.apiClient.get<Project[]>(`/proyectos`).pipe(
      tap(allProjects => {
        console.log('📋 Todos los proyectos del servidor:', allProjects);
        
        // Filtrar solo los proyectos del usuario específico
        const userProjects = allProjects.filter(project => project.creador_id === studentId);
        console.log('🎯 Proyectos filtrados para usuario', studentId, ':', userProjects);
        
        this._projects.set(userProjects);
        console.log('📊 Proyectos finales cargados:', userProjects);
        this._loading.set(false);
      }),
      catchError(error => {
        console.error('❌ Error cargando proyectos para usuario', studentId, ':', error);
        this._projects.set([]);
        this._loading.set(false);
        return of([]);
      })
    ).subscribe();
  }

  /**
   * ✅ Cargar habilidades del usuario desde tabla user_skills
   */
  private loadUserSkills(studentId: number): void {
    console.log('🔍 Cargando habilidades para usuario:', studentId);
    
    this.apiClient.get<UserSkill[]>(`/user-skills`).pipe(
      tap(allSkills => {
        console.log('📋 Todas las habilidades del servidor:', allSkills);
        
        // Filtrar solo las habilidades del usuario específico
        const userSkills = allSkills.filter(skill => skill.usuario_id === studentId);
        console.log('🎯 Habilidades filtradas para usuario', studentId, ':', userSkills);
        
        this._userSkills.set(userSkills);
        console.log('🛠️ Habilidades finales cargadas:', userSkills);
      }),
      catchError(error => {
        console.error('❌ Error cargando habilidades para usuario', studentId, ':', error);
        this._userSkills.set([]);
        return of([]);
      })
    ).subscribe();
  }

    /**
   * ✅ Cargar actividad en foros según REQ-4.19.1
   * hilos = foros de discusión, respuestas_hilo = comentarios en foros
   * ❌ COMENTADO TEMPORALMENTE PARA DEBUGGING
   */
  /*
  private loadForumActivity(studentId: number): void {
    console.log('🔍 Cargando actividad en foros para usuario:', studentId);
    
    // Cargar foros de discusión creados por el usuario (tabla hilos)
    const hilosCreados$ = this.apiClient.get<any[]>(`/hilos`).pipe(
      tap(allHilos => console.log('📋 Todos los foros de discusión del servidor:', allHilos)),
      map(allHilos => {
        const userHilos = allHilos.filter(hilo => hilo.creador_id === studentId);
        console.log('✨ Foros de discusión creados por usuario:', userHilos);
        return userHilos.map(hilo => ({
          id: hilo.id,
          titulo: hilo.titulo,
          contenido: hilo.contenido,
          creado_en: hilo.creado_en,
          tipo: 'hilo' as const,
          foro_id: hilo.foro_id,
          creador_id: hilo.creador_id
        }));
      }),
      catchError(error => {
        console.error('❌ Error cargando hilos:', error);
        return of([]);
      })
    );
    
    // Cargar respuestas hechas por el usuario en hilos/discusiones
    const respuestasUsuario$ = this.apiClient.get<any[]>(`/respuestas-hilos`).pipe(
      tap(allRespuestas => console.log('💬 Todas las respuestas del servidor:', allRespuestas)),
      map(allRespuestas => {
        const userRespuestas = allRespuestas.filter(respuesta => respuesta.usuario_id === studentId);
        console.log('💭 Respuestas hechas por usuario:', userRespuestas);
        return userRespuestas.map(respuesta => ({
          id: respuesta.id,
          contenido: respuesta.contenido,
          creado_en: respuesta.creado_en,
          tipo: 'respuesta' as const,
          hilo_id: respuesta.hilo_id,
          usuario_id: respuesta.usuario_id
        }));
      }),
      catchError(error => {
        console.error('❌ Error cargando respuestas:', error);
        return of([]);
      })
    );
    
    // Combinar hilos y respuestas
    combineLatest([hilosCreados$, respuestasUsuario$]).pipe(
      map(([hilos, respuestas]) => {
        console.log('🧵 Hilos procesados:', hilos);
        console.log('💬 Respuestas procesadas:', respuestas);
        
        const allActivity: ForumActivity[] = [...hilos, ...respuestas];
        console.log('🎯 Actividad combinada para usuario', studentId, ':', allActivity);
        
        // Verificar que los tipos están correctos
        allActivity.forEach((item, index) => {
          console.log(`📝 Item ${index}:`, {
            id: item.id,
            tipo: item.tipo,
            titulo: item.titulo || 'N/A',
            esHilo: item.tipo === 'hilo',
            esRespuesta: item.tipo === 'respuesta'
          });
        });
        
        // Ordenar por fecha más reciente y limitar a 5
        const recentActivity = allActivity
          .sort((a, b) => new Date(b.creado_en).getTime() - new Date(a.creado_en).getTime())
          .slice(0, 5);
        
        console.log('💬 Actividad en foros final (5 más recientes):', recentActivity);
        return recentActivity;
      }),
      catchError(error => {
        console.error('❌ Error combinando actividad de foros:', error);
        return of([]);
      })
    ).subscribe(activity => {
      this._forumActivity.set(activity);
    });
  }
  */
  // private loadForumActivity(studentId: number): void {
  //   console.log('🔍 Cargando actividad en foros para usuario:', studentId);
    
  //   // Cargar foros de discusión creados por el usuario (tabla hilos)
  //   const hilosCreados$ = this.apiClient.get<any[]>(`/hilos`).pipe(
  //     tap(allHilos => console.log('📋 Todos los foros de discusión del servidor:', allHilos)),
  //     map(allHilos => {
  //       const userHilos = allHilos.filter(hilo => hilo.creador_id === studentId);
  //       console.log('✨ Foros de discusión creados por usuario:', userHilos);
  //       return userHilos.map(hilo => ({
  //         id: hilo.id,
  //         titulo: hilo.titulo,
  //         contenido: hilo.contenido,
  //         creado_en: hilo.creado_en,
  //         tipo: 'hilo' as const,
  //         foro_id: hilo.foro_id,
  //         creador_id: hilo.creador_id
  //       }));
  //     }),
  //     catchError(error => {
  //       console.error('❌ Error cargando hilos:', error);
  //       return of([]);
  //     })
  //   );
    
    // Cargar respuestas hechas por el usuario en hilos/discusiones
    // const respuestasUsuario$ = this.apiClient.get<any[]>(`/respuestas-hilos`).pipe(
    //   tap(allRespuestas => console.log('� Todas las respuestas del servidor:', allRespuestas)),
    //   map(allRespuestas => {
    //     const userRespuestas = allRespuestas.filter(respuesta => respuesta.usuario_id === studentId);
    //     console.log('💭 Respuestas hechas por usuario:', userRespuestas);
    //     return userRespuestas.map(respuesta => ({
    //       id: respuesta.id,
    //       contenido: respuesta.contenido,
    //       creado_en: respuesta.creado_en,
    //       tipo: 'respuesta' as const,
    //       hilo_id: respuesta.hilo_id,
    //       usuario_id: respuesta.usuario_id
    //     }));
    //   }),
    //   catchError(error => {
    //     console.error('❌ Error cargando respuestas:', error);
    //     return of([]);
    //   })
    // );
    
    // Combinar hilos y respuestas
  //   combineLatest([hilosCreados$, respuestasUsuario$]).pipe(
  //     map(([hilos, respuestas]) => {
  //       console.log('🧵 Hilos procesados:', hilos);
  //       console.log('💬 Respuestas procesadas:', respuestas);
        
  //       const allActivity: ForumActivity[] = [...hilos, ...respuestas];
  //       console.log('🎯 Actividad combinada para usuario', studentId, ':', allActivity);
        
  //       // Verificar que los tipos están correctos
  //       allActivity.forEach((item, index) => {
  //         console.log(`📝 Item ${index}:`, {
  //           id: item.id,
  //           tipo: item.tipo,
  //           titulo: item.titulo || 'N/A',
  //           esHilo: item.tipo === 'hilo',
  //           esRespuesta: item.tipo === 'respuesta'
  //         });
  //       });
        
  //       // Ordenar por fecha más reciente y limitar a 5
  //       const recentActivity = allActivity
  //         .sort((a, b) => new Date(b.creado_en).getTime() - new Date(a.creado_en).getTime())
  //         .slice(0, 5);
        
  //       console.log('💬 Actividad en foros final (5 más recientes):', recentActivity);
  //       return recentActivity;
  //     }),
  //     catchError(error => {
  //       console.error('❌ Error combinando actividad de foros:', error);
  //       return of([]);
  //     })
  //   ).subscribe(activity => {
  //     this._forumActivity.set(activity);
  //   });
  // }

  /**
   * ✅ Verificar si el usuario actual sigue a este estudiante
   * Consulta tabla seguimientos con seguidor_id y seguido_usuario_id
   */
  private checkFollowingStatus(studentId: number): void {
    const currentUser = this.authService.currentUser();
    if (!currentUser || currentUser.id === studentId) {
      return;
    }

    // Obtener todos los seguimientos y filtrar en el frontend
    this.apiClient.get<Following[]>('/seguimientos').pipe(
      tap(allFollowings => {
        // Buscar si existe un seguimiento del usuario actual hacia el estudiante
        const isFollowing = allFollowings.some(follow => 
          follow.seguidor_id === currentUser.id && 
          follow.seguido_usuario_id === studentId
        );
        this._isFollowing.set(isFollowing);
        console.log('👥 Estado de seguimiento:', isFollowing);
      }),
      catchError(error => {
        console.error('❌ Error verificando estado de seguimiento:', error);
        this._isFollowing.set(false);
        return of([]);
      })
    ).subscribe();
  }

  /**
   * ✅ Seguir/dejar de seguir usuario según REQ-4.6.1
   * Tabla: seguimientos (id, seguidor_id, seguido_usuario_id, creado_en)
   */
  followUser(studentId: number): void {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      this.toastService.showError('Debes iniciar sesión para seguir usuarios');
      return;
    }

    if (currentUser.id === studentId) {
      this.toastService.showWarning('No puedes seguirte a ti mismo');
      return;
    }

    // Evitar múltiples requests simultáneos
    if (this._loading()) {
      return;
    }

    const isCurrentlyFollowing = this._isFollowing();
    this._loading.set(true); // ✅ Activar estado de carga
    
    if (!isCurrentlyFollowing) {
      // ✅ Verificar primero si ya existe el seguimiento antes de crear
      this.apiClient.get<Following[]>('/seguimientos').pipe(
        tap(allFollowings => {
          // Verificar si ya existe el seguimiento
          const existingFollow = allFollowings.find(follow => 
            follow.seguidor_id === currentUser.id && 
            follow.seguido_usuario_id === studentId
          );

          if (existingFollow) {
            // Ya existe, solo actualizar el estado local
            this._isFollowing.set(true);
            this.toastService.showInfo('Ya sigues a este usuario');
            this._loading.set(false);
          } else {
            // No existe, proceder a crear
            const followData: CreateFollowing = {
              seguidor_id: currentUser.id,
              seguido_usuario_id: studentId,
              seguido_proyecto_id: null
            };

            console.log('📤 Enviando datos de seguimiento:', followData);

            this.apiClient.post<Following & { message: string }>('/seguimientos', followData).pipe(
              tap((response) => {
                this._isFollowing.set(true);
                this.toastService.showSuccess('Ahora sigues a este usuario');
                // ✅ Actualizar conteo de seguidores del usuario seguido
                this._followersCount.update(count => count + 1);
                console.log(`👥 Follow exitoso:`, {
                  followId: response.id,
                  seguidor: response.seguidor_id,
                  seguido: response.seguido_usuario_id,
                  fecha: response.creado_en
                });
              }),
              catchError(error => {
                console.error(`❌ Error en follow:`, error);
                if (error.status === 409) {
                  this.toastService.showWarning('Ya sigues a este usuario');
                  this._isFollowing.set(true);
                } else if (error.status === 500 && error.error?.error?.includes?.('llave duplicada')) {
                  this.toastService.showError('Error de base de datos: La secuencia de IDs necesita ser reparada. Contacta al administrador.');
                  console.error('🔧 Error de secuencia de IDs en base de datos. Ejecutar: SELECT setval(\'seguimientos_id_seq\', (SELECT MAX(id) FROM seguimientos));');
                } else {
                  this.toastService.showError('Error al seguir usuario');
                }
                return of(null);
              }),
              // ✅ Siempre desactivar loading al finalizar
              tap(() => this._loading.set(false))
            ).subscribe();
          }
        }),
        catchError(error => {
          console.error('❌ Error verificando seguimientos existentes:', error);
          this.toastService.showError('Error al verificar seguimientos');
          this._loading.set(false);
          return of([]);
        })
      ).subscribe();
    } else {
      // ✅ Eliminar seguimiento: primero buscar el ID, luego eliminar
      this.apiClient.get<Following[]>('/seguimientos').pipe(
        tap(allFollowings => {
          // Buscar el seguimiento específico
          const followingToDelete = allFollowings.find(follow => 
            follow.seguidor_id === currentUser.id && 
            follow.seguido_usuario_id === studentId
          );

          if (followingToDelete) {
            // Eliminar usando el ID encontrado
            this.apiClient.delete<{message: string}>(`/seguimientos/${followingToDelete.id}`).pipe(
              tap((response) => {
                this._isFollowing.set(false);
                this.toastService.showSuccess('Has dejado de seguir a este usuario');
                // ✅ Actualizar conteo de seguidores del usuario que se deja de seguir
                this._followersCount.update(count => Math.max(0, count - 1));
                console.log(`👥 Unfollow exitoso para usuario ${studentId}:`, response.message);
              }),
              catchError(error => {
                console.error(`❌ Error en unfollow:`, error);
                this.toastService.showError('Error al dejar de seguir usuario');
                return of(null);
              }),
              // ✅ Siempre desactivar loading al finalizar
              tap(() => this._loading.set(false))
            ).subscribe();
          } else {
            this.toastService.showWarning('No sigues a este usuario');
            this._isFollowing.set(false);
            this._loading.set(false);
          }
        }),
        catchError(error => {
          console.error(`❌ Error buscando seguimiento para eliminar:`, error);
          this.toastService.showError('Error al dejar de seguir usuario');
          this._loading.set(false);
          return of([]);
        })
      ).subscribe();
    }
  }

  /**
   * ✅ Iniciar conversación según REQ-4.14.1 y REQ-4.14.3
   */
  async startConversation(studentId: number): Promise<{ success: boolean; conversationId?: number }> {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      this.toastService.showError('Debes iniciar sesión para enviar mensajes');
      return { success: false };
    }

    if (currentUser.id === studentId) {
      this.toastService.showWarning('No puedes enviarte mensajes a ti mismo');
      return { success: false };
    }

    // Verificar seguimiento mutuo según REQ-4.14.3
    const canChat = await this.verifyMutualFollowing(studentId);
    if (!canChat) {
      this.toastService.showError('Solo puedes enviar mensajes a usuarios que también te sigan');
      return { success: false };
    }

    try {
      // Crear o encontrar conversación existente
      const conversation = await firstValueFrom(
        this.conversationService.createConversation({
          usuario_1_id: currentUser.id,
          usuario_2_id: studentId
        }).pipe(
          tap(conv => {
            console.log('💬 Conversación creada/encontrada:', conv);
            this.toastService.showSuccess('Conversación iniciada');
          }),
          catchError(error => {
            console.error('❌ Error creando conversación:', error);
            this.toastService.showError('Error al iniciar conversación');
            throw error;
          })
        )
      );

      return { success: true, conversationId: conversation.id };
    } catch (error) {
      return { success: false };
    }
  }

  /**
   * ✅ Verificar seguimiento mutuo según REQ-4.14.3
   */
  private async verifyMutualFollowing(studentId: number): Promise<boolean> {
    try {
      const currentUser = this.authService.currentUser();
      if (!currentUser) return false;

      const allFollowings = await firstValueFrom(
        this.apiClient.get<Following[]>('/seguimientos')
      );

      // Verificar si ambos usuarios se siguen mutuamente
      const userFollowsStudent = allFollowings.some(follow => 
        follow.seguidor_id === currentUser.id && 
        follow.seguido_usuario_id === studentId
      );
      
      const studentFollowsUser = allFollowings.some(follow => 
        follow.seguidor_id === studentId && 
        follow.seguido_usuario_id === currentUser.id
      );

      return userFollowsStudent && studentFollowsUser;
    } catch (error) {
      console.error('❌ Error verificando seguimiento mutuo:', error);
      return false;
    }
  }

  /**
   * ✅ Obtener año de graduación
   */
  getGraduationYear(): string {
    const student = this._student();
    if (!student) return 'En curso';
    const anoGraduacion = (student as any)['año_graduacion'];
    return anoGraduacion || 'En curso';
  }

  /**
   * ✅ Cargar conteo de seguidores del usuario
   */
  private loadFollowersCount(studentId: number): void {
    console.log('👥 Cargando conteo de seguidores para usuario:', studentId);
    
    this.apiClient.get<Following[]>('/seguimientos').pipe(
      tap(allFollowings => {
        // Contar cuántos usuarios siguen a este estudiante
        const followersCount = allFollowings.filter(follow => 
          follow.seguido_usuario_id === studentId
        ).length;
        
        this._followersCount.set(followersCount);
        console.log('👥 Conteo de seguidores cargado:', followersCount);
      }),
      catchError(error => {
        console.error('❌ Error cargando conteo de seguidores:', error);
        this._followersCount.set(0);
        return of([]);
      })
    ).subscribe();
  }

  /**
   * ✅ Obtener habilidades del estudiante desde user_skills
   */
  getStudentSkills(): string[] {
    const userSkills = this._userSkills();
    return userSkills.map(skill => skill.skill_name);
  }

  /**
   * ✅ Limpiar estado del servicio
   */
  clearProfile(): void {
    this._student.set(null);
    this._university.set(null);
    this._experiences.set([]);
    this._projects.set([]);
    this._forumActivity.set([]);
    this._userSkills.set([]);
    this._loading.set(false);
    this._error.set(null);
    this._isFollowing.set(false);
    this._followersCount.set(0);
  }

  /**
   * ✅ Obtener estadísticas del perfil
   */
  getProfileStats(): { 
    projects: number; 
    forums: number; 
    connections: number; 
    experiences: number 
  } {
    return {
      projects: this._projects().length,
      // forums: this._forumActivity().length, // ❌ COMENTADO TEMPORALMENTE
      forums: 0, // ❌ TEMPORAL - RETORNA 0
      connections: 0, // Implementar cuando esté disponible
      experiences: this._experiences().length
    };
  }
}
