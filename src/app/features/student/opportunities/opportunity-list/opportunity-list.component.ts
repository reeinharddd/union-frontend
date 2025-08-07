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

import { WorkModalityService } from '@app/core/services/workModality/workModality.service';

@Component({
  selector: 'app-lista-oportunidades',
  templateUrl: './opportunity-list.component.html',
  imports: [CommonModule, FormsModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpportunityListComponent implements OnInit {
  oportunidades: Opportunity[] = [];
  isLoading = false;
  universidadesMap: { [key: number]: string } = {};
  modalidadesMap: { [key: number]: string } = {};
  tiposOportunidadMap: { [key: number]: string } = {};
  usuariosMap: { [key: number]: string } = {};
  filtroTipo: string = ''; // puede ser '' | '1' | '2'
  oportunidadesFiltradas: Opportunity[] = [];
  usuario_id: number | null = null;
  postulacionesRealizadas: number[] = []; // IDs de oportunidades a las que ya se postuló
  mensajeExito: string = '';
  mensajeError: string = '';

  private readonly cdr = inject(ChangeDetectorRef);
  universidad_id: number | null = null;

  constructor(
    private opportunityService: OpportunityService,
    private workModalityService: WorkModalityService,
    private universityService: UniversityService,
    private typeOpportunityService: OpportunityTypeService,
    private postulationService: PostulationService,
    private tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    this.cargarUniversidades();
    this.cargarModalidades();
    this.cargarTiposOportunidad();
    this.cargarOportunidades(); // aquí cargas la lista principal
    this.cargarPostulacionEstudiante();
  }

  cargarOportunidades(): void {
    const userData = this.tokenService.getUserData();
    this.universidad_id = userData?.universidad_id || null;
    if (!this.universidad_id) {
      console.error('no se pudo obtener el id de la universidad');
    }

    this.opportunityService.getByUniversity(this.universidad_id!).subscribe({
      next: data => {
        this.oportunidades = data;
        this.oportunidadesFiltradas = [...data];
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  cargarUniversidades() {
    this.universityService.getAll().subscribe(data => {
      this.universidadesMap = {};
      data.forEach((uni: any) => {
        this.universidadesMap[uni.id] = uni.nombre;
        this.cdr.markForCheck();
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

  cargarPostulacionEstudiante() {
    this.usuario_id = this.tokenService.getUserId();
    if (!this.usuario_id) {
      this.mensajeError = 'No se pudo obtener el ID del usuario.';
      return;
    }

    this.postulationService.getByUserId(this.usuario_id).subscribe(data => {
      // Guarda los IDs de oportunidades ya postuladas
      this.postulacionesRealizadas = data.map((postulacion: any) => postulacion.oportunidad_id);
      this.cdr.markForCheck();
    });
  }

  filtrarPorTipo(): void {
    if (this.filtroTipo === '') {
      this.oportunidadesFiltradas = [...this.oportunidades];
    } else {
      this.oportunidadesFiltradas = this.oportunidades.filter(
        o => o.opportunity_type_id === +this.filtroTipo,
      );
    }
  }

  postularse(id: number) {
    this.usuario_id = this.tokenService.getUserId();
    if (!this.usuario_id) {
      this.mensajeError = 'No se pudo obtener el ID del usuario.';
      return;
    }

    // Verificar si ya se postuló
    if (this.postulacionesRealizadas.includes(id)) {
      this.mensajeError = 'Ya estás postulado a esta oportunidad.';
      return;
    }

    const confirmacion = confirm('¿Estás seguro de que deseas postularte a esta oportunidad?');
    if (!confirmacion) return;

    const nuevaPostulacion = {
      usuario_id: this.usuario_id,
      oportunidad_id: id,
      mensaje: 'Estoy interesado',
      estado: 'pendiente',
    };

    this.postulationService.create(nuevaPostulacion).subscribe({
      next: _postulation => {
        this.postulacionesRealizadas.push(id);
        this.mensajeExito = '¡Postulación realizada con éxito!';
        this.mensajeError = '';
        this.cargarPostulacionEstudiante();
        // Eliminar la oportunidad de la lista filtrada
        // this.oportunidadesFiltradas = this.oportunidadesFiltradas.filter(
        //   oportunidad => oportunidad.id !== id,
        // );
      },
      error: err => {
        console.error('❌ Error al postularse:', err);
        this.mensajeError = 'Error al postularse. Intenta de nuevo.';
        this.mensajeExito = '';
      },
    });
  }
}
