import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@app/shared/components/header/header.component';
import { PromoterSidebarComponent } from '@app/shared/components/dynamic-sidebar/sidebar-promoter.component';

@Component({
  selector: 'promoter-layout',
  standalone: true,
  imports: [PromoterSidebarComponent, RouterOutlet, HeaderComponent],
  template: `
    <div class="flex h-screen overflow-hidden bg-background">
      <!-- Sidebar Promotor -->
      <app-promoter-sidebar class="w-64 flex-shrink-0"></app-promoter-sidebar>

      <!-- Contenedor Principal -->
      <div class="flex flex-1 flex-col overflow-hidden">
        <!-- Encabezado Promotor -->
        <app-header class="flex-shrink-0"></app-header>

        <!-- Área Principal -->
        <main class="bg-muted flex-1 overflow-auto p-6">
          <div class="mx-auto max-w-6xl">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PromoterLayoutComponent {}
