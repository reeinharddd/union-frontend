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
import { OpportunityService } from '@app/core/services/opportunity/opportunity.service';
import { OpportunityTypeService } from '@app/core/services/opportunity/opportunityType.service';
import { ToastService } from '@app/core/services/ui/toast.service';
import { UniversityService } from '@app/core/services/university/university.service';
import { WorkModalityService } from '@app/core/services/workModality/workModality.service';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-nueva-oportunidad',
  templateUrl: './add-opportunities.component.html',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule],
  standalone: true,
})
export class NuevaOportunidadComponent implements OnInit {
  oportunidadForm: FormGroup;
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  modalidades: any[] = [];
  universidades: any[] = [];
  tiposOportunidad: any[] = [];

  constructor(
    private fb: FormBuilder,
    private tokenService: TokenService,
    private toastService: ToastService,
    private router: Router,
    private opportunityService: OpportunityService,
    private workModalityService: WorkModalityService,
    private universityService: UniversityService,
    private typeOpportunityService: OpportunityTypeService,
  ) {
    this.oportunidadForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(200)]],
      descripcion: ['', Validators.required],
      universidad_id: ['', Validators.required],
      fecha_limite: ['', [Validators.required, this.futureDateValidator]],
      opportunity_type_id: ['', Validators.required],
      empresa: ['', Validators.maxLength(100)],
      salario_min: [0, [Validators.min(0)]],
      salario_max: [0, [Validators.min(0)]],
      modality_id: ['', Validators.required],
      requisitos: ['', Validators.required],
      beneficios: [''],
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.isLoading = true;

    // Cargar datos en paralelo
    forkJoin([
      this.workModalityService.getAll(),
      this.universityService.getAll(),
      this.typeOpportunityService.getAll(),
    ])
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: ([modalities, universities, opportunityTypes]) => {
          this.modalidades = modalities;
          this.universidades = universities;
          this.tiposOportunidad = opportunityTypes;
        },
        error: error => {
          this.toastService.showError('Error al cargar datos iniciales');
          console.error('Error loading initial data:', error);
        },
      });
  }

  futureDateValidator(control: any) {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today ? null : { pastDate: true };
  }

  onSubmit(): void {
    if (this.oportunidadForm.invalid || this.isSubmitting) return;

    this.isSubmitting = true;
    const formValue = this.oportunidadForm.value;
    const formData = {
      ...formValue,
      universidad_id: +formValue.universidad_id, // convierte a número
      opportunity_type_id: +formValue.opportunity_type_id,
      modality_id: +formValue.modality_id, // convierte a número
      created_by: this.tokenService.getUserId(),
    };

    // Agrega este console.log para ver los datos que se enviarán
    console.log('Datos a enviar al servidor:', JSON.stringify(formData, null, 2));

    this.opportunityService
      .create(formData)
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.toastService.showSuccess('Oportunidad creada exitosamente');
          this.router.navigate(['/promoter/dashboard']);
        },
        error: error => {
          // Agrega este console.log para ver el error completo
          console.error('Error completo del servidor:', error);
          if (error.error?.details) {
            console.error('Errores de validación:', error.error.details);
          }
          this.toastService.showError('Error al crear la oportunidad');
        },
      });
  }
}
