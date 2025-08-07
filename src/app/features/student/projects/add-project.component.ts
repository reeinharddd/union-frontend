import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TokenService } from '@app/core/services/auth/token.service';
import { ProjectService } from '@app/core/services/project/project.service';
import { ToastService } from '@app/core/services/ui/toast.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-add-proyecto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule],
  templateUrl: './add-project.component.html',
})
export class AddProyectoComponent implements OnInit {
  proyectoForm: FormGroup;
  creador_id: number | null = null;
  universidad_id: number | null = null;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private projectService: ProjectService,
    private toastService: ToastService,
    private tokenService: TokenService,
  ) {
    this.proyectoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.maxLength(200)]],
      descripcion: ['', Validators.required],
      estado_verificacion: ['pendiente'],
      vista_publica: [false],
    });
  }

  ngOnInit() {
    this.obtenerDatosUsuario();
  }

  obtenerDatosUsuario() {
    try {
      // Obtener ID de usuario desde TokenService
      this.creador_id = this.tokenService.getUserId();

      // Obtener universidad_id desde los claims del token
      const userData = this.tokenService.getUserData();
      this.universidad_id = userData?.universidad_id || null;

      if (!this.creador_id || !this.universidad_id) {
        this.toastService.showError('Error');
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Error al obtener datos de usuario:', error);
      this.toastService.showError('Error');
      this.router.navigate(['/login']);
    }
  }

  onSubmit() {
    if (this.proyectoForm.invalid || !this.creador_id || !this.universidad_id) {
      this.proyectoForm.markAllAsTouched();

      if (!this.creador_id || !this.universidad_id) {
        this.toastService.showError('Error de autenticación');
        this.router.navigate(['/login']);
      }
      return;
    }

    this.isLoading = true;

    const proyectoData = {
      ...this.proyectoForm.value,
      creador_id: this.creador_id,
      universidad_id: this.universidad_id,
    };

    this.projectService
      .create(proyectoData)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: _newProject => {
          this.toastService.showSuccess('Éxito');
          this.router.navigate(['/student/dashboard']);
        },
        error: err => {
          console.error('Error al crear proyecto:', err);
          let errorMessage = 'No se pudo crear el proyecto';

          if (err.error?.message) {
            errorMessage += `: ${err.error.message}`;
          } else if (err.status === 401) {
            errorMessage = 'Su sesión ha expirado. Por favor inicie sesión nuevamente';
            this.router.navigate(['/login']);
          }

          this.toastService.showError('Error');
        },
      });
  }

  goToAddProject() {
    this.router.navigate(['/student/Addprojects']);
  }
}
