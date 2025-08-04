import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { LayoutConfigService } from '@app/core/services/layout/layout-config.service';
import { DynamicHeaderComponent } from '@app/shared/components/dynamic-header/dynamic-header.component';
import { DynamicSidebarComponent } from '@app/shared/components/dynamic-sidebar/dynamic-sidebar.component';

@Component({
  selector: 'app-dynamic-layout',
  standalone: true,
  imports: [CommonModule, DynamicSidebarComponent, DynamicHeaderComponent],
  template: `
    <div class="flex h-screen overflow-hidden bg-background">
      <!-- Left Sidebar -->
      @if (showLeftSidebar()) {
        <app-dynamic-sidebar
          position="left"
          [navigationItems]="getLeftSidebarItems()"
          class="w-64 flex-shrink-0">
        </app-dynamic-sidebar>
      }

      <!-- Main Content Area -->
      <div class="flex flex-1 flex-col overflow-hidden">
        <!-- Dynamic Header -->
            <!-- Header -->
    <app-dynamic-header
      class="bg-background border-b border-border">
    </app-dynamic-header>

        <!-- Main Content -->
        <main class="flex-1 overflow-auto bg-neutral-50 p-6">
          <div class="mx-auto max-w-7xl">
            <ng-content></ng-content>
          </div>
        </main>
      </div>

      <!-- Right Sidebar -->
      @if (showRightSidebar()) {
        <app-dynamic-sidebar
          position="right"
          [navigationItems]="getRightSidebarItems()"
          class="w-64 flex-shrink-0 border-l border-border">
        </app-dynamic-sidebar>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicLayoutComponent {
  private readonly layoutConfigService = inject(LayoutConfigService);

  private readonly layoutConfig = computed(() =>
    this.layoutConfigService.getCurrentLayoutConfig()
  );

  getHeaderType(): 'admin' | 'student' | 'university' | 'public' {
    return this.layoutConfig().headerType;
  }

  showLeftSidebar(): boolean {
    return this.layoutConfig().showLeftSidebar;
  }

  showRightSidebar(): boolean {
    return this.layoutConfig().showRightSidebar;
  }

  getLeftSidebarItems() {
    return this.layoutConfig().leftSidebarItems;
  }

  getRightSidebarItems() {
    return this.layoutConfig().rightSidebarItems || [];
  }
}
