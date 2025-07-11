import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface TableAction {
  label: string;
  icon?: string;
  cssClass?: string;
}

@Component({
  selector: 'app-data-table', // Selector cambiado a un nombre que no cause conflicto
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent {
  @Input() title: string = '';
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() actions: TableAction[] = [];

  @Output() rowAction = new EventEmitter<{action: TableAction, item: any}>();
  @Output() rowClick = new EventEmitter<any>();

  handleAction(action: TableAction, item: any, event: Event) {
    event.stopPropagation();
    this.rowAction.emit({ action, item });
  }

  handleRowClick(item: any) {
    this.rowClick.emit(item);
  }
}
