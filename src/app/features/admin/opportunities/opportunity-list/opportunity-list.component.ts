
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
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

  editarOpportunity(opportunity: any) {
    this.router.navigate([`/admin/opportunities/${opportunity.id}/edit`]);
  }

  eliminarOpportunity(opportunity: any) {
    if (confirm('¿Seguro que deseas eliminar esta oportunidad?')) {
      this.opportunityService.delete(opportunity.id).subscribe({
        next: () => {
          this.opportunities$ = this.opportunityService.getAll();
          this.cdr.markForCheck();
        },
        error: () => {
          alert('Error al eliminar la oportunidad');
        }
      });
    }
  }
}
