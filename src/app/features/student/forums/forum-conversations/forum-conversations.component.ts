import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from '@app/core/services/auth/token.service';
import { ApiClientService } from '@app/core/services/base/api-client.service';

@Component({
  selector: 'app-forum-conversations',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule],
  templateUrl: './forum-conversations.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForumConversationsComponent {
  respuestas: any[] = [];
  hiloId: number | null = null;
  hiloTitulo: string = '';
  hiloContenido: string = '';
  foroNombre: string = '';
  nuevaRespuesta: string = '';
  enviando: boolean = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiClient: ApiClientService,
    private cdr: ChangeDetectorRef,
    private tokenService: TokenService,
  ) {}

  enviarRespuesta() {
    if (!this.nuevaRespuesta.trim() || !this.hiloId) return;
    this.enviando = true;
    // Obtener el id del usuario autenticado
    const userId = this.tokenService.getUserId && this.tokenService.getUserId();
    if (!userId) {
      alert('No se pudo identificar al usuario autenticado.');
      this.enviando = false;
      return;
    }
    // Forzar tipos correctos
    const payload = {
      contenido: String(this.nuevaRespuesta),
      hilo_id: Number(this.hiloId),
      usuario_id: Number(userId),
    };
    console.log('Payload a enviar:', payload);
    this.apiClient.post('/respuestas-Hilo', payload).subscribe({
      next: () => {
        this.nuevaRespuesta = '';
        this.enviando = false;
        // Recargar respuestas
        this.apiClient.get(`/respuestas-Hilo?hilo_id=${this.hiloId}`).subscribe({
          next: async (data: any) => {
            // Filtrar solo respuestas del hilo actual
            const soloRespuestasHilo = Array.isArray(data)
              ? data.filter(r => Number(r.hilo_id) === Number(this.hiloId))
              : [];
            this.respuestas = soloRespuestasHilo;
            for (const respuesta of this.respuestas) {
              const autorId =
                respuesta.autor_id ??
                respuesta.usuario_id ??
                respuesta.user_id ??
                respuesta.creador_id ??
                respuesta.id_usuario;
              if (autorId !== undefined && autorId !== null && autorId !== '') {
                try {
                  const usuario: any = await this.apiClient.get(`/usuarios/${autorId}`).toPromise();
                  if (usuario && typeof usuario === 'object' && 'nombre' in usuario) {
                    respuesta.autor_nombre = usuario.nombre;
                  } else {
                    respuesta.autor_nombre = autorId;
                  }
                } catch {
                  respuesta.autor_nombre = autorId;
                }
              } else {
                respuesta.autor_nombre = 'Usuario';
              }
            }
            this.cdr.markForCheck();
          },
          error: () => {
            this.respuestas = [];
            this.cdr.markForCheck();
          },
        });
      },
      error: () => {
        this.enviando = false;
      },
    });
  }

  // ...el constructor ya fue movido arriba para incluir TokenService

  ngOnInit() {
    // Obtener el nombre del foro usando el parámetro de ruta 'id'
    const foroId = this.route.snapshot.paramMap.get('id');
    if (foroId) {
      this.apiClient.get(`/foros/${foroId}`).subscribe({
        next: (foroData: any) => {
          this.foroNombre = foroData?.nombre || '';
          this.cdr.markForCheck();
        },
        error: () => {
          this.foroNombre = '';
          this.cdr.markForCheck();
        },
      });
    }
    // Obtener datos del hilo y respuestas usando el query param
    this.route.queryParamMap.subscribe(params => {
      const hilo = params.get('hilo');
      this.hiloId = hilo ? +hilo : null;
      if (this.hiloId) {
        // Obtener datos del hilo
        this.apiClient.get(`/hilos/${this.hiloId}`).subscribe({
          next: (hiloData: any) => {
            this.hiloTitulo = hiloData?.titulo || '';
            this.hiloContenido = hiloData?.contenido || '';
            this.cdr.markForCheck();
          },
          error: () => {
            this.hiloTitulo = '';
            this.hiloContenido = '';
            this.cdr.markForCheck();
          },
        });
        // Obtener respuestas del hilo
        this.apiClient.get(`/respuestas-Hilo?hilo_id=${this.hiloId}`).subscribe({
          next: async (data: any) => {
            // Filtrar solo respuestas del hilo actual
            const soloRespuestasHilo = Array.isArray(data)
              ? data.filter(r => Number(r.hilo_id) === Number(this.hiloId))
              : [];
            this.respuestas = soloRespuestasHilo;
            for (const respuesta of this.respuestas) {
              // Intenta detectar el campo correcto para el autor
              const autorId =
                respuesta.autor_id ??
                respuesta.usuario_id ??
                respuesta.user_id ??
                respuesta.creador_id ??
                respuesta.id_usuario;
              if (autorId !== undefined && autorId !== null && autorId !== '') {
                try {
                  const usuario: any = await this.apiClient.get(`/usuarios/${autorId}`).toPromise();
                  if (usuario && typeof usuario === 'object') {
                    if ('nombre' in usuario) {
                      respuesta.autor_nombre = usuario.nombre;
                    } else {
                      respuesta.autor_nombre = JSON.stringify(usuario);
                    }
                  } else {
                    respuesta.autor_nombre = autorId;
                  }
                } catch (e) {
                  respuesta.autor_nombre = autorId;
                }
              } else {
                respuesta.autor_nombre = 'Usuario';
              }
            }
            this.cdr.markForCheck();
          },
          error: () => {
            this.respuestas = [];
            this.cdr.markForCheck();
          },
        });
      }
    });
  }

  goBack() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
