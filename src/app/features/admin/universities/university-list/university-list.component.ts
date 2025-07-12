import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-university-list',
  standalone: true,
  imports: [],
  templateUrl: './university-list.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UniversityListComponent {}
