import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "@app/shared/components/header/header.component";
import { LeftSidebarComponent } from "@app/shared/components/left-sidebar/left-sidebar.component";

@Component({
  selector: 'admin-layout',
  standalone: true,
  imports: [LeftSidebarComponent, RouterOutlet, HeaderComponent],
  templateUrl: './admin-layout.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminLayoutComponent {

}
