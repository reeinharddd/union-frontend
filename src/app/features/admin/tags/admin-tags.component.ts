import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

interface Tag {
  id: number;
  nombre: string;
  descripcion: string;
  color: string;
  categoria: 'tecnologia' | 'academico' | 'proyecto' | 'general';
  usageCount: number;
  createdBy: {
    id: number;
    nombre: string;
  };
  fechaCreacion: string;
  activo: boolean;
}

interface TagCategory {
  id: string;
  nombre: string;
  descripcion: string;
  color: string;
}

@Component({
  selector: 'app-admin-tags',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6 p-6">
      <!-- Header -->
      <div
        class="from-emerald-600 to-teal-600 rounded-xl bg-gradient-to-r p-6 text-white shadow-lg"
      >
        <h1 class="mb-2 text-3xl font-bold">Gestión de Etiquetas</h1>
        <p class="text-emerald-100">
          Administra las etiquetas utilizadas para categorizar contenido en la plataforma
        </p>
      </div>

      <!-- Estadísticas -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-lg bg-white p-6 shadow-lg">
          <div class="flex items-center">
            <div class="bg-emerald-100 text-emerald-600 rounded-full p-3">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                ></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ getTotalTags() }}</h3>
              <p class="text-gray-600">Total Etiquetas</p>
            </div>
          </div>
        </div>

        <div class="rounded-lg bg-white p-6 shadow-lg">
          <div class="flex items-center">
            <div class="rounded-full bg-blue-100 p-3 text-blue-600">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ getActiveTags() }}</h3>
              <p class="text-gray-600">Etiquetas Activas</p>
            </div>
          </div>
        </div>

        <div class="rounded-lg bg-white p-6 shadow-lg">
          <div class="flex items-center">
            <div class="rounded-full bg-purple-100 p-3 text-purple-600">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                ></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ getTechTags() }}</h3>
              <p class="text-gray-600">Tecnología</p>
            </div>
          </div>
        </div>

        <div class="rounded-lg bg-white p-6 shadow-lg">
          <div class="flex items-center">
            <div class="rounded-full bg-yellow-100 p-3 text-yellow-600">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                ></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ getTotalUsage() }}</h3>
              <p class="text-gray-600">Usos Totales</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Categorías de Etiquetas -->
      <div class="rounded-xl bg-white p-6 shadow-lg">
        <h2 class="mb-4 text-xl font-bold text-gray-900">Categorías de Etiquetas</h2>
        <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div
            *ngFor="let category of tagCategories"
            class="cursor-pointer rounded-lg border-2 p-4 transition-all"
            [class]="
              selectedCategory === category.id
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-gray-200 hover:border-gray-300'
            "
            (click)="selectCategory(category.id)"
          >
            <div class="mb-2 flex items-center">
              <div
                class="mr-3 h-4 w-4 rounded-full"
                [style.background-color]="category.color"
              ></div>
              <h3 class="font-semibold text-gray-900">{{ category.nombre }}</h3>
            </div>
            <p class="text-sm text-gray-600">{{ category.descripcion }}</p>
            <div class="mt-2 text-xs text-gray-500">
              {{ getTagsByCategory(category.id).length }} etiquetas
            </div>
          </div>
        </div>
      </div>

      <!-- Gestión de Etiquetas -->
      <div class="rounded-xl bg-white p-6 shadow-lg">
        <div
          class="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"
        >
          <div class="flex flex-1 flex-col gap-4 sm:flex-row">
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (input)="filterTags()"
              placeholder="Buscar etiquetas..."
              class="focus:ring-emerald-500 flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2"
            />

            <select
              [(ngModel)]="selectedCategoryFilter"
              (change)="filterTags()"
              class="focus:ring-emerald-500 rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2"
            >
              <option value="">Todas las categorías</option>
              <option value="tecnologia">Tecnología</option>
              <option value="academico">Académico</option>
              <option value="proyecto">Proyecto</option>
              <option value="general">General</option>
            </select>

            <select
              [(ngModel)]="selectedStatusFilter"
              (change)="filterTags()"
              class="focus:ring-emerald-500 rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2"
            >
              <option value="">Todos los estados</option>
              <option value="active">Activas</option>
              <option value="inactive">Inactivas</option>
            </select>
          </div>

          <div class="flex gap-2">
            <button
              (click)="showCreateTagModal = true"
              class="bg-emerald-600 hover:bg-emerald-700 rounded-lg px-4 py-2 font-medium text-white transition-colors"
            >
              <svg
                class="mr-2 inline h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
              Nueva Etiqueta
            </button>
            <button
              (click)="exportTags()"
              class="rounded-lg bg-gray-600 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-700"
            >
              <svg
                class="mr-2 inline h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              Exportar
            </button>
          </div>
        </div>

        <!-- Lista de Etiquetas -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div
            *ngFor="let tag of filteredTags()"
            class="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
          >
            <div class="mb-3 flex items-start justify-between">
              <div class="flex items-center">
                <div class="mr-2 h-3 w-3 rounded-full" [style.background-color]="tag.color"></div>
                <h3 class="font-semibold text-gray-900">{{ tag.nombre }}</h3>
              </div>
              <div class="flex space-x-1">
                <button (click)="editTag(tag)" class="p-1 text-blue-600 hover:text-blue-900">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    ></path>
                  </svg>
                </button>
                <button (click)="deleteTag(tag.id)" class="p-1 text-red-600 hover:text-red-900">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>

            <p class="mb-3 text-sm text-gray-600">{{ tag.descripcion }}</p>

            <div class="flex items-center justify-between">
              <span
                class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium"
                [ngClass]="{
                  'bg-blue-100 text-blue-800': tag.categoria === 'tecnologia',
                  'bg-green-100 text-green-800': tag.categoria === 'academico',
                  'bg-purple-100 text-purple-800': tag.categoria === 'proyecto',
                  'bg-gray-100 text-gray-800': tag.categoria === 'general',
                }"
              >
                {{ tag.categoria | titlecase }}
              </span>
              <div class="text-xs text-gray-500">{{ tag.usageCount }} usos</div>
            </div>

            <div class="mt-3 flex items-center justify-between">
              <div class="text-xs text-gray-500">Por {{ tag.createdBy.nombre }}</div>
              <label class="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  [checked]="tag.activo"
                  (change)="toggleTagStatus(tag)"
                  class="peer sr-only"
                />
                <div
                  class="peer-focus:ring-emerald-300 peer-checked:bg-emerald-600 peer h-5 w-9 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4"
                ></div>
              </label>
            </div>
          </div>
        </div>

        <!-- Paginación -->
        <div class="mt-6 flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Mostrando {{ (currentPage - 1) * pageSize + 1 }} a
            {{ Math.min(currentPage * pageSize, getTotalTags()) }} de
            {{ getTotalTags() }} resultados
          </div>
          <div class="flex space-x-2">
            <button
              (click)="previousPage()"
              [disabled]="currentPage === 1"
              class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              (click)="nextPage()"
              [disabled]="currentPage >= totalPages"
              class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      <!-- Modal para crear/editar etiqueta -->
      <div *ngIf="showCreateTagModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div
          class="flex min-h-screen items-center justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0"
        >
          <div class="fixed inset-0 transition-opacity" (click)="showCreateTagModal = false">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <div
            class="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
          >
            <form [formGroup]="tagForm" (ngSubmit)="saveTag()">
              <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <h3 class="mb-4 text-lg font-medium leading-6 text-gray-900">
                  {{ editingTag ? 'Editar Etiqueta' : 'Nueva Etiqueta' }}
                </h3>

                <div class="space-y-4">
                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                      type="text"
                      formControlName="nombre"
                      class="focus:ring-emerald-500 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2"
                    />
                  </div>

                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700">Descripción</label>
                    <textarea
                      formControlName="descripcion"
                      rows="3"
                      class="focus:ring-emerald-500 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2"
                    ></textarea>
                  </div>

                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700">Categoría</label>
                    <select
                      formControlName="categoria"
                      class="focus:ring-emerald-500 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2"
                    >
                      <option value="tecnologia">Tecnología</option>
                      <option value="academico">Académico</option>
                      <option value="proyecto">Proyecto</option>
                      <option value="general">General</option>
                    </select>
                  </div>

                  <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700">Color</label>
                    <input
                      type="color"
                      formControlName="color"
                      class="focus:ring-emerald-500 h-10 w-full rounded-lg border border-gray-300 focus:ring-2"
                    />
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="submit"
                  [disabled]="tagForm.invalid"
                  class="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {{ editingTag ? 'Actualizar' : 'Crear' }}
                </button>
                <button
                  type="button"
                  (click)="cancelEdit()"
                  class="focus:ring-emerald-500 mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminTagsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // Datos mock de etiquetas
  tags = signal<Tag[]>([
    {
      id: 1,
      nombre: 'Angular',
      descripcion: 'Framework de desarrollo web de Google',
      color: '#DD0031',
      categoria: 'tecnologia',
      usageCount: 25,
      createdBy: { id: 1, nombre: 'Admin' },
      fechaCreacion: '2024-01-15T10:00:00Z',
      activo: true,
    },
    {
      id: 2,
      nombre: 'Machine Learning',
      descripcion: 'Proyectos relacionados con aprendizaje automático',
      color: '#4CAF50',
      categoria: 'academico',
      usageCount: 18,
      createdBy: { id: 1, nombre: 'Admin' },
      fechaCreacion: '2024-01-10T08:00:00Z',
      activo: true,
    },
    {
      id: 3,
      nombre: 'Colaborativo',
      descripcion: 'Proyectos que requieren trabajo en equipo',
      color: '#FF9800',
      categoria: 'proyecto',
      usageCount: 32,
      createdBy: { id: 1, nombre: 'Admin' },
      fechaCreacion: '2024-01-05T15:30:00Z',
      activo: true,
    },
    {
      id: 4,
      nombre: 'Innovación',
      descripcion: 'Proyectos innovadores y creativos',
      color: '#9C27B0',
      categoria: 'general',
      usageCount: 12,
      createdBy: { id: 1, nombre: 'Admin' },
      fechaCreacion: '2024-01-20T12:00:00Z',
      activo: false,
    },
  ]);

  filteredTags = signal<Tag[]>([]);

  // Formulario para crear/editar etiquetas
  tagForm: FormGroup;
  editingTag: Tag | null = null;
  showCreateTagModal = false;

  // Filtros
  searchTerm = '';
  selectedCategory = '';
  selectedCategoryFilter = '';
  selectedStatusFilter = '';

  // Paginación
  currentPage = 1;
  pageSize = 12;
  totalPages = 1;

  Math = Math;

  // Categorías de etiquetas
  tagCategories: TagCategory[] = [
    {
      id: 'tecnologia',
      nombre: 'Tecnología',
      descripcion: 'Lenguajes, frameworks y herramientas',
      color: '#3B82F6',
    },
    {
      id: 'academico',
      nombre: 'Académico',
      descripcion: 'Materias y áreas de estudio',
      color: '#10B981',
    },
    {
      id: 'proyecto',
      nombre: 'Proyecto',
      descripcion: 'Tipos y características de proyectos',
      color: '#8B5CF6',
    },
    {
      id: 'general',
      nombre: 'General',
      descripcion: 'Etiquetas de uso general',
      color: '#6B7280',
    },
  ];

  constructor() {
    this.tagForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      categoria: ['tecnologia', Validators.required],
      color: ['#3B82F6', Validators.required],
    });
  }

  ngOnInit() {
    this.filteredTags.set(this.tags());
    this.calculatePagination();
  }

  selectCategory(categoryId: string) {
    this.selectedCategory = this.selectedCategory === categoryId ? '' : categoryId;
    this.selectedCategoryFilter = this.selectedCategory;
    this.filterTags();
  }

  filterTags() {
    let filtered = this.tags();

    if (this.searchTerm) {
      filtered = filtered.filter(
        tag =>
          tag.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          tag.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase()),
      );
    }

    if (this.selectedCategoryFilter) {
      filtered = filtered.filter(tag => tag.categoria === this.selectedCategoryFilter);
    }

    if (this.selectedStatusFilter) {
      if (this.selectedStatusFilter === 'active') {
        filtered = filtered.filter(tag => tag.activo);
      } else if (this.selectedStatusFilter === 'inactive') {
        filtered = filtered.filter(tag => !tag.activo);
      }
    }

    this.filteredTags.set(filtered);
    this.currentPage = 1;
    this.calculatePagination();
  }

  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredTags().length / this.pageSize);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  getTotalTags(): number {
    return this.tags().length;
  }

  getActiveTags(): number {
    return this.tags().filter(tag => tag.activo).length;
  }

  getTechTags(): number {
    return this.tags().filter(tag => tag.categoria === 'tecnologia').length;
  }

  getTotalUsage(): number {
    return this.tags().reduce((total, tag) => total + tag.usageCount, 0);
  }

  getTagsByCategory(categoryId: string): Tag[] {
    return this.tags().filter(tag => tag.categoria === categoryId);
  }

  editTag(tag: Tag) {
    this.editingTag = tag;
    this.tagForm.patchValue({
      nombre: tag.nombre,
      descripcion: tag.descripcion,
      categoria: tag.categoria,
      color: tag.color,
    });
    this.showCreateTagModal = true;
  }

  saveTag() {
    if (this.tagForm.valid) {
      const formValue = this.tagForm.value;

      if (this.editingTag) {
        // Actualizar etiqueta existente
        const updatedTags = this.tags().map(tag =>
          tag.id === this.editingTag!.id ? { ...tag, ...formValue } : tag,
        );
        this.tags.set(updatedTags);
      } else {
        // Crear nueva etiqueta
        const newTag: Tag = {
          id: Math.max(...this.tags().map(t => t.id)) + 1,
          ...formValue,
          usageCount: 0,
          createdBy: { id: 1, nombre: 'Admin' },
          fechaCreacion: new Date().toISOString(),
          activo: true,
        };
        this.tags.set([...this.tags(), newTag]);
      }

      this.cancelEdit();
      this.filterTags();
    }
  }

  cancelEdit() {
    this.editingTag = null;
    this.showCreateTagModal = false;
    this.tagForm.reset({
      categoria: 'tecnologia',
      color: '#3B82F6',
    });
  }

  toggleTagStatus(tag: Tag) {
    tag.activo = !tag.activo;
    console.log('Cambiar estado de etiqueta:', tag);
    // Aquí harías una llamada a la API para actualizar el estado
  }

  deleteTag(tagId: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta etiqueta?')) {
      const updatedTags = this.tags().filter(tag => tag.id !== tagId);
      this.tags.set(updatedTags);
      this.filterTags();
      console.log('Etiqueta eliminada:', tagId);
    }
  }

  exportTags() {
    console.log('Exportar etiquetas');
    // Aquí implementarías la lógica de exportación
  }
}
