import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface AdminOpportunity {
  id: number;
  title: string;
  description: string;
  type: 'scholarship' | 'exchange' | 'internship' | 'research' | 'conference' | 'workshop';
  university: {
    id: number;
    name: string;
    logo?: string;
  };
  requirements: string[];
  applicationDeadline: string;
  startDate: string;
  endDate?: string;
  location: string;
  capacity?: number;
  applicationsCount: number;
  status: 'active' | 'closed' | 'draft' | 'expired';
  createdAt: string;
  updatedAt: string;
  tags: string[];
  budget?: number;
  isInternational: boolean;
}

interface OpportunityStats {
  totalOpportunities: number;
  activeOpportunities: number;
  totalApplications: number;
  expiredOpportunities: number;
  averageApplications: number;
  internationalOpportunities: number;
  totalBudget: number;
  mostPopularType: string;
}

@Component({
  selector: 'app-admin-opportunities',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-opportunities.component.html',
  styleUrl: './admin-opportunities.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminOpportunitiesComponent implements OnInit {
  readonly loading = signal(false);
  readonly opportunities = signal<AdminOpportunity[]>([]);
  readonly filteredOpportunities = signal<AdminOpportunity[]>([]);

  // Filters
  searchTerm = signal('');
  selectedType = signal('');
  selectedStatus = signal('');
  selectedInternational = signal('');

  // Pagination
  currentPage = signal(1);
  readonly itemsPerPage = signal(10);
  readonly totalPages = computed(() =>
    Math.ceil(this.filteredOpportunities().length / this.itemsPerPage()),
  );

  readonly paginatedOpportunities = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.filteredOpportunities().slice(start, end);
  });

  readonly opportunityStats = computed((): OpportunityStats => {
    const opps = this.opportunities();
    const totalOpportunities = opps.length;
    const activeOpportunities = opps.filter(o => o.status === 'active').length;
    const totalApplications = opps.reduce((sum, o) => sum + o.applicationsCount, 0);
    const expiredOpportunities = opps.filter(o => o.status === 'expired').length;
    const averageApplications = totalOpportunities > 0 ? totalApplications / totalOpportunities : 0;
    const internationalOpportunities = opps.filter(o => o.isInternational).length;
    const totalBudget = opps.reduce((sum, o) => sum + (o.budget || 0), 0);

    // Find most popular type
    const typeCounts = opps.reduce(
      (acc, o) => {
        acc[o.type] = (acc[o.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    const mostPopularType = Object.keys(typeCounts).reduce(
      (a, b) => (typeCounts[a] > typeCounts[b] ? a : b),
      '',
    );

    return {
      totalOpportunities,
      activeOpportunities,
      totalApplications,
      expiredOpportunities,
      averageApplications,
      internationalOpportunities,
      totalBudget,
      mostPopularType,
    };
  });

  ngOnInit(): void {
    this.loadOpportunities();
  }

  private loadOpportunities(): void {
    this.loading.set(true);

    // Mock data - replace with actual service call
    setTimeout(() => {
      const mockOpportunities: AdminOpportunity[] = [
        {
          id: 1,
          title: 'Beca de Excelencia Académica 2024',
          description:
            'Programa de becas para estudiantes destacados con apoyo económico completo para estudios de posgrado.',
          type: 'scholarship',
          university: { id: 1, name: 'Universidad de Tijuana' },
          requirements: ['Promedio mínimo 9.0', 'Carta de motivación', 'Referencias académicas'],
          applicationDeadline: '2024-12-31T23:59:59Z',
          startDate: '2025-01-15T00:00:00Z',
          location: 'Tijuana, México',
          capacity: 50,
          applicationsCount: 123,
          status: 'active',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-08-01T15:30:00Z',
          tags: ['beca', 'posgrado', 'excelencia'],
          budget: 500000,
          isInternational: false,
        },
        {
          id: 2,
          title: 'Programa de Intercambio Internacional',
          description:
            'Oportunidad de estudiar un semestre en universidades europeas con apoyo completo.',
          type: 'exchange',
          university: { id: 2, name: 'Instituto Tecnológico' },
          requirements: ['Nivel B2 de inglés', 'Promedio mínimo 8.5', 'Entrevista personal'],
          applicationDeadline: '2024-11-30T23:59:59Z',
          startDate: '2025-02-01T00:00:00Z',
          location: 'Europa (Varios países)',
          capacity: 25,
          applicationsCount: 87,
          status: 'active',
          createdAt: '2024-02-01T09:00:00Z',
          updatedAt: '2024-07-15T12:00:00Z',
          tags: ['intercambio', 'internacional', 'europa'],
          budget: 1200000,
          isInternational: true,
        },
      ];

      this.opportunities.set(mockOpportunities);
      this.filteredOpportunities.set(mockOpportunities);
      this.loading.set(false);
    }, 1500);
  }

  filterOpportunities(): void {
    let filtered = this.opportunities();

    // Filter by search term
    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      filtered = filtered.filter(
        opp =>
          opp.title.toLowerCase().includes(term) || opp.description.toLowerCase().includes(term),
      );
    }

    // Filter by type
    if (this.selectedType()) {
      filtered = filtered.filter(opp => opp.type === this.selectedType());
    }

    // Filter by status
    if (this.selectedStatus()) {
      filtered = filtered.filter(opp => opp.status === this.selectedStatus());
    }

    // Filter by international
    if (this.selectedInternational()) {
      const isInternational = this.selectedInternational() === 'true';
      filtered = filtered.filter(opp => opp.isInternational === isInternational);
    }

    this.filteredOpportunities.set(filtered);
    this.currentPage.set(1); // Reset to first page when filtering
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  deleteOpportunity(opportunity: AdminOpportunity): void {
    if (confirm(`¿Estás seguro de que deseas eliminar la oportunidad "${opportunity.title}"?`)) {
      const updated = this.opportunities().filter(o => o.id !== opportunity.id);
      this.opportunities.set(updated);
      this.filterOpportunities();
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return `hace ${diffInMinutes} minutos`;
    } else if (diffInHours < 24) {
      return `hace ${diffInHours} horas`;
    } else {
      return `hace ${diffInDays} días`;
    }
  }

  getTotalBudgetInK(): string {
    return (this.opportunityStats().totalBudget / 1000).toFixed(0);
  }

  formatBudget(budget: number): string {
    return budget.toLocaleString();
  }

  // Expose Math to template
  Math = Math;
}
