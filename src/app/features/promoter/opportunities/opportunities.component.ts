import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
      this.cargarOportunidades();
    }
    this.cargarUniversidades();
    this.cargarModalidades();
    this.cargarTiposOportunidad();
  }

  cargarOportunidades(): void {
    if (this.userId === null) return;
    this.isLoading = true;

    this.opportunityService.getAll().subscribe({
      next: data => {
        // Solo oportunidades creadas por este promotor
        this.oportunidades = data.filter(op => op.created_by === this.userId);
        this.cargarPostulaciones(); // Después de cargar las oportunidades
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  cargarPostulaciones(): void {
    this.postulationService.getAll().subscribe(postulaciones => {
      this.postulaciones = postulaciones;
      this.postulacionesPorOportunidad = {};

      const peticionesUsuarios = postulaciones.map(p => this.userService.getById(p.usuario_id));

      // Trae todos los usuarios en paralelo
      forkJoin(peticionesUsuarios).subscribe(usuarios => {
        this.postulaciones.forEach((postulacion, index) => {
          const usuario = usuarios[index];

          // Añade los datos directamente (sin necesidad de cambiar el modelo)
          (postulacion as any).nombre_usuario = usuario.nombre;
          (postulacion as any).correo_usuario = usuario.correo;

          const oportunidadId = postulacion.oportunidad_id;
          if (!this.postulacionesPorOportunidad[oportunidadId]) {
            this.postulacionesPorOportunidad[oportunidadId] = [];
          }
          this.postulacionesPorOportunidad[oportunidadId].push(postulacion);
        });
      });
    });
  }

  cargarUniversidades() {
    this.universityService.getAll().subscribe(data => {
      this.universidadesMap = {};
      data.forEach((uni: any) => {
        this.universidadesMap[uni.id] = uni.nombre;
      });
    });
  }

  cargarModalidades() {
    this.workModalityService.getAll().subscribe(data => {
      this.modalidadesMap = {};
      data.forEach((mod: any) => {
        this.modalidadesMap[mod.id] = mod.name;
      });
    });
  }

  cargarTiposOportunidad() {
    this.typeOpportunityService.getAll().subscribe(data => {
      this.tiposOportunidadMap = {};
      data.forEach((tipo: any) => {
        this.tiposOportunidadMap[tipo.id] = tipo.name;
      });
    });
  }

  editarOportunidad(oportunidad: Opportunity): void {
    this.router.navigate(['/promoter/oportunidad/editar', oportunidad.id]);
  }

  eliminarOportunidad(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta oportunidad?')) {
      this.opportunityService.delete(id).subscribe({
        next: () => {
          this.oportunidades = this.oportunidades.filter(o => o.id !== id);
        },
      });
    }
  }
}
