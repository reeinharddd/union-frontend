import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface Conversation {
  id: number;
  participants: string[];
  title: string;
  lastMessage: string;
  lastMessageDate: Date;
  messageCount: number;
  status: 'active' | 'archived' | 'flagged';
  type: 'project' | 'forum' | 'general';
}

@Component({
  selector: 'app-admin-conversations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <div class="mb-6 flex items-center justify-between">
        <h1 class="text-3xl font-bold text-gray-900">Gestión de Conversaciones</h1>
        <div class="flex gap-3">
          <select
            [(ngModel)]="selectedFilter"
            (ngModelChange)="applyFilter()"
            class="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas las conversaciones</option>
            <option value="active">Activas</option>
            <option value="archived">Archivadas</option>
            <option value="flagged">Reportadas</option>
          </select>
          <input
            [(ngModel)]="searchTerm"
            (ngModelChange)="applyFilter()"
            placeholder="Buscar conversaciones..."
            class="rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <!-- Statistics Cards -->
      <div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <div class="rounded-lg bg-white p-6 shadow">
          <div class="flex items-center">
            <div class="rounded-full bg-blue-100 p-3 text-blue-600">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.955 8.955 0 01-2.616-.388l-3.135.938.937-3.135A8.002 8.002 0 013 12c0-4.418 3.582-8 8-8s8 3.582 8 8z"
                ></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Total Conversaciones</p>
              <p class="text-2xl font-semibold text-gray-900">{{ totalConversations() }}</p>
            </div>
          </div>
        </div>

        <div class="rounded-lg bg-white p-6 shadow">
          <div class="flex items-center">
            <div class="rounded-full bg-green-100 p-3 text-green-600">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Activas</p>
              <p class="text-2xl font-semibold text-gray-900">{{ activeConversations() }}</p>
            </div>
          </div>
        </div>

        <div class="rounded-lg bg-white p-6 shadow">
          <div class="flex items-center">
            <div class="rounded-full bg-yellow-100 p-3 text-yellow-600">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                ></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Reportadas</p>
              <p class="text-2xl font-semibold text-gray-900">{{ flaggedConversations() }}</p>
            </div>
          </div>
        </div>

        <div class="rounded-lg bg-white p-6 shadow">
          <div class="flex items-center">
            <div class="rounded-full bg-purple-100 p-3 text-purple-600">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7"
                ></path>
              </svg>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-600">Archivadas</p>
              <p class="text-2xl font-semibold text-gray-900">{{ archivedConversations() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Conversations Table -->
      <div class="overflow-hidden rounded-lg bg-white shadow">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Conversación
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Participantes
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Tipo
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Mensajes
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Estado
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Última Actividad
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              @for (conversation of filteredConversations(); track conversation.id) {
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4">
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ conversation.title }}</div>
                      <div class="max-w-xs truncate text-sm text-gray-500">
                        {{ conversation.lastMessage }}
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex flex-wrap gap-1">
                      @for (
                        participant of conversation.participants.slice(0, 3);
                        track participant
                      ) {
                        <span
                          class="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800"
                        >
                          {{ participant }}
                        </span>
                      }
                      @if (conversation.participants.length > 3) {
                        <span
                          class="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800"
                        >
                          +{{ conversation.participants.length - 3 }}
                        </span>
                      }
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <span
                      class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                      [ngClass]="{
                        'bg-blue-100 text-blue-800': conversation.type === 'project',
                        'bg-green-100 text-green-800': conversation.type === 'forum',
                        'bg-gray-100 text-gray-800': conversation.type === 'general',
                      }"
                    >
                      {{ getTypeLabel(conversation.type) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900">
                    {{ conversation.messageCount }}
                  </td>
                  <td class="px-6 py-4">
                    <span
                      class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                      [ngClass]="{
                        'bg-green-100 text-green-800': conversation.status === 'active',
                        'bg-gray-100 text-gray-800': conversation.status === 'archived',
                        'bg-red-100 text-red-800': conversation.status === 'flagged',
                      }"
                    >
                      {{ getStatusLabel(conversation.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500">
                    {{ conversation.lastMessageDate | date: 'short' }}
                  </td>
                  <td class="px-6 py-4 text-sm font-medium">
                    <div class="flex space-x-2">
                      <button
                        (click)="viewConversation(conversation)"
                        class="text-blue-600 hover:text-blue-900"
                      >
                        Ver
                      </button>
                      @if (conversation.status === 'active') {
                        <button
                          (click)="archiveConversation(conversation)"
                          class="text-yellow-600 hover:text-yellow-900"
                        >
                          Archivar
                        </button>
                      } @else if (conversation.status === 'archived') {
                        <button
                          (click)="reactivateConversation(conversation)"
                          class="text-green-600 hover:text-green-900"
                        >
                          Reactivar
                        </button>
                      }
                      @if (conversation.status === 'flagged') {
                        <button
                          (click)="resolveFlag(conversation)"
                          class="text-purple-600 hover:text-purple-900"
                        >
                          Resolver
                        </button>
                      }
                      <button
                        (click)="deleteConversation(conversation)"
                        class="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="px-6 py-4 text-center text-gray-500">
                    No se encontraron conversaciones
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class AdminConversationsComponent implements OnInit {
  conversations = signal<Conversation[]>([]);
  filteredConversations = signal<Conversation[]>([]);
  selectedFilter = 'all';
  searchTerm = '';

  ngOnInit() {
    this.loadMockData();
  }

  private loadMockData() {
    const mockConversations: Conversation[] = [
      {
        id: 1,
        participants: ['Ana Torres', 'Carlos Mendez', 'Sofia Rodriguez'],
        title: 'Proyecto de Inteligencia Artificial',
        lastMessage: 'Necesitamos revisar el algoritmo de machine learning...',
        lastMessageDate: new Date('2024-01-15T14:30:00'),
        messageCount: 47,
        status: 'active',
        type: 'project',
      },
      {
        id: 2,
        participants: ['Luis Hernandez', 'Maria Gonzalez'],
        title: 'Discusión sobre Blockchain',
        lastMessage: 'La implementación de smart contracts es clave...',
        lastMessageDate: new Date('2024-01-14T09:15:00'),
        messageCount: 23,
        status: 'active',
        type: 'forum',
      },
      {
        id: 3,
        participants: ['Pedro Martinez', 'Laura Silva', 'Diego Ramos', 'Isabel Vega'],
        title: 'Desarrollo Web Colaborativo',
        lastMessage: 'El frontend está casi listo, falta integrar...',
        lastMessageDate: new Date('2024-01-13T16:45:00'),
        messageCount: 89,
        status: 'flagged',
        type: 'project',
      },
      {
        id: 4,
        participants: ['Roberto Flores', 'Carmen Ruiz'],
        title: 'Consulta General',
        lastMessage: 'Gracias por la información compartida',
        lastMessageDate: new Date('2024-01-10T11:20:00'),
        messageCount: 12,
        status: 'archived',
        type: 'general',
      },
    ];

    this.conversations.set(mockConversations);
    this.filteredConversations.set(mockConversations);
  }

  applyFilter() {
    let filtered = this.conversations();

    if (this.selectedFilter !== 'all') {
      filtered = filtered.filter(conv => conv.status === this.selectedFilter);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        conv =>
          conv.title.toLowerCase().includes(term) ||
          conv.participants.some(p => p.toLowerCase().includes(term)) ||
          conv.lastMessage.toLowerCase().includes(term),
      );
    }

    this.filteredConversations.set(filtered);
  }

  totalConversations = () => this.conversations().length;
  activeConversations = () => this.conversations().filter(c => c.status === 'active').length;
  flaggedConversations = () => this.conversations().filter(c => c.status === 'flagged').length;
  archivedConversations = () => this.conversations().filter(c => c.status === 'archived').length;

  getTypeLabel(type: string): string {
    const labels = {
      project: 'Proyecto',
      forum: 'Foro',
      general: 'General',
    };
    return labels[type as keyof typeof labels] || type;
  }

  getStatusLabel(status: string): string {
    const labels = {
      active: 'Activa',
      archived: 'Archivada',
      flagged: 'Reportada',
    };
    return labels[status as keyof typeof labels] || status;
  }

  viewConversation(conversation: Conversation) {
    // TODO: Implementar vista detallada de conversación
    // Navegar a vista detallada: /admin/conversations/${conversation.id}
    alert(`Ver conversación: ${conversation.title}`);
  }

  archiveConversation(conversation: Conversation) {
    const updated = this.conversations().map(c =>
      c.id === conversation.id ? { ...c, status: 'archived' as const } : c,
    );
    this.conversations.set(updated);
    this.applyFilter();
  }

  reactivateConversation(conversation: Conversation) {
    const updated = this.conversations().map(c =>
      c.id === conversation.id ? { ...c, status: 'active' as const } : c,
    );
    this.conversations.set(updated);
    this.applyFilter();
  }

  resolveFlag(conversation: Conversation) {
    const updated = this.conversations().map(c =>
      c.id === conversation.id ? { ...c, status: 'active' as const } : c,
    );
    this.conversations.set(updated);
    this.applyFilter();
  }

  deleteConversation(conversation: Conversation) {
    if (confirm('¿Estás seguro de que deseas eliminar esta conversación?')) {
      const updated = this.conversations().filter(c => c.id !== conversation.id);
      this.conversations.set(updated);
      this.applyFilter();
    }
  }
}
