import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

interface Conversation {
  id: number;
  usuario1_nombre?: string;
  usuario2_nombre?: string;
  estado?: string;
  total_mensajes?: number;
  ultimo_mensaje?: string;
  creado_en?: string;
}

@Component({
  selector: 'app-conversation-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conversation-list.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationListComponent {
  private router = inject(Router);

  // TODO: Replace with actual service when available
  conversations$: Observable<Conversation[]> = of([]);

  getActiveConversations(conversations: Conversation[]): number {
    if (!conversations) return 0;
    return conversations.filter(c => c.estado !== 'archivada' && c.estado !== 'eliminada').length;
  }

  getTodayMessages(conversations: Conversation[]): number {
    if (!conversations) return 0;
    const today = new Date().toDateString();
    return conversations.filter(c => {
      if (!c.ultimo_mensaje) return false;
      return new Date(c.ultimo_mensaje).toDateString() === today;
    }).length;
  }

  getUniqueUsers(conversations: Conversation[]): number {
    if (!conversations) return 0;
    const users = new Set<string>();
    conversations.forEach(c => {
      if (c.usuario1_nombre) users.add(c.usuario1_nombre);
      if (c.usuario2_nombre) users.add(c.usuario2_nombre);
    });
    return users.size;
  }

  getStatusClasses(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'activa':
        return 'bg-green-100 text-green-800';
      case 'archivada':
        return 'bg-yellow-100 text-yellow-800';
      case 'eliminada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  }

  trackByConversation(index: number, conversation: Conversation): number {
    return conversation.id || index;
  }

  viewConversation(conversation: Conversation): void {
    this.router.navigate(['/admin/conversations', conversation.id]);
  }

  archiveConversation(_conversation: Conversation): void {
    if (confirm('¿Seguro que deseas archivar esta conversación?')) {
      // TODO: Implement archive logic with actual service
    }
  }

  deleteConversation(_conversation: Conversation): void {
    if (confirm('¿Seguro que deseas eliminar esta conversación?')) {
      // TODO: Implement delete logic with actual service
    }
  }
}
