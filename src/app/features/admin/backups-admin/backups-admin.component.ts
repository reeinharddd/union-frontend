import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BackupApiClientService } from '@app/core/services/backupAdmin/backup-api-client.service';

@Component({
  selector: 'app-backups-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './backups-admin.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackupsAdminComponent {
  resultadoRespaldo: string | null = null;
  cargando: boolean = false;

  // Estados de carga
  cargandoRespaldoCompleto = false;
  cargandoRespaldoParcial = false;
  cargandoRestaurarCompleto = false;
  cargandoRestaurarParcial = false;
  cargandoExportarCsv = false;

  // Mensajes de resultado
  resultadoRespaldoCompleto: string | null = null;
  resultadoRespaldoParcial: string | null = null;
  resultadoRestaurarCompleto: string | null = null;
  resultadoRestaurarParcial: string | null = null;
  resultadoExportarCsv: string | null = null;
  tablaRespaldoParcial: string = '';
  tablaRestaurarParcial: string = '';
  tablaExportarCsv: string = '';
  schemaExportarCsv: string = '';
  tablasDisponibles: string[] = [
    'actividad_usuario',
    'asistencias_evento',
    'bloques',
    'conversaciones',
    'eventos',
    'experiencia_usuario',
    'foros',
    'hilos',
    'mensajes',
    'oportunidades',
    'paginas_colaborativas',
    'participaciones_proyecto',
    'perfiles',
    'postulaciones',
    'proyectos',
    'proyectos_validaciones',
    'reportes',
    'respuestas_hilo',
    'roles_proyecto',
    'roles_usuario',
    'seguimientos',
    'taggables',
    'tags',
    'universidades',
    'usuarios',
    'versiones_bloques',
  ];

  constructor(private backupApi: BackupApiClientService) {}

  ejecutarRespaldoCompleto() {
    this.cargandoRespaldoCompleto = true;
    this.resultadoRespaldoCompleto = null;
    this.backupApi.ejecutarRespaldoCompleto().subscribe({
      next: res => {
        this.resultadoRespaldoCompleto = res?.message || 'Respaldo completado.';
        this.cargandoRespaldoCompleto = false;
      },
      error: err => {
        this.resultadoRespaldoCompleto = err?.error?.error || 'Error al ejecutar respaldo.';
        this.cargandoRespaldoCompleto = false;
      },
    });
  }

  ejecutarRespaldoParcial() {
    if (!this.tablaRespaldoParcial) {
      this.resultadoRespaldoParcial = 'Debes seleccionar una tabla.';
      return;
    }
    this.cargandoRespaldoParcial = true;
    this.resultadoRespaldoParcial = null;
    this.backupApi.ejecutarRespaldoParcial([this.tablaRespaldoParcial]).subscribe({
      next: res => {
        this.resultadoRespaldoParcial = res?.message || 'Respaldo parcial completado.';
        this.cargandoRespaldoParcial = false;
      },
      error: err => {
        this.resultadoRespaldoParcial = err?.error?.error || 'Error al ejecutar respaldo parcial.';
        this.cargandoRespaldoParcial = false;
      },
    });
  }

  restaurarCompleto() {
    this.cargandoRestaurarCompleto = true;
    this.resultadoRestaurarCompleto = null;
    this.backupApi.restaurarCompleto().subscribe({
      next: res => {
        this.resultadoRestaurarCompleto = res?.message || 'Restauración completa realizada.';
        this.cargandoRestaurarCompleto = false;
      },
      error: err => {
        this.resultadoRestaurarCompleto =
          err?.error?.error || 'Error al restaurar respaldo completo.';
        this.cargandoRestaurarCompleto = false;
      },
    });
  }

  restaurarParcial() {
    this.cargandoRestaurarParcial = true;
    this.resultadoRestaurarParcial = null;
    this.backupApi.restaurarParcial().subscribe({
      next: res => {
        this.resultadoRestaurarParcial = res?.message || 'Restauración parcial realizada.';
        this.cargandoRestaurarParcial = false;
      },
      error: err => {
        this.resultadoRestaurarParcial =
          err?.error?.error || 'Error al restaurar respaldo parcial.';
        this.cargandoRestaurarParcial = false;
      },
    });
  }

  exportarCsv() {
    if (!this.tablaExportarCsv) {
      this.resultadoExportarCsv = 'Debes seleccionar una tabla.';
      return;
    }
    this.cargandoExportarCsv = true;
    this.resultadoExportarCsv = null;
    const schema = this.schemaExportarCsv?.trim() || 'public';
    this.backupApi.exportarTablaCsv(this.tablaExportarCsv, schema).subscribe({
      next: blob => {
        // Descargar el archivo CSV
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.tablaExportarCsv}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.resultadoExportarCsv = 'Exportación CSV completada.';
        this.cargandoExportarCsv = false;
      },
      error: err => {
        this.resultadoExportarCsv = err?.error?.error || 'Error al exportar CSV.';
        this.cargandoExportarCsv = false;
      },
    });
  }
}
