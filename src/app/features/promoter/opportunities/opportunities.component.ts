import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  OpportunityService,
  Opportunity,
} from '@app/core/services/opportunity/opportunity.service';
import { Router } from '@angular/router';
import { TokenService } from '@app/core/services/auth/token.service';
import { WorkModalityService } from '@app/core/services/workModality/workModality.service';
import { UniversityService } from '@app/core/services/university/university.service';
import { OpportunityTypeService } from '@app/core/services/opportunity/opportunityType.service';

@Component({
  selector: 'app-lista-oportunidades',
  templateUrl: './opportunities.component.html',
  imports: [CommonModule],
  standalone: true,
})
export class OpportunitiesComponent implements OnInit {
  oportunidades: Opportunity[] = [];
  isLoading = false;
  universidadesMap: { [key: number]: string } = {};
  modalidadesMap: { [key: number]: string } = {};
  tiposOportunidadMap: { [key: number]: string } = {};

  constructor(
    private opportunityService: OpportunityService,
    private tokenService: TokenService,
    private workModalityService: WorkModalityService,
    private universityService: UniversityService,
    private typeOpportunityService: OpportunityTypeService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.cargarOportunidades();
    this.cargarUniversidades();
    this.cargarModalidades();
    this.cargarTiposOportunidad();
    this.cargarOportunidades(); // aquí cargas la lista principal
  }

  cargarOportunidades(): void {
    const userId = this.tokenService.getUserId();
    if (userId === null) {
      //this.toastService.showDanger('No se pudo obtener el ID del usuario');
      console.error('No se pudo obtener el ID del usuario');
      return;
    }
    this.opportunityService.getByPromoter(userId).subscribe({
      next: data => {
        this.oportunidades = data;
        this.isLoading = false;
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
