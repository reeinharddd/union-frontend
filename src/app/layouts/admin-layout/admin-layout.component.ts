import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@app/shared/components/header/header.component';
import { DynamicSidebarComponent } from '@app/shared/components/dynamic-sidebar/dynamic-sidebar.component';

@Component({
  selector: 'admin-layout',
  standalone: true,
  imports: [DynamicSidebarComponent, RouterOutlet, HeaderComponent],
  template: `
    <div class="flex h-screen overflow-hidden bg-background">
      <!-- Dynamic Sidebar -->
      <app-dynamic-sidebar class="w-64 flex-shrink-0">
        
      </app-dynamic-sidebar>

      <!-- Main Content Area -->
      <div class="flex flex-1 flex-col overflow-hidden">
        <!-- Header -->
        <app-header class="flex-shrink-0"></app-header>

        <!-- Main Content -->
        <main class="flex-1 overflow-auto bg-neutral-50 p-6">
          <div class="mx-auto max-w-7xl">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayoutComponent {}
