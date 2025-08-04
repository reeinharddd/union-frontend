import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal, inject, OnInit } from '@angular/core';
import { DynamicHeaderComponent } from '../dynamic-header/dynamic-header.component';
import { DynamicSidebarComponent } from '../dynamic-sidebar/dynamic-sidebar.component';
import { LayoutConfigService } from '@app/core/services/layout/layout-config.service';

@Component({
  selector: 'app-dynamic-layout',
  standalone: true,
  imports: [CommonModule, DynamicHeaderComponent, DynamicSidebarComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header universal -->
      <app-dynamic-header />

      <div class="flex">
        <!-- Sidebar izquierdo (siempre visible para algunos roles) -->
        @if (showLeftSidebar()) {
          <app-dynamic-sidebar
            [navigationItems]="getLeftSidebarItems()"
            [position]="'left'"
            [isCollapsed]="isLeftSidebarCollapsed()"
            (toggleCollapsed)="toggleLeftSidebar()"
          />
        }

        <!-- Contenido principal -->
        <main [class]="getMainContentClasses()">
          <ng-content />
        </main>

        <!-- Sidebar derecho (solo para algunos roles) -->
        @if (showRightSidebar()) {
          <app-dynamic-sidebar
            [navigationItems]="getRightSidebarItems()"
            [position]="'right'"
            [isCollapsed]="isRightSidebarCollapsed()"
            (toggleCollapsed)="toggleRightSidebar()"
          />
        }
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicLayoutComponent implements OnInit {
  private readonly layoutService = inject(LayoutConfigService);

  // Estados del layout
  leftSidebarCollapsed = signal(false);
  rightSidebarCollapsed = signal(false);
  currentUserRole = signal(this.layoutService.getCurrentUserRole());

  ngOnInit() {
    // Actualizar el rol cuando cambie
    this.currentUserRole.set(this.layoutService.getCurrentUserRole());
  }

  // Controlar visibilidad de sidebars
  showLeftSidebar(): boolean {
    const role = this.currentUserRole();
    return ['admin', 'promoter', 'student', 'university_admin'].includes(role);
  }

  showRightSidebar(): boolean {
    const role = this.currentUserRole();
    return ['student', 'university_admin'].includes(role);
  }

  // Obtener elementos de navegación
  getLeftSidebarItems() {
    return this.layoutService.getLeftSidebarConfig();
  }

  getRightSidebarItems() {
    return this.layoutService.getRightSidebarConfig();
  }

  // Estados de colapso
  isLeftSidebarCollapsed(): boolean {
    return this.leftSidebarCollapsed();
  }

  isRightSidebarCollapsed(): boolean {
    return this.rightSidebarCollapsed();
  }

  // Toggle sidebars
  toggleLeftSidebar() {
    this.leftSidebarCollapsed.set(!this.leftSidebarCollapsed());
  }

  toggleRightSidebar() {
    this.rightSidebarCollapsed.set(!this.rightSidebarCollapsed());
  }

  // Clases dinámicas para el contenido principal
  getMainContentClasses(): string {
    const baseClasses = 'flex-1 overflow-x-hidden transition-all duration-300';
    const role = this.currentUserRole();

    let classes = baseClasses;

    // Ajustar márgenes según sidebars activos
    if (this.showLeftSidebar()) {
      classes += this.isLeftSidebarCollapsed() ? ' ml-16' : ' ml-64';
    }

    if (this.showRightSidebar()) {
      classes += this.isRightSidebarCollapsed() ? ' mr-16' : ' mr-64';
    }

    return classes;
  }
}
