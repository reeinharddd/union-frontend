import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Opportunity } from '../../../../core/models/opportunity/opportunity.interface';
import { OpportunityService } from '../opportunity.service';

@Component({
  selector: 'app-opportunity-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './opportunity-list.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpportunityListComponent {
  private opportunityService = inject(OpportunityService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef) as ChangeDetectorRef;
  opportunities$ = this.opportunityService.getAll();

  crearOpportunity() {
    this.router.navigate(['/admin/opportunities/new']);
  }

  editarOpportunity(opportunity: Opportunity) {
    this.router.navigate([`/admin/opportunities/${opportunity.id}/edit`]);
  }

  eliminarOpportunity(opportunity: Opportunity) {
    if (confirm('¿Seguro que deseas eliminar esta oportunidad?')) {
      this.opportunityService.delete(opportunity.id).subscribe({
        next: () => {
          this.opportunities$ = this.opportunityService.getAll();
          this.cdr.markForCheck();
        },
        error: () => {
          alert('Error al eliminar la oportunidad');
        },
      });
    }
  }

  verPostulantes(id: number) {
    this.router.navigate(['/admin/opportunities', id, 'postulants']);
  }

  getActiveOpportunities(opportunities: Opportunity[]): number {
    if (!opportunities) return 0;
    const now = new Date();
    return opportunities.filter(opp => !opp.fecha_limite || new Date(opp.fecha_limite) > now)
      .length;
  }

  getTotalPostulantes(opportunities: (Opportunity & { total_postulantes?: number })[]): number {
    if (!opportunities) return 0;
    return opportunities.reduce((total, opp) => total + (opp.total_postulantes || 0), 0);
  }

  getExpiringOpportunities(opportunities: Opportunity[]): number {
    if (!opportunities) return 0;
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return opportunities.filter(opp => {
      if (!opp.fecha_limite) return false;
      const deadline = new Date(opp.fecha_limite);
      return deadline > now && deadline <= nextWeek;
    }).length;
  }

  isExpiringSoon(fechaLimite: string): boolean {
    if (!fechaLimite) return false;
    const now = new Date();
    const deadline = new Date(fechaLimite);
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return deadline > now && deadline <= nextWeek;
  }

  getOpportunityStatus(opportunity: Opportunity): string {
    if (!opportunity.fecha_limite) return 'Sin fecha límite';

    const now = new Date();
    const deadline = new Date(opportunity.fecha_limite);

    if (deadline < now) return 'Vencida';
    if (this.isExpiringSoon(opportunity.fecha_limite)) return 'Por vencer';
    return 'Activa';
  }
}
