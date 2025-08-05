import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

  constructor(
    private opportunityService: OpportunityService,
    private tokenService: TokenService,
    private workModalityService: WorkModalityService,
    private universityService: UniversityService,
    private typeOpportunityService: OpportunityTypeService,
    private postulationService: PostulationService,
    private userService: UserService,
    //private router: Router,
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
    const userId = this.tokenService.getUserId();

    if (userId === null) {
      console.error('El ID del usuario es null');
      return;
    }

    this.opportunityService.getByPromoter(userId).subscribe(oportunidades => {
      this.postulaciones = [];
      this.postulacionesPorOportunidad = {};

      this.postulationService.getAll().subscribe(todasLasPostulaciones => {
        const oportunidadesIds = oportunidades.map(o => o.id);

        const postulacionesFiltradas = todasLasPostulaciones.filter(p =>
          oportunidadesIds.includes(p.oportunidad_id),
        );

        this.postulaciones = postulacionesFiltradas;

        oportunidadesIds.forEach(id => {
          this.postulacionesPorOportunidad[id] = postulacionesFiltradas.filter(
            p => p.oportunidad_id === id,
          );
        });

        const peticionesUsuarios = this.postulaciones.map(p =>
          this.userService.getById(p.usuario_id),
        );

        forkJoin(peticionesUsuarios).subscribe(usuarios => {
          this.postulaciones.forEach((postulacion, index) => {
            const usuario = usuarios[index];
            (postulacion as any).nombre_usuario = usuario.nombre;
            (postulacion as any).correo_usuario = usuario.correo;
          });
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

  filtrarPostulaciones(): void {
    if (this.estadoSeleccionado) {
      this.postulacionesFiltradas = this.postulaciones.filter(
        post => post.estado === this.estadoSeleccionado,
      );
    } else {
      this.postulacionesFiltradas = this.postulaciones;
    }
  }

  actualizarEstado(postulacionId: number, nuevoEstado: string): void {
    this.postulationService.update(postulacionId, { estado: nuevoEstado }).subscribe({
      next: () => {
        this.cargarPostulaciones(); // Refresca la vista
      },
      error: () => {
        alert('Error al actualizar el estado de la postulación');
      },
    });
  }
}
