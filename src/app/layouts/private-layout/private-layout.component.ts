import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { LeftSidebarComponent } from '../../shared/components/left-sidebar/left-sidebar.component';
import { RightSidebarComponent } from '../../shared/components/right-sidebar/right-sidebar.component';

@Component({
  selector: 'app-private-layout',
  standalone: true,
  imports: [HeaderComponent, LeftSidebarComponent, RightSidebarComponent, RouterOutlet],
  templateUrl: './private-layout.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivateLayoutComponent {}
