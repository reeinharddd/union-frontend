import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from '@app/core/services/auth/token.service';
import { ApiClientService } from '@app/core/services/base/api-client.service';

@Component({
  selector: 'app-forum-discussions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forum-discussions.component.html',
  styles: ``,
})
export class ForumDiscussionsComponent {
  foro: any = null;
  hilos: any[] = [];
  usuarioNombres: { [key: number]: string } = {};

  // Para manejar respuestas de hilos
  respuestasHilos: { [key: number]: any[] } = {};
  hiloSeleccionadoId: number | null = null;

  // Modal para crear hilo
  showModal = false;
  nuevoHilo = { titulo: '', contenido: '' };
  creandoHilo = false;
  errorCrearHilo = '';
  abrirModalHilo() {
    this.nuevoHilo = { titulo: '', contenido: '' };
    this.errorCrearHilo = '';
    this.showModal = true;
  }

  cerrarModalHilo() {
    this.showModal = false;
  }

  // ...existing code...

  constructor(
    private apiClient: ApiClientService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private tokenService: TokenService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.apiClient.get(`/foros/${id}`).subscribe({
        next: (data: any) => {
          this.foro = data;
          this.cdr.markForCheck();
        },
        error: () => {
          this.foro = null;
          this.cdr.markForCheck();
        },
      });

      // Llama a getHilos para mostrar los hilos del foro
      this.getHilos();
    }
  }

  crearHilo() {
    if (!this.nuevoHilo.titulo.trim()) {
      this.errorCrearHilo = 'El título es obligatorio';
      return;
    }
    const foroId = this.route.snapshot.paramMap.get('id');
    if (!foroId) {
      this.errorCrearHilo = 'No se encontró el foro';
      return;
    }
    // Obtener id usuario autenticado
    const userId = this.tokenService.getUserId && this.tokenService.getUserId();
    if (!userId) {
      this.errorCrearHilo = 'No se pudo identificar al usuario autenticado';
      return;
    }
    this.creandoHilo = true;
    this.errorCrearHilo = '';
    // Eliminar cualquier campo 'id' accidental del objeto nuevoHilo (sin warning de TS)
    const { id, ...rest } = this.nuevoHilo as any;
    const payload = {
      foro_id: Number(foroId),
      ...rest,
      creador_id: Number(userId),
    };
    this.apiClient.post('/hilos', payload).subscribe({
      next: () => {
        this.nuevoHilo = { titulo: '', contenido: '' };
        this.creandoHilo = false;
        this.showModal = false;
        this.getHilos();
      },
      error: () => {
        this.errorCrearHilo = 'Error al crear hilo';
        this.creandoHilo = false;
      },
    });
  }
  getHilos() {
    // Obtener los hilos del foro seleccionado
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.apiClient.get('/hilos').subscribe({
        next: async (data: any) => {
          this.hilos = Array.isArray(data)
            ? data.filter(hilo => String(hilo.foro_id) === String(id))
            : [];
          // Obtener nombres de usuarios
          for (const hilo of this.hilos) {
            if (hilo.creador_id && !this.usuarioNombres[hilo.creador_id]) {
              try {
                const usuario: any = await this.apiClient
                  .get(`/usuarios/${hilo.creador_id}`)
                  .toPromise();
                this.usuarioNombres[hilo.creador_id] =
                  usuario?.nombre || usuario?.username || hilo.creador_id;
              } catch {
                this.usuarioNombres[hilo.creador_id] = hilo.creador_id;
              }
              this.cdr.markForCheck();
            }
          }
          this.cdr.markForCheck();
        },
        error: () => {
          this.hilos = [];
          this.cdr.markForCheck();
        },
      });
    }
  }

  // Al hacer clic en un hilo, navegar a la conversación del hilo (respuestas)
  onHiloClick(hiloId: number) {
    const foroId = this.route.snapshot.paramMap.get('id');
    if (foroId) {
      this.router.navigate([`/student/forum/${foroId}/conversations`], {
        queryParams: { hilo: hiloId },
      });
    }
  }

  goBack() {
    this.router.navigate(['/student/forum']);
  }
}
