import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DynamicHeaderComponent } from '../../../shared/components/dynamic-header/dynamic-header.component';
import { DynamicRightSidebarComponent } from '../../../shared/components/dynamic-right-sidebar/dynamic-right-sidebar.component';
import { DynamicSidebarComponent } from '../../../shared/components/dynamic-sidebar/dynamic-sidebar.component';

@Component({
  selector: 'app-admin-uni-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    DynamicSidebarComponent,
    DynamicHeaderComponent,
    DynamicRightSidebarComponent,
  ],
  template: `
    <div class="flex h-screen bg-gray-50">
      <!-- Sidebar izquierdo -->
      <app-dynamic-sidebar class="flex-shrink-0" />

      <!-- Contenido principal -->
      <div class="flex flex-1 flex-col overflow-hidden">
        <!-- Header -->
        <app-dynamic-header />

        <!-- Área de contenido -->
        <main class="flex flex-1 overflow-hidden">
          <!-- Contenido de la ruta -->
          <div class="flex-1 overflow-y-auto">
            <router-outlet />
          </div>

          <!-- Sidebar derecho -->
          <!-- <app-dynamic-right-sidebar class="flex-shrink-0" /> -->
        </main>
      </div>
    </div>
  `,
})
export class AdminUniLayoutComponent {}
