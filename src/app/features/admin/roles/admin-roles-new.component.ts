import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: 'users' | 'universities' | 'events' | 'projects' | 'system' | 'reports';
}

interface Role {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: 'sistema' | 'personalizado';
  permissions: string[];
  usuariosCount: number;
  fechaCreacion: string;
  activo: boolean;
  color: string;
}

@Component({
  selector: 'app-admin-roles',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="p-6 space-y-6">
      <!-- Header -->
      <div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-xl shadow-lg">
        <h1 class="text-3xl font-bold mb-2">Gestión de Roles y Permisos</h1>
        <p class="text-indigo-100">Administra los roles del sistema y sus permisos asociados</p>
      </div>

      <!-- Estadísticas -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="bg-white rounded-lg shadow-lg p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ getTotalRoles() }}</h3>
              <p class="text-gray-600">Total Roles</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-lg p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ getActiveRoles() }}</h3>
              <p class="text-gray-600">Roles Activos</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-lg p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ getTotalPermissions() }}</h3>
              <p class="text-gray-600">Permisos</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-lg p-6">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-semibold text-gray-900">{{ getTotalUsers() }}</h3>
              <p class="text-gray-600">Usuarios Asignados</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de Roles -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold text-gray-900">Roles del Sistema</h2>
          <button
            (click)="showCreateRoleModal = true"
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            <svg class="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Nuevo Rol
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div *ngFor="let role of roles()"
               class="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center">
                <div class="w-12 h-12 rounded-lg flex items-center justify-center"
                     [style.background-color]="role.color + '20'"
                     [style.color]="role.color">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <h3 class="font-semibold text-gray-900">{{ role.nombre }}</h3>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        [ngClass]="{
                          'bg-blue-100 text-blue-800': role.tipo === 'sistema',
                          'bg-green-100 text-green-800': role.tipo === 'personalizado'
                        }">
                    {{ role.tipo | titlecase }}
                  </span>
                </div>
              </div>
            </div>

            <p class="text-sm text-gray-600 mb-4">{{ role.descripcion }}</p>

            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Usuarios asignados:</span>
                <span class="text-sm font-medium text-gray-900">{{ role.usuariosCount }}</span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Permisos:</span>
                <span class="text-sm font-medium text-gray-900">{{ role.permissions.length }}</span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">Estado:</span>
                <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                      [ngClass]="{
                        'bg-green-100 text-green-800': role.activo,
                        'bg-red-100 text-red-800': !role.activo
                      }">
                  {{ role.activo ? 'Activo' : 'Inactivo' }}
                </span>
              </div>
            </div>

            <div class="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
              <button
                (click)="editRole(role)"
                [disabled]="role.tipo === 'sistema'"
                class="flex-1 text-center text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                Editar
              </button>
              <button
                (click)="viewRolePermissions(role)"
                class="flex-1 text-center text-sm font-medium text-indigo-600 hover:text-indigo-700">
                Ver Permisos
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal para crear/editar rol -->
      <div *ngIf="showCreateRoleModal" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 transition-opacity" (click)="showCreateRoleModal = false">
            <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>

          <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
            <form [formGroup]="roleForm" (ngSubmit)="saveRole()">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {{ editingRole ? 'Editar Rol' : 'Nuevo Rol' }}
                </h3>

                <div class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                      <input
                        type="text"
                        formControlName="nombre"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Color</label>
                      <input
                        type="color"
                        formControlName="color"
                        class="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                    <textarea
                      formControlName="descripcion"
                      rows="3"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"></textarea>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Permisos</label>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
                      <div *ngFor="let category of getPermissionsByCategory()" class="space-y-2">
                        <h4 class="font-medium text-gray-900 capitalize">{{ category.category }}</h4>
                        <div *ngFor="let permission of category.permissions" class="flex items-center">
                          <input
                            type="checkbox"
                            [id]="permission.id"
                            [value]="permission.id"
                            (change)="onPermissionChange($event)"
                            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                          <label [for]="permission.id" class="ml-2 block text-sm text-gray-700">
                            {{ permission.name }}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  [disabled]="roleForm.invalid"
                  class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                  {{ editingRole ? 'Actualizar' : 'Crear' }}
                </button>
                <button
                  type="button"
                  (click)="cancelEdit()"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminRolesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // Permisos disponibles
  allPermissions: Permission[] = [
    // Usuarios
    { id: 'users.view', name: 'Ver usuarios', description: 'Ver lista de usuarios', category: 'users' },
    { id: 'users.create', name: 'Crear usuarios', description: 'Crear nuevos usuarios', category: 'users' },
    { id: 'users.edit', name: 'Editar usuarios', description: 'Modificar usuarios existentes', category: 'users' },
    { id: 'users.delete', name: 'Eliminar usuarios', description: 'Eliminar usuarios', category: 'users' },

    // Universidades
    { id: 'universities.view', name: 'Ver universidades', description: 'Ver lista de universidades', category: 'universities' },
    { id: 'universities.create', name: 'Crear universidades', description: 'Crear nuevas universidades', category: 'universities' },
    { id: 'universities.edit', name: 'Editar universidades', description: 'Modificar universidades', category: 'universities' },

    // Eventos
    { id: 'events.view', name: 'Ver eventos', description: 'Ver lista de eventos', category: 'events' },
    { id: 'events.create', name: 'Crear eventos', description: 'Crear nuevos eventos', category: 'events' },
    { id: 'events.edit', name: 'Editar eventos', description: 'Modificar eventos', category: 'events' },

    // Proyectos
    { id: 'projects.view', name: 'Ver proyectos', description: 'Ver lista de proyectos', category: 'projects' },
    { id: 'projects.moderate', name: 'Moderar proyectos', description: 'Aprobar/rechazar proyectos', category: 'projects' },

    // Reportes
    { id: 'reports.view', name: 'Ver reportes', description: 'Acceder a reportes del sistema', category: 'reports' },
    { id: 'reports.export', name: 'Exportar reportes', description: 'Exportar datos de reportes', category: 'reports' },

    // Sistema
    { id: 'system.settings', name: 'Configuración', description: 'Modificar configuración del sistema', category: 'system' },
    { id: 'system.roles', name: 'Gestionar roles', description: 'Crear y modificar roles', category: 'system' },
    { id: 'system.backup', name: 'Respaldos', description: 'Gestionar respaldos del sistema', category: 'system' }
  ];

  // Roles del sistema
  roles = signal<Role[]>([
    {
      id: 1,
      nombre: 'Administrador',
      descripcion: 'Acceso completo al sistema con todos los permisos',
      tipo: 'sistema',
      permissions: this.allPermissions.map(p => p.id),
      usuariosCount: 2,
      fechaCreacion: '2024-01-01T00:00:00Z',
      activo: true,
      color: '#DC2626'
    },
    {
      id: 2,
      nombre: 'Estudiante',
      descripcion: 'Usuario estudiante con permisos básicos',
      tipo: 'sistema',
      permissions: ['projects.view', 'events.view'],
      usuariosCount: 150,
      fechaCreacion: '2024-01-01T00:00:00Z',
      activo: true,
      color: '#059669'
    },
    {
      id: 3,
      nombre: 'Graduado',
      descripcion: 'Usuario graduado con permisos extendidos',
      tipo: 'sistema',
      permissions: ['projects.view', 'events.view', 'projects.moderate'],
      usuariosCount: 75,
      fechaCreacion: '2024-01-01T00:00:00Z',
      activo: true,
      color: '#7C3AED'
    },
    {
      id: 4,
      nombre: 'Moderador',
      descripcion: 'Moderador de contenido con permisos de moderación',
      tipo: 'personalizado',
      permissions: ['users.view', 'projects.view', 'projects.moderate', 'events.view'],
      usuariosCount: 5,
      fechaCreacion: '2024-01-15T10:00:00Z',
      activo: true,
      color: '#EA580C'
    }
  ]);

  // Formulario para crear/editar roles
  roleForm: FormGroup;
  editingRole: Role | null = null;
  showCreateRoleModal = false;
  selectedPermissions: string[] = [];

  constructor() {
    this.roleForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      color: ['#3B82F6', Validators.required]
    });
  }

  ngOnInit() {
    // Initialization logic here
  }

  getTotalRoles(): number {
    return this.roles().length;
  }

  getActiveRoles(): number {
    return this.roles().filter(role => role.activo).length;
  }

  getTotalPermissions(): number {
    return this.allPermissions.length;
  }

  getTotalUsers(): number {
    return this.roles().reduce((total, role) => total + role.usuariosCount, 0);
  }

  getPermissionsByCategory() {
    const categories = ['users', 'universities', 'events', 'projects', 'reports', 'system'];
    return categories.map(category => ({
      category,
      permissions: this.allPermissions.filter(p => p.category === category)
    }));
  }

  editRole(role: Role) {
    this.editingRole = role;
    this.selectedPermissions = [...role.permissions];
    this.roleForm.patchValue({
      nombre: role.nombre,
      descripcion: role.descripcion,
      color: role.color
    });
    this.showCreateRoleModal = true;

    // Marcar permisos seleccionados
    setTimeout(() => {
      role.permissions.forEach(permissionId => {
        const checkbox = document.getElementById(permissionId) as HTMLInputElement;
        if (checkbox) {
          checkbox.checked = true;
        }
      });
    }, 100);
  }

  onPermissionChange(event: any) {
    const permissionId = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      if (!this.selectedPermissions.includes(permissionId)) {
        this.selectedPermissions.push(permissionId);
      }
    } else {
      this.selectedPermissions = this.selectedPermissions.filter(id => id !== permissionId);
    }
  }

  saveRole() {
    if (this.roleForm.valid) {
      const formValue = this.roleForm.value;

      if (this.editingRole) {
        // Actualizar rol existente
        const updatedRoles = this.roles().map(role =>
          role.id === this.editingRole!.id
            ? { ...role, ...formValue, permissions: this.selectedPermissions }
            : role
        );
        this.roles.set(updatedRoles);
      } else {
        // Crear nuevo rol
        const newRole: Role = {
          id: Math.max(...this.roles().map(r => r.id)) + 1,
          ...formValue,
          tipo: 'personalizado',
          permissions: this.selectedPermissions,
          usuariosCount: 0,
          fechaCreacion: new Date().toISOString(),
          activo: true
        };
        this.roles.set([...this.roles(), newRole]);
      }

      this.cancelEdit();
    }
  }

  cancelEdit() {
    this.editingRole = null;
    this.showCreateRoleModal = false;
    this.selectedPermissions = [];
    this.roleForm.reset({
      color: '#3B82F6'
    });
  }

  viewRolePermissions(role: Role) {
    console.log('Ver permisos del rol:', role);
    // Aquí podrías mostrar un modal con los permisos detallados
  }
}
