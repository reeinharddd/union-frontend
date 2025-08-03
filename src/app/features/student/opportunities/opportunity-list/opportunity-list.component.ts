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
//import { UserService } from '@app/core/services/user/user.service';

import { WorkModalityService } from '@app/core/services/workModality/workModality.service';

@Component({
  selector: 'app-lista-oportunidades',
  templateUrl: './opportunity-list.component.html',
  imports: [CommonModule, FormsModule],
  standalone: true,
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

  constructor(
    private opportunityService: OpportunityService,
    private workModalityService: WorkModalityService,
    private universityService: UniversityService,
    private typeOpportunityService: OpportunityTypeService,
    private postulationService: PostulationService,
    private tokenService: TokenService,
    //private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.cargarUniversidades();
    this.cargarModalidades();
    this.cargarTiposOportunidad();
    this.cargarOportunidades(); // aquí cargas la lista principal
  }

  cargarOportunidades(): void {
    this.opportunityService.getAll().subscribe({
      next: data => {
        this.oportunidades = data;
        this.oportunidadesFiltradas = [...data];
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
      console.error('❌ No se pudo obtener el ID del usuario.');
      return;
    }

    const nuevaPostulacion = {
      usuario_id: this.usuario_id,
      oportunidad_id: id,
      mensaje: 'Estoy interesado',
      estado: 'pendiente',
    };

    this.postulationService.create(nuevaPostulacion).subscribe({
      next: postulation => {
        console.log('🎉 Postulación realizada con éxito:', postulation);
      },
      error: err => {
        console.error('❌ Error al postularse:', err);
      },
    });
  }
}
