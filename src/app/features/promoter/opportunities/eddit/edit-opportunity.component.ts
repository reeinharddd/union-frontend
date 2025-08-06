import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TokenService } from '@app/core/services/auth/token.service';
import { OpportunityService } from '@app/core/services/opportunity/opportunity.service';
import { OpportunityTypeService } from '@app/core/services/opportunity/opportunityType.service';
import { UniversityService } from '@app/core/services/university/university.service';
import { WorkModalityService } from '@app/core/services/workModality/workModality.service';

@Component({
  selector: 'app-editar-oportunidad',
  templateUrl: './edit-opportunity.component.html',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  standalone: true,
})
export class EditarOportunidadComponent implements OnInit {
  oportunidadForm!: FormGroup;
  isSubmitting = false;
  oportunidadId!: number;
  universidades: any[] = [];
  modalidades: any[] = [];
  tiposOportunidad: any[] = [];

  postulacionesPorOportunidad: { [key: number]: any[] } = {};

  universidadesMap: { [key: number]: string } = {};
  modalidadesMap: { [key: number]: string } = {};
  tiposOportunidadMap: { [key: number]: string } = {};

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private opportunityService: OpportunityService,
    private universityService: UniversityService,
    private workModalityService: WorkModalityService,
    private typeOpportunityService: OpportunityTypeService,
    private tokenService: TokenService,
  ) {}

  ngOnInit(): void {
    this.oportunidadId = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);

    this.oportunidadForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(200)]],
      descripcion: ['', Validators.required],
      universidad_id: ['', Validators.required],
      opportunity_type_id: ['', Validators.required],
      fecha_limite: ['', Validators.required],
      modality_id: ['', Validators.required],
      empresa: [''],
      salario_min: [0],
      salario_max: [0],
      requisitos: ['', Validators.required],
      beneficios: [''],
      //created_by: [this.tokenService.getUserId() || null],
    });

    this.loadOpportunity();
    this.loadUniversity();
    this.loadModality();
    this.loadTypeOpportunity();
  }

  loadOpportunity(): void {
    this.opportunityService.getById(this.oportunidadId).subscribe(data => {
      this.oportunidadForm.patchValue({
        ...data,
      });
    });
  }

  loadUniversity() {
    this.universityService.getAll().subscribe(data => {
      this.universidades = data;
      this.universidadesMap = {};
      data.forEach((uni: any) => {
        this.universidadesMap[uni.id] = uni.nombre;
      });
    });
  }

  loadModality() {
    this.workModalityService.getAll().subscribe(data => {
      this.modalidades = data;
      this.modalidadesMap = {};
      data.forEach((mod: any) => {
        this.modalidadesMap[mod.id] = mod.name;
      });
    });
  }

  loadTypeOpportunity() {
    this.typeOpportunityService.getAll().subscribe(data => {
      this.tiposOportunidad = data;
      this.tiposOportunidadMap = {};
      data.forEach((tipo: any) => {
        this.tiposOportunidadMap[tipo.id] = tipo.name;
      });
    });
  }

  onSubmit(): void {
    if (this.oportunidadForm.invalid) return;

    this.isSubmitting = true;

    // Obtener el usuario actual desde tokenService (depende de cómo tengas implementado tokenService)
    const currentUser = this.tokenService.getUserId(); // o getUserId(), como tengas implementado
    // Asegúrate que currentUser tenga el id o info necesaria

    const data = {
      ...this.oportunidadForm.value,
      created_by: currentUser || null, // o currentUser directamente si es el id
    };

    this.opportunityService.update(this.oportunidadId, data).subscribe({
      next: () => this.router.navigate(['/promoter/opportunities']),

      error: err => {
        console.error('Error al actualizar la oportunidad:', err.error?.details || err);
        this.isSubmitting = false;
      },
      complete: () => (this.isSubmitting = false),
    });
  }
}
