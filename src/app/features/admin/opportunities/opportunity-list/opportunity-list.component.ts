import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-opportunity-list',
  standalone: true,
  imports: [],
  templateUrl: './opportunity-list.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpportunityListComponent {}
