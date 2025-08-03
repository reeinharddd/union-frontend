import { Injectable, inject, signal } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { API_ENDPOINTS } from '../../constants/api-endpoints';
import { ApiClientService } from '../base/api-client.service';
import { ToastService } from '../ui/toast.service';

export interface Conversation {
  id: number;
  usuario_1_id: number;
  usuario_2_id: number;
  creado_en?: string;
  actualizado_en?: string;
}

export interface Message {
  id: number;
  conversacion_id: number;
  emisor_id: number; // Cambiado de usuario_id a emisor_id para coincidir con backend
  contenido: string;
  leido: boolean;
  enviado_en?: string; // Cambiado de creado_en a enviado_en para coincidir con backend
}

export interface CreateConversationRequest {
  usuario_1_id: number;
  usuario_2_id: number;
}

export interface CreateMessageRequest {
  conversacion_id: number;
  contenido: string;
  leido?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ConversationService {
  private readonly apiClient = inject(ApiClientService);
  private readonly toastService = inject(ToastService);
  private readonly _conversations = signal<Conversation[]>([]);
  private readonly _messages = signal<Message[]>([]);

  readonly conversations = this._conversations.asReadonly();
  readonly messages = this._messages.asReadonly();

  // Conversations
  getAllConversations(): Observable<Conversation[]> {
    console.log('🔄 ConversationService - Getting all conversations from API');
    return this.apiClient.get<Conversation[]>(API_ENDPOINTS.CONVERSATIONS.BASE).pipe(
      tap(conversations => {
        console.log('✅ Conversations loaded from API:', conversations.length);
        this._conversations.set(conversations);
      }),
      catchError(error => {
        console.error('❌ Failed to load conversations:', error);
        this.toastService.showError('Error al cargar las conversaciones');
        return throwError(() => error);
      }),
    );
  }

  getConversationById(id: number): Observable<Conversation | null> {
    console.log('🔄 ConversationService - Getting conversation by ID:', id);
    return this.apiClient.get<Conversation>(API_ENDPOINTS.CONVERSATIONS.BY_ID(id)).pipe(
      catchError(error => {
        console.error('❌ Failed to load conversation:', error);
        this.toastService.showError('Error al cargar la conversación');
        return throwError(() => error);
      }),
    );
  }

  createConversation(conversation: CreateConversationRequest): Observable<Conversation> {
    console.log('🔄 ConversationService - Creating conversation:', conversation);
    return this.apiClient.post<Conversation>(API_ENDPOINTS.CONVERSATIONS.BASE, conversation).pipe(
      tap(newConversation => {
        this._conversations.update(conversations => [...conversations, newConversation]);
        console.log('✅ Conversation created via API:', newConversation);
        this.toastService.showSuccess('Conversación creada exitosamente');
      }),
      catchError(error => {
        console.error('❌ Failed to create conversation:', error);
        this.toastService.showError('Error al crear la conversación');
        return throwError(() => error);
      }),
    );
  }

  // Messages
  getAllMessages(): Observable<Message[]> {
    console.log('🔄 ConversationService - Getting all messages from API');
    return this.apiClient.get<Message[]>(API_ENDPOINTS.MESSAGES.BASE).pipe(
      tap(messages => {
        console.log('✅ Messages loaded from API:', messages.length);
        this._messages.set(messages);
      }),
      catchError(error => {
        console.error('❌ Failed to load messages:', error);
        this.toastService.showError('Error al cargar los mensajes');
        return throwError(() => error);
      }),
    );
  }

  createMessage(message: CreateMessageRequest): Observable<Message> {
    console.log('🔄 ConversationService - Creating message:', message);
    return this.apiClient.post<Message>(API_ENDPOINTS.MESSAGES.BASE, message).pipe(
      tap(newMessage => {
        this._messages.update(messages => [...messages, newMessage]);
        console.log('✅ Message created via API:', newMessage);
        this.toastService.showSuccess('Mensaje enviado exitosamente');
      }),
      catchError(error => {
        console.error('❌ Failed to create message:', error);
        this.toastService.showError('Error al enviar el mensaje');
        return throwError(() => error);
      }),
    );
  }
}
