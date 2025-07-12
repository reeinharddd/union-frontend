import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-grades-list',
  standalone: true,
  imports: [],
  templateUrl: './grades-list.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GradesListComponent {}
