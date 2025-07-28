import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiClientService } from '@app/core/services/base/api-client.service';

@Component({
  selector: 'app-forum-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './forum-list.component.html',
  styles: ``,
})
export class StudentForumListComponent {
  private apiClient = inject(ApiClientService);
  private cdr = inject(ChangeDetectorRef);
  foros: any[] = [];
  tags: any[] = [];

  // Formulario para crear foro
  nuevoForo = {
    nombre: '',
    descripcion: '',
  };
  creando = false;
  errorCrear = '';

  ngOnInit() {
    this.cargarForos();
  }

  cargarForos() {
    this.apiClient.get('/foros').subscribe({
      next: (data: any) => {
        this.foros = Array.isArray(data) ? data : [];
        this.cdr.markForCheck();
      },
      error: () => {
        this.foros = [];
        this.cdr.markForCheck();
      },
    });
  }

  crearForo() {
    if (!this.nuevoForo.nombre.trim()) {
      this.errorCrear = 'El nombre es obligatorio';
      return;
    }
    this.creando = true;
    this.errorCrear = '';
    const payload = {
      nombre: this.nuevoForo.nombre,
      descripcion: this.nuevoForo.descripcion,
    };
    this.apiClient.post('/foros', payload).subscribe({
      next: () => {
        this.nuevoForo = { nombre: '', descripcion: '' };
        this.creando = false;
        this.cargarForos();
      },
    });
  }
}
