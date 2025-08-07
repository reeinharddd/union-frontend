import { inject, Injectable } from '@angular/core';
import { API_CONFIG } from '@app/core/constants/api-endpoints';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AuthService } from '../auth/auth.service';
import { TokenService } from '../auth/token.service';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket | null = null;
  private readonly authService = inject(AuthService);
  private readonly tokenService = inject(TokenService);
  private connectionStatus = new BehaviorSubject<boolean>(false);
  private isAuthenticated = false;
  private pendingJoins: string[] = [];

  constructor() {}

  connect(): void {
    if (this.socket?.connected) return;

    const currentUser = this.authService.currentUser();
    if (!currentUser) return;

    console.log('🔌 Connecting socket for user:', currentUser.id);

    // 🔄 Usar la URL base centralizada para WebSocket
    this.socket = io(API_CONFIG.WS_URL, {
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('🔌 Socket connected:', this.socket?.id);

      // Autenticar después de conectar usando TokenService
      const token = this.tokenService.getToken();
      console.log(
        '🔍 Token from TokenService:',
        token ? `${token.substring(0, 20)}...` : 'NO TOKEN FOUND',
      );

      if (token && this.socket) {
        console.log('🔐 Authenticating socket with token');
        this.socket.emit('authenticate', token);
      } else {
        console.error('❌ No token available for authentication');
      }

      this.connectionStatus.next(true);
    });

    this.socket.on('authenticated', response => {
      console.log('✅ Socket authentication response:', response);
      if (response.success) {
        this.isAuthenticated = true;

        // Procesar cualquier unión pendiente a conversaciones
        this.pendingJoins.forEach(conversationId => {
          this.joinConversation(conversationId);
        });
        this.pendingJoins = [];
      }
    });

    this.socket.on('joined-conversation', data => {
      console.log('✅ Successfully joined conversation:', data);
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
      this.isAuthenticated = false;
      this.connectionStatus.next(false);
    });

    this.socket.on('connect_error', error => {
      console.error('❌ Socket connection error:', error);
      this.connectionStatus.next(false);
    });

    this.socket.on('error', error => {
      console.error('❌ Socket error:', error);
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isAuthenticated = false;
      this.pendingJoins = [];
      this.connectionStatus.next(false);
    }
  }

  // Unirse a una conversación
  joinConversation(conversationId: string | number): void {
    if (!this.socket?.connected) {
      console.log('❌ Socket not connected, cannot join conversation');
      return;
    }

    // Si no está autenticado, agregar a la lista de espera
    if (!this.isAuthenticated) {
      console.log('⏳ Not authenticated yet, adding to pending joins:', conversationId);
      if (!this.pendingJoins.includes(conversationId.toString())) {
        this.pendingJoins.push(conversationId.toString());
      }
      return;
    }

    console.log(`🏠 Joining conversation: ${conversationId}`);
    this.socket.emit('join-conversation', conversationId);

    // Verificar que realmente nos hemos unido
    setTimeout(() => {
      console.log(`✅ Successfully joined conversation: ${conversationId}`);
    }, 100);
  }

  // Salir de una conversación
  leaveConversation(conversationId: string | number): void {
    if (this.socket?.connected) {
      console.log(`🚪 Leaving conversation: ${conversationId}`);
      this.socket.emit('leave-conversation', conversationId);
    }
  }

  // Enviar un mensaje
  sendMessage(conversationId: string | number, message: string): void {
    if (this.socket?.connected) {
      console.log(`📩 Sending message to conversation ${conversationId}:`, message);
      this.socket.emit('send-message', {
        conversationId,
        message,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.log('❌ Socket not connected, cannot send message');
    }
  }

  // Escuchar mensajes nuevos
  onNewMessage(): Observable<any> {
    return new Observable(observer => {
      if (this.socket) {
        console.log('🎧 Setting up new-message listener');
        this.socket.on('new-message', data => {
          console.log('📨 New message received via Socket.IO:', data);
          observer.next(data);
        });

        // También escuchar errores de Socket.IO
        this.socket.on('error', error => {
          console.error('❌ Socket.IO error:', error);
          observer.error(error);
        });
      } else {
        console.error('❌ Socket not available for message listening');
      }
    });
  }

  // Estado de conexión
  getConnectionStatus(): Observable<boolean> {
    return this.connectionStatus.asObservable();
  }

  // Verificar si está conectado
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}
