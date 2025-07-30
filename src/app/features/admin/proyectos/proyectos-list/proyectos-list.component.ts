import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
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

  editarProyecto(proyecto: any) {
    this.router.navigate([`/admin/proyectos/${proyecto.id}/edit`]);
  }

  eliminarProyecto(proyecto: any) {
    if (confirm('¿Seguro que deseas eliminar este proyecto?')) {
      this.proyectosService.delete(proyecto.id).subscribe({
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
}
