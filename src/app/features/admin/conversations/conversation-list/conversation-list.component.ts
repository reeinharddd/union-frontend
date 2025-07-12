import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-conversation-list',
  standalone: true,
  imports: [],
  templateUrl: './conversation-list.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationListComponent {}
