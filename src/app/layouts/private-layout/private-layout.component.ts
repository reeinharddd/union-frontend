import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatFloatContainerComponent } from '../../shared/components/chat/chat-float-container.component';
import { DynamicSidebarComponent } from '../../shared/components/dynamic-sidebar/dynamic-sidebar.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { RightSidebarComponent } from '../../shared/components/right-sidebar/right-sidebar.component';

@Component({
  selector: 'app-private-layout',
  standalone: true,
  imports: [HeaderComponent, DynamicSidebarComponent, RightSidebarComponent, RouterOutlet, ChatFloatContainerComponent],
  template: `
    <div class="flex h-screen overflow-hidden bg-background">
      <!-- Dynamic Left Sidebar -->
      <app-dynamic-sidebar class="w-64 flex-shrink-0"></app-dynamic-sidebar>

      <!-- Main Content Area -->
      <div class="flex flex-1 flex-col overflow-hidden">
        <!-- Header -->
        <app-header class="flex-shrink-0"></app-header>

        <!-- Main Content -->
        <main class="flex-1 overflow-auto p-4">
          <router-outlet></router-outlet>
        </main>

        <!-- Chat Float Container -->
        <app-chat-float-container></app-chat-float-container>
      </div>

      <!-- Right Sidebar -->
      <app-right-sidebar class="w-64 flex-shrink-0"></app-right-sidebar>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivateLayoutComponent {}
