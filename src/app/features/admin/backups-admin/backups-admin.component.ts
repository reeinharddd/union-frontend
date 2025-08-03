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

  selectedTable = '';
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
  //schemaExportarCsv: string = '';
  tablasDisponibles: string[] = [
    'actividad_usuario', 'asistencias_evento', 'bloques', 'collaborative_page_permissions',
    'content_types', 'conversaciones', 'event_types', 'eventos', 'experience_types',
    'experiencia_usuario', 'foros', 'hilos', 'mensajes', 'ofertas_laborales', 'oportunidades',
    'opportunity_types', 'paginas_colaborativas', 'participaciones_proyecto', 'perfiles',
    'permission_types', 'postulaciones', 'postulaciones_laborales', 'project_technologies',
    'proyectos', 'proyectos_validaciones', 'relaciones_bloques', 'report_evidences', 'reportes',
    'respuestas_hilo', 'roles_proyecto', 'roles_usuario', 'seguimientos', 'system_states',
    'taggables', 'tags', 'tokens_iniciales_acceso', 'universidades', 'user_skills',
    'usuarios', 'validation_documents', 'versiones_bloques', 'work_modalities'
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
    this.resultadoExportarCsv = '❌ Debes seleccionar una tabla.';
    return;
  }

  this.cargandoExportarCsv = true;
  this.resultadoExportarCsv = null;

  this.backupApi.exportarTablaCsv(this.tablaExportarCsv).subscribe({
    next: blob => {
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `${this.tablaExportarCsv}.csv`;
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      this.resultadoExportarCsv = `✅ Exportación de ${this.tablaExportarCsv}.csv completada.`;
      this.cargandoExportarCsv = false;
    },
    error: err => {
      this.resultadoExportarCsv = `❌ Error al exportar CSV: ${err?.error?.error || 'Error desconocido.'}`;
      this.cargandoExportarCsv = false;
    }
  });
}

}
