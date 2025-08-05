import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { University } from '@app/core/models/university/university.interface';
import { UniversityService } from '@app/core/services/university/university.service';

@Component({
  selector: 'app-universities-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './universities-list.component.html',
  styleUrls: ['./universities-list.component.css'],
})
export class UniversitiesListComponent implements OnInit {
  private universityService = inject(UniversityService);
  private router = inject(Router);

  universities = signal<University[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadUniversities();
  }

  private loadUniversities(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.universityService.getAll().subscribe({
      next: universities => {
        this.universities.set(universities);
        this.isLoading.set(false);
      },
      error: error => {
        console.error('Error loading universities:', error);
        this.error.set('Error al cargar las universidades');
        this.isLoading.set(false);
      },
    });
  }

  onRefresh(): void {
    this.loadUniversities();
  }

  onAddUniversity(): void {
    this.router.navigate(['/admin/universities/add']);
  }

  onEditUniversity(university: University): void {
    this.router.navigate(['/admin/universities/edit', university.id]);
  }

  onViewUniversity(university: University): void {
    this.router.navigate(['/admin/universities/view', university.id]);
  }

  onDeleteUniversity(university: University): void {
    if (confirm(`¿Estás seguro de que quieres eliminar la universidad ${university.nombre}?`)) {
      this.universityService.delete(university.id).subscribe({
        next: () => {
          this.loadUniversities();
        },
        error: error => {
          console.error('Error deleting university:', error);
          alert('Error al eliminar la universidad');
        },
      });
    }
  }

  onExport(): void {
    console.log('Exportar universidades');
  }

  getStudentCount(university: University): number {
    return university.estudiantes_count || 0;
  }

  trackByUniversityId(_index: number, university: University): number {
    return university.id;
  }

  formatDate(date: string | Date): string {
    if (!date) return 'N/A';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('es-ES');
  }
}
