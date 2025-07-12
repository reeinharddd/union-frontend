import { Routes } from '@angular/router';

export const EVENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./event-list/event-list.component').then(m => m.EventListComponent),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./event-form/event-form.component').then(m => m.EventFormComponent),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./event-form/event-form.component').then(m => m.EventFormComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./event-detail/event-detail.component').then(m => m.EventDetailComponent),
  },
  // {
  //   path: 'attendances',
  //   loadComponent: () =>
  //     import('./event-attendances/event-attendances.component').then(m => m.EventAttendancesComponent),
  // },
];
