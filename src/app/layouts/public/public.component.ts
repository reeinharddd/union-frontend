import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-public',
  standalone: true,
  imports: [],
  templateUrl: './public.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicComponent {}
