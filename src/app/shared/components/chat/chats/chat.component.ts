import { CommonModule } from '@angular/common';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { API_ENDPOINTS } from '../../../../core/constants/api-endpoints';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ApiClientService } from '../../../../core/services/base/api-client.service';
import { Message } from '../../../../core/services/conversation/conversation.service';
import { SocketService } from '../../../../core/services/socket/socket.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat.component.html',
  styles: `
    @tailwind base;
    @tailwind components;
    @tailwind utilities;
    @layer utilities {
      .dark .neo-shadow {
        box-shadow:
          5px 5px 10px #1a1a1a,
          -5px -5px 10px #2c2c2c;
      }

      .neo-inset {
        box-shadow:
          inset 5px 5px 10px #d1d9e6,
          inset -5px -5px 10px #ffffff;
      }

      .dark .neo-inset {
        box-shadow:
          inset 5px 5px 10px #1a1a1a,
          inset -5px -5px 10px #2c2c2c;
      }

      .neo-button {
        transition: all 0.2s ease-in-out;
      }

      .neo-button:hover {
        box-shadow:
          inset 3px 3px 6px #d1d9e6,
          inset -3px -3px 6px #ffffff;
      }

      .dark .neo-button:hover {
        box-shadow:
          inset 3px 3px 6px #1a1a1a,
          inset -3px -3px 6px #2c2c2c;
      }

      .neo-button:active {
        box-shadow:
          inset 5px 5px 10px #d1d9e6,
          inset -5px -5px 10px #ffffff;
      }

      .dark .neo-button:active {
        box-shadow:
          inset 5px 5px 10px #1a1a1a,
          inset -5px -5px 10px #2c2c2c;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit, OnChanges, OnDestroy, AfterViewChecked {
  private readonly authService = inject(AuthService);
  private readonly socketService = inject(SocketService);
  private readonly apiClient = inject(ApiClientService);

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  @Input() conversation: any;
  @Output() back = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  messages = signal<Message[]>([]);
  currentUser = signal<any>(null);
  newMessage = signal<string>('');
  private messageSubscription?: Subscription;
  private currentConversationId?: string | number;
  private shouldScrollToBottom = false;

  ngOnInit() {
    this.currentUser.set(this.authService.currentUser());

    // Conectar socket si no está conectado
    if (!this.socketService.isConnected()) {
      this.socketService.connect();
    }

    // Esperar a que el socket esté conectado y autenticado antes de configurar listeners
    this.socketService.getConnectionStatus().subscribe(isConnected => {
      if (isConnected && !this.messageSubscription) {
        this.setupMessageListener();
      }
    });

    if (this.conversation) {
      this.loadMessages();
    }
  }

  private setupMessageListener() {
    // Escuchar mensajes nuevos
    this.messageSubscription = this.socketService.onNewMessage().subscribe(
      messageData => {
        console.log('📨 Received message in chat component:', messageData);
        console.log('🔍 Current conversation ID:', this.currentConversationId);
        console.log('🔍 Message conversation ID:', messageData.conversationId);

        // Solo agregar el mensaje si es de la conversación actual
        if (messageData.conversationId === this.currentConversationId) {
          console.log('✅ Message belongs to current conversation, adding to messages');
          const newMessage: Message = {
            id: messageData.id,
            conversacion_id: messageData.conversationId,
            emisor_id: messageData.userId, // Cambiado de usuario_id a emisor_id
            contenido: messageData.message,
            leido: false,
            enviado_en: messageData.timestamp, // Cambiado de creado_en a enviado_en
          };

          this.messages.update(msgs => [...msgs, newMessage]);

          // Forzar scroll hacia abajo después de agregar el mensaje
          setTimeout(() => {
            this.shouldScrollToBottom = true;
            this.scrollToBottom();
          }, 50);
        } else {
          console.log('❌ Message does not belong to current conversation, ignoring');
        }
      },
      error => {
        console.error('❌ Error in message subscription:', error);
      },
    );
  }

  ngAfterViewChecked() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnChanges() {
    if (this.conversation) {
      this.loadMessages();
    }
  }

  ngOnDestroy() {
    // Limpiar suscripciones
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
    }

    // Salir de la conversación actual
    if (this.currentConversationId) {
      this.socketService.leaveConversation(this.currentConversationId);
    }
  }

  private async loadMessages() {
    // Salir de la conversación anterior si existe
    if (this.currentConversationId) {
      this.socketService.leaveConversation(this.currentConversationId);
    }

    // Unirse a la nueva conversación
    this.currentConversationId = this.conversation.id;
    if (this.currentConversationId) {
      console.log(`🏠 About to join conversation with ID: ${this.currentConversationId}`);

      // Pequeño retraso para asegurar que el socket esté autenticado
      setTimeout(() => {
        this.socketService.joinConversation(this.currentConversationId!);
      }, 200);
    }

    try {
      // Para obtener mensajes, necesitamos el ID real de la conversación en la DB
      // Primero intentamos obtener la conversación basada en el conversationId (formato "userId1-userId2")
      if (!this.currentConversationId) {
        this.showWelcomeMessage();
        return;
      }

      const [user1Id, user2Id] = this.currentConversationId.toString().split('-').map(Number);

      console.log('🔍 Loading messages for users:', user1Id, user2Id);

      // Buscar la conversación real en la base de datos
      const conversations = await this.apiClient
        .get<any[]>(`${API_ENDPOINTS.CONVERSATIONS.BASE}`)
        .toPromise();

      let realConversationId = null;
      if (conversations) {
        const conversation = conversations.find(
          conv =>
            (conv.usuario_1_id === user1Id && conv.usuario_2_id === user2Id) ||
            (conv.usuario_1_id === user2Id && conv.usuario_2_id === user1Id),
        );
        realConversationId = conversation?.id;
      }

      console.log('🔍 Real conversation ID:', realConversationId);

      if (realConversationId) {
        // Intentar cargar mensajes reales de la API usando el ID real de la conversación
        const messages = await this.apiClient
          .get<
            Message[]
          >(`${API_ENDPOINTS.MESSAGES.BASE}?conversacion_id=${realConversationId}&order=asc`)
          .toPromise();

        if (messages && messages.length > 0) {
          console.log('✅ Messages loaded:', messages);
          this.messages.set(messages);
          // Hacer scroll después de cargar mensajes
          setTimeout(() => {
            this.scrollToBottom();
          }, 200);
        } else {
          console.log('📭 No messages found, showing welcome message');
          this.showWelcomeMessage();
        }
      } else {
        console.log('📭 No conversation found in DB, showing welcome message');
        this.showWelcomeMessage();
      }
    } catch (error) {
      console.log('❌ Error loading messages:', error);
      this.showWelcomeMessage();
    }
  }

  private scrollToBottom(): void {
    try {
      // Usar setTimeout para asegurar que el DOM se haya actualizado
      setTimeout(() => {
        if (this.messagesContainer) {
          const element = this.messagesContainer.nativeElement;
          element.scrollTop = element.scrollHeight;
          console.log('📜 Auto-scroll realizado hacia abajo');
        }
      }, 0);
    } catch (err) {
      console.error('Error al hacer scroll:', err);
    }
  }

  private showWelcomeMessage(): void {
    const welcomeMessage: Message = {
      id: 0,
      conversacion_id: this.conversation?.id || 0,
      emisor_id: this.conversation?.otherUserId || this.conversation?.userId || 0,
      contenido: `¡Hola! Inicia una conversación con ${this.conversation?.name || 'este usuario'}`,
      leido: false,
      enviado_en: new Date().toISOString(),
    };
    this.messages.set([welcomeMessage]);

    // Hacer scroll después de mostrar mensaje de bienvenida
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  sendMessage() {
    const messageText = this.newMessage().trim();
    if (!messageText || !this.currentUser() || !this.currentConversationId) {
      console.log('❌ No se puede enviar mensaje:', {
        messageText: !!messageText,
        currentUser: !!this.currentUser(),
        conversationId: this.currentConversationId,
      });
      return;
    }

    console.log('📤 Enviando mensaje:', {
      conversationId: this.currentConversationId,
      message: messageText,
      userId: this.currentUser()?.id,
    });

    // Enviar via socket (el mensaje llegará via onNewMessage y se agregará automáticamente)
    this.socketService.sendMessage(this.currentConversationId, messageText);

    // Limpiar el input
    this.newMessage.set('');

    // Hacer scroll inmediatamente cuando el usuario envía un mensaje
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  updateNewMessage(event: Event) {
    const target = event.target as HTMLInputElement;
    this.newMessage.set(target.value);
  }

  isMyMessage(message: Message): boolean {
    return message.emisor_id === this.currentUser()?.id; // Cambiado de usuario_id a emisor_id
  }
}
