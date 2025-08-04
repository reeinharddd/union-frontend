import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, computed, inject, signal } from '@angular/core';
import { API_ENDPOINTS } from '../../../../core/constants/api-endpoints';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ApiClientService } from '../../../../core/services/base/api-client.service';

interface User {
  id: number;
  nombre: string;  // Cambiado de 'nombres' a 'nombre'
  correo: string;
  rol_id: number;
  universidad_id: number;
}

interface Following {
  id: number;
  seguidor_id: number;
  seguido_usuario_id: number;
  seguido_proyecto_id?: number;
  creado_en: string;
}

interface Message {
  id: number;
  conversacion_id: number;
  emisor_id: number; // Cambiado de usuario_id a emisor_id para coincidir con backend
  contenido: string;
  leido: boolean;
  enviado_en: string; // Cambiado de creado_en a enviado_en para coincidir con backend
}

interface Conversation {
  id: number;
  usuario_1_id: number;
  usuario_2_id: number;
  creado_en: string;
}

@Component({
  selector: 'app-conversations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conversations.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversationsComponent implements OnInit {
  private readonly apiClient = inject(ApiClientService);
  private readonly authService = inject(AuthService);
  
  @Output() selectConversation = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  // 🔍 Estados para búsqueda según REQ-4.6.1
  private allConversations = signal<any[]>([]);
  searchQuery = signal<string>('');

  // 📊 Conversaciones filtradas computadas según REQ-4.6.1
  conversations = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const all = this.allConversations();

    if (!query) {
      return all;
    }

    // Filtrar por nombre de usuario según REQ-4.6.1
    return all.filter(conversation => 
      conversation.name.toLowerCase().includes(query)
    );
  });

  ngOnInit() {
    this.loadMutualFollowersConversations();
  }

  // 🔍 Actualizar búsqueda en tiempo real según REQ-4.6.1
  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery.set(target.value);
  }

  // 🧹 Limpiar búsqueda
  clearSearch(): void {
    this.searchQuery.set('');
  }

  onClose() {
    this.close.emit();
  }

  onSelect(conversation: any) {
    // Al seleccionar conversación, los mensajes se marcarán como vistos automáticamente
    this.selectConversation.emit(conversation);
  }

  private async loadMutualFollowersConversations() {
    try {
      const currentUser = this.authService.currentUser();
      console.log('🔍 Current user:', currentUser);
      
      if (!currentUser?.id) {
        console.log('❌ No current user found');
        this.allConversations.set([]);
        return;
      }

      console.log(`🔄 Loading followings for user ${currentUser.id}`);

      // Obtener seguimientos donde soy seguidor (usuarios que sigo)
      const myFollowings = await this.apiClient
        .get<Following[]>(`${API_ENDPOINTS.FOLLOWINGS.BASE}?seguidor_id=${currentUser.id}`)
        .toPromise();

      console.log('👥 My followings:', myFollowings);

      // Obtener usuarios que me siguen (mis seguidores)
      const myFollowers = await this.apiClient
        .get<Following[]>(`${API_ENDPOINTS.FOLLOWINGS.BASE}?seguido_usuario_id=${currentUser.id}`)
        .toPromise();

      console.log('👥 My followers:', myFollowers);

      if (!myFollowings || !myFollowers) {
        console.log('❌ Missing followings or followers data');
        this.allConversations.set([]);
        return;
      }

      // ✅ VALIDACIÓN DE AUTORIZACIÓN REQ-4.14.3
      // Solo usuarios con seguimiento MUTUO pueden tener conversaciones
      const mutualUserIds = [...new Set(myFollowings
        .filter(following => {
          // Verificar que el usuario al que sigo también me siga a mí
          const isMutual = myFollowers.some(follower => 
            follower.seguidor_id === following.seguido_usuario_id && 
            follower.seguido_usuario_id === currentUser.id
          );
          console.log(`🔍 User ${following.seguido_usuario_id} mutual follow check:`);
          console.log(`   - I follow them: YES (${currentUser.id} → ${following.seguido_usuario_id})`);
          console.log(`   - They follow me: ${isMutual ? 'YES' : 'NO'} (${following.seguido_usuario_id} → ${currentUser.id})`);
          console.log(`   - Mutual relationship: ${isMutual}`);
          return isMutual;
        })
        .map(following => following.seguido_usuario_id)
        .filter(userId => userId !== currentUser.id))];  // Excluir mi propio ID

      console.log('🤝 Authorized mutual user IDs:', mutualUserIds);

      if (mutualUserIds.length === 0) {
        console.log('ℹ️ No mutual followers found - no conversations to show');
        this.allConversations.set([]);
        return;
      }

      // Obtener información de usuarios autorizados
      const authorizedUsers = await Promise.all(
        mutualUserIds.map(async userId => {
          try {
            console.log(`🔄 Loading authorized user ${userId}`);
            const user = await this.apiClient.get<User>(API_ENDPOINTS.USERS.BY_ID(userId)).toPromise();
            console.log(`✅ Authorized user ${userId} loaded:`, user);
            return user;
          } catch (error) {
            console.error(`❌ Error loading user ${userId}:`, error);
            return null;
          }
        })
      );

      console.log('👤 All authorized users loaded:', authorizedUsers);

      // Crear conversaciones solo para usuarios autorizados
      const authorizedConversations = await Promise.all(
        authorizedUsers
          .filter(user => user !== null)
          .map(async user => {
            const conversationId = this.generateConversationId(currentUser.id, user!.id);
            
            // Primero, crear o obtener la conversación real de la base de datos
            const realConversation = await this.getOrCreateConversation(currentUser.id, user!.id);
            const lastMessage = realConversation ? await this.getLastMessage(realConversation.id) : null;
            
            return {
              id: conversationId, // Mantener formato "1-2" para frontend
              realId: realConversation?.id, // ID real de la base de datos
              name: user!.nombre,
              lastMessage: lastMessage || 'Iniciar conversación',
              avatar: this.getInitials(user!.nombre),
              userId: user!.id,
              otherUserId: user!.id,
              unreadCount: 0 // Para futuras implementaciones
            };
          })
      );

      console.log('💬 Authorized conversations data:', authorizedConversations);
      this.allConversations.set(authorizedConversations);
      
    } catch (error) {
      console.error('❌ Error loading authorized conversations:', error);
      this.allConversations.set([]);
    }
  }

  private getInitials(nombre: string): string {  // Simplificar método
    const words = nombre.trim().split(' ');
    if (words.length >= 2) {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
    return words[0].charAt(0).toUpperCase();
  }

  private generateConversationId(userId1: number, userId2: number): string {
    // Generar un ID único para la conversación entre dos usuarios
    // Siempre usar el menor ID primero para consistencia
    const sortedIds = [userId1, userId2].sort((a, b) => a - b);
    return `${sortedIds[0]}-${sortedIds[1]}`;
  }

  private async getLastMessage(conversationId: number): Promise<string | null> {
    try {
      console.log(`🔍 Getting last message for conversation ID: ${conversationId}`);
      
      // Intentar obtener el último mensaje de esta conversación usando el ID real
      const endpoint = `${API_ENDPOINTS.MESSAGES.BASE}?conversacion_id=${conversationId}`;
      console.log(`📡 API endpoint: ${endpoint}`);
      
      const messages = await this.apiClient
        .get<Message[]>(endpoint)
        .toPromise();
      
      console.log(`💬 Messages found for conversation ${conversationId}:`, messages);
      
      if (messages && messages.length > 0) {
        // Ordenar por fecha de envío (más reciente primero)
        const sortedMessages = messages.sort((a, b) => 
          new Date(b.enviado_en).getTime() - new Date(a.enviado_en).getTime()
        );
        
        const lastMsg = sortedMessages[0];
        console.log(`📝 Last message for conversation ${conversationId}:`, lastMsg);
        
        // Truncar mensaje si es muy largo
        const truncatedMessage = lastMsg.contenido.length > 30 
          ? lastMsg.contenido.substring(0, 30) + '...'
          : lastMsg.contenido;
          
        console.log(`✅ Returning message: "${truncatedMessage}"`);
        return truncatedMessage;
      }
      
      console.log(`ℹ️ No messages found for conversation ${conversationId}`);
      return null;
    } catch (error) {
      console.error(`❌ Error getting last message for conversation ${conversationId}:`, error);
      return null;
    }
  }

  private async getOrCreateConversation(userId1: number, userId2: number): Promise<Conversation | null> {
    try {
      console.log(`🔍 Getting or creating conversation between ${userId1} and ${userId2}`);
      
      // Buscar conversación existente (en cualquier orden)
      const existingConversations = await this.apiClient
        .get<Conversation[]>(`${API_ENDPOINTS.CONVERSATIONS.BASE}`)
        .toPromise();
      
      if (existingConversations) {
        const existing = existingConversations.find(conv => 
          (conv.usuario_1_id === userId1 && conv.usuario_2_id === userId2) ||
          (conv.usuario_1_id === userId2 && conv.usuario_2_id === userId1)
        );
        
        if (existing) {
          console.log(`✅ Found existing conversation:`, existing);
          return existing;
        }
      }
      
      // Si no existe, crear nueva conversación
      console.log(`🆕 Creating new conversation between ${userId1} and ${userId2}`);
      const newConversation = await this.apiClient
        .post<Conversation>(API_ENDPOINTS.CONVERSATIONS.BASE, {
          usuario_1_id: Math.min(userId1, userId2), // Menor ID primero
          usuario_2_id: Math.max(userId1, userId2)  // Mayor ID segundo
        })
        .toPromise();
      
      console.log(`✅ Created new conversation:`, newConversation);
      return newConversation || null;
      
    } catch (error) {
      console.error(`❌ Error getting/creating conversation between ${userId1} and ${userId2}:`, error);
      return null;
    }
  }
}
