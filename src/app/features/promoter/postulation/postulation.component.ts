import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TokenService } from '@app/core/services/auth/token.service';
import {
  Opportunity,
  OpportunityService,
} from '@app/core/services/opportunity/opportunity.service';
import { OpportunityTypeService } from '@app/core/services/opportunity/opportunityType.service';
import { PostulationService } from '@app/core/services/postulation/postulation.service';
import { UniversityService } from '@app/core/services/university/university.service';
import { UserService } from '@app/core/services/user/user.service';
import { WorkModalityService } from '@app/core/services/workModality/workModality.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-postuation-candidate',
  templateUrl: './postulation.component.html',
  imports: [CommonModule, FormsModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush, // Añade esto
})
export class PostulationComponent implements OnInit {
  oportunidades: Opportunity[] = [];
  postulaciones: any[] = [];
  postulacionesFiltradas: any[] = [];
  estadoSeleccionado: string = '';
  postulacionesPorOportunidad: { [key: number]: any[] } = {};

  universidadesMap: { [key: number]: string } = {};
  modalidadesMap: { [key: number]: string } = {};
  tiposOportunidadMap: { [key: number]: string } = {};

  userId: number | null = null;
  isLoading = false;
  mensajeExito: string = '';
  mensajeError: string = '';

  private readonly cdr = inject(ChangeDetectorRef); // Añade esto

  constructor(
    private opportunityService: OpportunityService,
    private tokenService: TokenService,
    private workModalityService: WorkModalityService,
    private universityService: UniversityService,
    private typeOpportunityService: OpportunityTypeService,
    private postulationService: PostulationService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.userId = this.tokenService.getUserId();
    if (this.userId !== null) {
      this.cargarDatosIniciales();
    }
  }

  cargarDatosIniciales(): void {
    this.isLoading = true;

    // Carga todo en paralelo
    forkJoin([
      this.universityService.getAll(),
      this.workModalityService.getAll(),
      this.typeOpportunityService.getAll(),
    ]).subscribe({
      next: ([universidades, modalidades, tipos]) => {
        // Mapea los datos
        this.universidadesMap = this.crearMapa(universidades, 'id', 'nombre');
        this.modalidadesMap = this.crearMapa(modalidades, 'id', 'name');
        this.tiposOportunidadMap = this.crearMapa(tipos, 'id', 'name');

        // Ahora carga oportunidades y postulaciones
        this.cargarOportunidadesYPostulaciones();
      },
      error: () => {
        this.isLoading = false;
        this.mensajeError = 'Error al cargar datos iniciales';
        this.cdr.markForCheck();
      },
    });
  }

  private crearMapa(items: any[], keyProp: string, valueProp: string): { [key: number]: string } {
    const mapa: { [key: number]: string } = {};
    items.forEach(item => {
      mapa[item[keyProp]] = item[valueProp];
    });
    return mapa;
  }

  cargarOportunidadesYPostulaciones(): void {
    forkJoin([this.opportunityService.getAll(), this.postulationService.getAll()]).subscribe({
      next: ([oportunidades, postulaciones]) => {
        // Filtra oportunidades creadas por este usuario
        this.oportunidades = oportunidades.filter(op => op.created_by === this.userId);

        // Procesa postulaciones
        this.procesarPostulaciones(postulaciones);

        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.mensajeError = 'Error al cargar oportunidades';
        this.cdr.markForCheck();
      },
    });
  }

  procesarPostulaciones(postulaciones: any[]): void {
    const oportunidadesIds = this.oportunidades.map(o => o.id);
    this.postulaciones = postulaciones.filter(p => oportunidadesIds.includes(p.oportunidad_id));
    this.postulacionesFiltradas = [...this.postulaciones];

    // Agrupa por oportunidad
    this.postulacionesPorOportunidad = {};
    oportunidadesIds.forEach(id => {
      this.postulacionesPorOportunidad[id] = this.postulaciones.filter(
        p => p.oportunidad_id === id,
      );
    });

    // Obtiene información de usuarios
    const usuariosIds = [...new Set(this.postulaciones.map(p => p.usuario_id))];
    if (usuariosIds.length > 0) {
      forkJoin(usuariosIds.map(id => this.userService.getById(id))).subscribe(usuarios => {
        usuarios.forEach(usuario => {
          this.postulaciones
            .filter(p => p.usuario_id === usuario.id)
            .forEach(p => {
              p.nombre_usuario = usuario.nombre;
              p.correo_usuario = usuario.correo;
            });
        });
        this.cdr.markForCheck();
      });
    }
  }

  filtrarPostulaciones(): void {
    if (this.estadoSeleccionado) {
      this.postulacionesFiltradas = this.postulaciones.filter(
        post => post.estado === this.estadoSeleccionado,
      );
    } else {
      this.postulacionesFiltradas = [...this.postulaciones];
    }
    this.cdr.markForCheck();
  }

  actualizarEstado(postulacionId: number, nuevoEstado: string): void {
    this.postulationService.update(postulacionId, { estado: nuevoEstado }).subscribe({
      next: () => {
        // Actualiza el estado localmente sin recargar todo
        const postulacion = this.postulaciones.find(p => p.id === postulacionId);
        if (postulacion) {
          postulacion.estado = nuevoEstado;
          this.filtrarPostulaciones(); // Re-filtra
        }
        this.mensajeExito = 'Estado actualizado correctamente';
        setTimeout(() => (this.mensajeExito = ''), 3000);
        this.cdr.markForCheck();
      },
      error: () => {
        this.mensajeError = 'Error al actualizar el estado';
        setTimeout(() => (this.mensajeError = ''), 3000);
        this.cdr.markForCheck();
      },
    });
  }
}
