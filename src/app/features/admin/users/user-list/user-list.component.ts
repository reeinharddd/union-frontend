import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  TableAction,
  TableColumn,
  TableComponent,
} from '@app/shared/components/table/table.component';

@Component({
  selector: 'user-list',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './user-list.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  users = [
    { id: 1, name: 'Alice Martínez', email: 'alice@example.com', role: 'Admin' },
    { id: 2, name: 'Bob Sánchez', email: 'bob@example.com', role: 'User' },
    { id: 3, name: 'Carol García', email: 'carol@example.com', role: 'Moderator' },
  ];

  userColumns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
  ];

  userActions: TableAction[] = [
    { label: 'Edit', cssClass: 'bg-primary-50 text-primary-500 hover:bg-primary-100' },
    { label: 'Delete', cssClass: 'bg-accent-50 text-accent-500 hover:bg-accent-100' },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleUserAction(event: { action: TableAction; item: any }) {
    if (event.action.label === 'Edit') {
      // Handle edit
      console.log('Edit user:', event.item);
    } else if (event.action.label === 'Delete') {
      // Handle delete
      console.log('Delete user:', event.item);
    }
  }
}
