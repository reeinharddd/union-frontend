import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DynamicHeaderComponent } from '@app/shared/components/dynamic-header/dynamic-header.component';
import { DynamicSidebarComponent } from '@app/shared/components/dynamic-sidebar/dynamic-sidebar.component';

@Component({
  selector: 'admin-layout',
  standalone: true,
  imports: [DynamicSidebarComponent, RouterOutlet, DynamicHeaderComponent],
  template: `
    <div class="flex h-screen overflow-hidden bg-background">
      <!-- Dynamic Sidebar -->
      <app-dynamic-sidebar class="w-64 flex-shrink-0"> </app-dynamic-sidebar>

      <!-- Main Content Area -->
      <div class="flex flex-1 flex-col overflow-hidden">
        <!-- Header -->
        <app-dynamic-header class="flex-shrink-0"></app-dynamic-header>

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
