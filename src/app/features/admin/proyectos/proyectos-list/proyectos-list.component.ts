import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../../../../core/models/project/project.interface';
import { ProyectosService } from '../proyectos.service';

@Component({
  selector: 'app-proyectos-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './proyectos-list.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProyectosListComponent {
  private proyectosService = inject(ProyectosService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  proyectos$ = this.proyectosService.getAll();

  crearProyecto() {
    this.router.navigate(['/admin/proyectos/new']);
  }

  editarProyecto(proyecto: Project) {
    this.router.navigate([`/admin/proyectos/${proyecto.id}/edit`]);
  }

  eliminarProyecto(proyecto: Project) {
    if (confirm('¿Seguro que deseas eliminar este proyecto?')) {
      this.proyectosService.delete(proyecto.id.toString()).subscribe({
        next: () => {
          this.proyectos$ = this.proyectosService.getAll();
          this.cdr.markForCheck();
        },
        error: () => {
          alert('Error al eliminar el proyecto');
        },
      });
    }
  }

  getVerifiedProjects(proyectos: Project[]): number {
    if (!proyectos) return 0;
    return proyectos.filter(p => p.estado_verificacion === 'aprobado').length;
  }

  getPendingProjects(proyectos: Project[]): number {
    if (!proyectos) return 0;
    return proyectos.filter(p => p.estado_verificacion === 'pendiente').length;
  }

  getActiveProjects(proyectos: Project[]): number {
    if (!proyectos) return 0;
    return proyectos.filter(p => p.estado_verificacion !== 'rechazado').length;
  }

  getStatusClasses(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'aprobado':
        return 'bg-green-100 text-green-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'rechazado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  }

  trackByProject(_index: number, proyecto: Project): number {
    return proyecto.id;
  }

  openRepository(url: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }
}
