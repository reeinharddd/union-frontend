import { Routes } from '@angular/router';

export const CONVERSATION_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./admin-conversations.component').then(m => m.AdminConversationsComponent),
  },
];
