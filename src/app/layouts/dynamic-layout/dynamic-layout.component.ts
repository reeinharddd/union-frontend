import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutConfigService } from '@app/core/services/layout/layout-config.service';
import { ChatFloatContainerComponent } from '@app/shared/components/chat/chat-float-container.component';
import { DynamicHeaderComponent } from '@app/shared/components/dynamic-header/dynamic-header.component';
import { DynamicSidebarComponent } from '@app/shared/components/dynamic-sidebar/dynamic-sidebar.component';
import { RightSidebarComponent } from '@app/shared/components/right-sidebar/right-sidebar.component';

@Component({
  selector: 'app-dynamic-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    DynamicSidebarComponent,
    DynamicHeaderComponent,
    RightSidebarComponent,
    ChatFloatContainerComponent
  ],
  template: `
    <div class="flex h-screen overflow-hidden bg-background">
      <!-- Left Sidebar -->
      @if (showLeftSidebar()) {
        <app-dynamic-sidebar class="w-64 flex-shrink-0"> </app-dynamic-sidebar>
      }

      <!-- Main Content Area -->
      <div class="flex flex-1 flex-col overflow-hidden">
        <!-- Dynamic Header -->
        <!-- Header -->
        <app-dynamic-header class="border-b border-border bg-background"> </app-dynamic-header>

        <!-- Main Content -->
        <main class="flex-1 overflow-auto bg-neutral-50 p-6">
          <div class="mx-auto max-w-7xl">
            <router-outlet></router-outlet>
          </div>
        </main>

        <!-- Chat Float Container -->
        <app-chat-float-container>Chat</app-chat-float-container>

      </div>

      <!-- Right Sidebar -->
      @if (showRightSidebar()) {
        <app-right-sidebar class="w-80 flex-shrink-0 border-l border-border"> </app-right-sidebar>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicLayoutComponent {
  private readonly layoutConfigService = inject(LayoutConfigService);

  showLeftSidebar(): boolean {
    // Admin y Promoter: solo sidebar izquierdo
    // Student y University Admin: ambos sidebars
    const role = this.layoutConfigService.getCurrentUserRole();
    return (
      role === 'admin' || role === 'student' || role === 'promoter' || role === 'university_admin'
    );
  }

  showRightSidebar(): boolean {
    // Solo Student y University Admin tienen sidebar derecho
    // Admin y Promoter: solo sidebar izquierdo
    const role = this.layoutConfigService.getCurrentUserRole();
    return role === 'student' || role === 'university_admin';
  }
}
