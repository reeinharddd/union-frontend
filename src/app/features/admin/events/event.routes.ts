import { Routes } from '@angular/router';

export const EVENTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-events.component').then(m => m.AdminEventsComponent),
  },
];
