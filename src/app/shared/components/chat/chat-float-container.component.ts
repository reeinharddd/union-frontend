import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ChatComponent } from './chats/chat.component';
import { ConversationsComponent } from './conversations/conversations.component';

@Component({
  selector: 'app-chat-float-container',
  standalone: true,
  imports: [CommonModule, ConversationsComponent, ChatComponent],
  templateUrl: './chat-float-container.component.html',
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatFloatContainerComponent {
  show = false;
  selectedConversation: any = null;

  open() {
    this.show = true;
    this.selectedConversation = null;
  }

  close() {
    this.show = false;
    this.selectedConversation = null;
  }

  onSelectConversation(conversation: any) {
    this.selectedConversation = conversation;
  }

  onBackToConversations() {
    this.selectedConversation = null;
  }
}
