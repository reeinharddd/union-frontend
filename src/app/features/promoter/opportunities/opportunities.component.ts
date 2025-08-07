import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
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
  selector: 'app-lista-oportunidades',
  templateUrl: './opportunities.component.html',
  imports: [CommonModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush, // Añade esto
})
export class OpportunitiesComponent implements OnInit {
  oportunidades: Opportunity[] = [];
  postulaciones: any[] = [];
  postulacionesPorOportunidad: { [key: number]: any[] } = {};

  universidadesMap: { [key: number]: string } = {};
  modalidadesMap: { [key: number]: string } = {};
  tiposOportunidadMap: { [key: number]: string } = {};

  userId: number | null = null;
  isLoading = false;

  private cdr = inject(ChangeDetectorRef); // Añade esto

  constructor(
    private opportunityService: OpportunityService,
    private tokenService: TokenService,
    private workModalityService: WorkModalityService,
    private universityService: UniversityService,
    private typeOpportunityService: OpportunityTypeService,
    private postulationService: PostulationService,
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.userId = this.tokenService.getUserId();
    if (this.userId !== null) {
      this.cargarDatosIniciales();
    }
  }

  cargarDatosIniciales(): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    // Carga todo en paralelo
    forkJoin([
      this.universityService.getAll(),
      this.workModalityService.getAll(),
      this.typeOpportunityService.getAll(),
      this.opportunityService.getAll(),
      this.postulationService.getAll(),
    ]).subscribe({
      next: ([universidades, modalidades, tipos, oportunidades, postulaciones]) => {
        // Mapea los datos de referencia
        this.universidadesMap = this.crearMapa(universidades, 'id', 'nombre');
        this.modalidadesMap = this.crearMapa(modalidades, 'id', 'name');
        this.tiposOportunidadMap = this.crearMapa(tipos, 'id', 'name');

        // Filtra oportunidades del usuario
        this.oportunidades = oportunidades.filter(op => op.created_by === this.userId);

        // Procesa postulaciones
        this.procesarPostulaciones(postulaciones);

        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: err => {
        this.isLoading = false;
        this.cdr.markForCheck();
        console.error('Error al cargar datos:', err);
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

  private procesarPostulaciones(postulaciones: any[]): void {
    this.postulaciones = postulaciones;
    this.postulacionesPorOportunidad = {};

    const oportunidadesIds = this.oportunidades.map(o => o.id);
    const postulacionesFiltradas = postulaciones.filter(p =>
      oportunidadesIds.includes(p.oportunidad_id),
    );

    // Obtener usuarios únicos
    const usuariosIds = [...new Set(postulacionesFiltradas.map(p => p.usuario_id))];

    if (usuariosIds.length > 0) {
      forkJoin(usuariosIds.map(id => this.userService.getById(id))).subscribe(usuarios => {
        postulacionesFiltradas.forEach(postulacion => {
          const usuario = usuarios.find(u => u.id === postulacion.usuario_id);
          if (usuario) {
            (postulacion as any).nombre_usuario = usuario.nombre;
            (postulacion as any).correo_usuario = usuario.correo;
          }

          const oportunidadId = postulacion.oportunidad_id;
          if (!this.postulacionesPorOportunidad[oportunidadId]) {
            this.postulacionesPorOportunidad[oportunidadId] = [];
          }
          this.postulacionesPorOportunidad[oportunidadId].push(postulacion);
        });

        this.cdr.markForCheck();
      });
    }
  }

  editarOportunidad(oportunidad: Opportunity): void {
    this.router.navigate(['/promoter/opportunity/edit', oportunidad.id]);
  }

  eliminarOportunidad(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta oportunidad?')) {
      this.opportunityService.delete(id).subscribe({
        next: () => {
          this.oportunidades = this.oportunidades.filter(o => o.id !== id);
          this.cdr.markForCheck();
        },
      });
    }
  }
}
