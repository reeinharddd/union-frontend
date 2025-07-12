import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '@app/core/services/ui/toast.service';
import { User, UserService } from '@app/core/services/user/user.service';
import { ErrorHandlerComponent } from '@app/shared/components/error-handler/error-handler.component';
import {
  TableAction,
  TableColumn,
  TableComponent,
} from '@app/shared/components/table/table.component';

@Component({
  selector: 'user-list',
  standalone: true,
  imports: [CommonModule, TableComponent, ErrorHandlerComponent],
  template: `
    <div class="p-6">
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-text-base">Gestión de Usuarios</h1>
          <p class="text-text-muted">Administra los usuarios del sistema</p>
        </div>
        <button
          (click)="navigateToNew()"
          class="rounded-lg bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700"
        >
          <span class="mr-2">+</span>
          Nuevo Usuario
        </button>
      </div>

      @if (isLoading()) {
        <div class="flex items-center justify-center py-12">
          <div class="h-8 w-8 animate-spin rounded-full border-b-2 border-primary-600"></div>
          <span class="ml-3 text-text-muted">Cargando usuarios...</span>
        </div>
      } @else if (error()) {
        <app-error-handler
          [error]="error()"
          title="Error al cargar usuarios"
          message="No se pudieron cargar los usuarios desde el servidor."
          [retryCallback]="loadUsers.bind(this)"
        >
        </app-error-handler>
      } @else {
        <app-data-table
          [data]="users()"
          [columns]="userColumns"
          [actions]="userActions"
          (rowAction)="handleUserAction($event)"
        >
        </app-data-table>

        @if (users().length === 0) {
          <div class="py-12 text-center">
            <div class="mb-4 text-6xl">👥</div>
            <h3 class="mb-2 text-lg font-medium text-text-base">No hay usuarios</h3>
            <p class="mb-4 text-text-muted">Comienza creando el primer usuario del sistema</p>
            <button
              (click)="navigateToNew()"
              class="rounded-lg bg-primary-600 px-4 py-2 text-white transition-colors hover:bg-primary-700"
            >
              Crear Usuario
            </button>
          </div>
        }
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  readonly users = this.userService.users;
  readonly isLoading = signal(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly error = signal<any>(null);

  userColumns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Rol' },
    { key: 'creado_en', label: 'Fecha Registro' },
  ];

  userActions: TableAction[] = [
    {
      label: 'Ver',
      cssClass: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
      icon: '👁️',
    },
    {
      label: 'Editar',
      cssClass: 'bg-primary-50 text-primary-600 hover:bg-primary-100',
      icon: '✏️',
    },
    {
      label: 'Eliminar',
      cssClass: 'bg-red-50 text-red-600 hover:bg-red-100',
      icon: '🗑️',
    },
  ];

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.userService.getAll().subscribe({
      next: () => {
        this.isLoading.set(false);
        console.log('✅ Users loaded successfully');
      },
      error: err => {
        this.isLoading.set(false);
        this.error.set(err);
        console.error('❌ Failed to load users:', err);
      },
    });
  }

  handleUserAction(event: { action: TableAction; item: User }): void {
    const { action, item } = event;

    switch (action.label) {
      case 'Ver':
        this.viewUser(item.id);
        break;
      case 'Editar':
        this.editUser(item.id);
        break;
      case 'Eliminar':
        this.deleteUser(item);
        break;
    }
  }

  private viewUser(id: number): void {
    this.router.navigate(['/admin/users', id]);
  }

  private editUser(id: number): void {
    this.router.navigate(['/admin/users', id, 'edit']);
  }

  private deleteUser(user: User): void {
    if (confirm(`¿Estás seguro de que deseas eliminar al usuario "${user.name || user.email}"?`)) {
      this.userService.delete(user.id).subscribe({
        next: () => {
          this.toastService.showSuccess('Usuario eliminado exitosamente');
        },
        error: err => {
          console.error('❌ Failed to delete user:', err);
        },
      });
    }
  }

  navigateToNew(): void {
    this.router.navigate(['/admin/users/new']);
  }
}
