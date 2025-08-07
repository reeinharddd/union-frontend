import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TokenService } from '@app/core/services/auth/token.service';
import { OpportunityService } from '@app/core/services/opportunity/opportunity.service';
import { PostulationService } from '@app/core/services/postulation/postulation.service';
import { WorkModalityService } from '@app/core/services/workModality/workModality.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-postulation-student',
  templateUrl: './postulation.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class PostulationStudentComponent implements OnInit {
  oportunidades: any[] = [];
  postulaciones: any[] = [];
  postulacionesCompletas: any[] = [];
  modalidadesMap: { [key: number]: string } = {};
  usuario_id: number | null = null;
  mensajeError = '';
  isLoading = true;
  isCanceling = false; // Para controlar el estado de cancelación

  constructor(
    private tokenService: TokenService,
    private postulationService: PostulationService,
    private opportunityService: OpportunityService,
    private workModalityService: WorkModalityService,
    private cdr: ChangeDetectorRef, // Inyectar ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
    this.cargarModalidades();
  }

  cargarDatos(): void {
    this.isLoading = true;
    this.mensajeError = '';
    this.usuario_id = this.tokenService.getUserId();

    if (!this.usuario_id) {
      this.mensajeError = 'No se pudo identificar al usuario';
      this.isLoading = false;
      this.cdr.markForCheck();
      return;
    }

    forkJoin([
      this.opportunityService.getAll(),
      this.postulationService.getByUserId(this.usuario_id),
    ]).subscribe({
      next: ([oportunidades, postulaciones]) => {
        this.postulaciones = postulaciones.filter(
          postulacion => postulacion.usuario_id === this.usuario_id,
        );

        this.postulacionesCompletas = this.postulaciones.map(postulacion => {
          const oportunidad = oportunidades.find(o => o.id === postulacion.oportunidad_id);
          return {
            ...postulacion,
            oportunidad: oportunidad || null,
          };
        });

        this.isLoading = false;
        this.cdr.markForCheck(); // Forzar detección de cambios
      },
      error: err => {
        console.error('Error al cargar datos:', err);
        this.mensajeError = 'Error al cargar la información';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
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

  cancelarPostulacion(postulacionId: number): void {
    if (!confirm('¿Estás seguro de que deseas cancelar esta postulación?')) return;

    this.isCanceling = true;
    this.mensajeError = '';
    this.cdr.markForCheck();

    this.postulationService.update(postulacionId, { estado: 'cancelado' }).subscribe({
      next: () => {
        const index = this.postulacionesCompletas.findIndex(p => p.id === postulacionId);
        if (index !== -1) {
          this.postulacionesCompletas[index].estado = 'cancelado';
        }
        this.isCanceling = false;
        this.cdr.markForCheck();
      },
      error: err => {
        console.error('Error al cancelar postulación:', err);
        this.mensajeError = 'Error al cancelar la postulación. Intenta nuevamente.';
        this.isCanceling = false;
        this.cdr.markForCheck();
      },
    });
  }
}
