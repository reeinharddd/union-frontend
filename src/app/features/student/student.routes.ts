import { Routes } from '@angular/router';
// import { authGuard } from '@app/core/guards/user/auth.guard';
// import { roleGuard } from '@app/core/guards/user/role.guard';

export const STUDENT_ROUTES: Routes = [
  // {
  // path: '',
  // loadComponent: () => import('./layout/student-layout.component').then((m) => m.StudentLayoutComponent),
  // canActivate: [authGuard, roleGuard([2])], // ✅ Estudiante = 2
  // children: [
  // {
  //   path: '',
  //   redirectTo: 'dashboard',
  //   pathMatch: 'full',
  // },
  // {
  //   path: 'dashboard',
  //   loadComponent: () =>
  //     import('./dashboard/student-dashboard.component').then((m) => m.StudentDashboardComponent),
  // },
  // {
  //   path: 'projects',
  //   loadChildren: () => import('./projects/projects.routes').then((m) => m.STUDENT_PROJECTS_ROUTES),
  // },
  // {
  //   path: 'events',
  //   loadChildren: () => import('./events/events.routes').then((m) => m.STUDENT_EVENTS_ROUTES),
  // },
  // {
  //   path: 'opportunities',
  //   loadChildren: () => import('./opportunities/opportunities.routes').then((m) => m.STUDENT_OPPORTUNITIES_ROUTES),
  // },
  // {
  //   path: 'job-offers',
  //   loadChildren: () => import('./job-offers/job-offers.routes').then((m) => m.STUDENT_JOB_OFFERS_ROUTES),
  // },
  // {
  //   path: 'forum',
  //   loadChildren: () => import('./forum/forum.routes').then((m) => m.STUDENT_FORUM_ROUTES),
  // },
  // {
  //   path: 'profile',
  //   loadComponent: () =>
  //     import('./profile/student-profile.component').then((m) => m.StudentProfileComponent),
  // },
  // {
  //   path: 'messages',
  //   loadComponent: () =>
  //     import('./messages/student-messages.component').then((m) => m.StudentMessagesComponent),
  // },
  //   ],
  // },
];
