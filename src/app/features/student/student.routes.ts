// Fabian Mendoza
import { Routes } from '@angular/router';
import { authGuard } from '@app/core/guards/user/auth.guard';
import { roleGuard } from '@app/core/guards/user/role.guard';

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
  {
    path: '',
    loadComponent: () =>
      import('../../layouts/private-layout/private-layout.component').then(
        m => m.PrivateLayoutComponent,
      ),
    canActivate: [authGuard, roleGuard([2])], // ✅ Estudiante = 2
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent),
      },

      {
        path: 'Addprojects',
        loadComponent: () =>
          import('./projects/add-project.component').then(m => m.AddProyectoComponent),
      },
      {
        path: 'projects/:id',
        loadComponent: () =>
          import('./projects/project-detail/project-detail.component').then(
            m => m.ProjectDetailComponent,
          ),
      },
      {
        path: 'opportunities',
        loadComponent: () =>
          import('./opportunities/opportunity-list/opportunity-list.component').then(
            m => m.OpportunityListComponent,
          ),
      },
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
      {
        path: 'forum',
        loadComponent: () =>
          import('./forums/forum-list/forum-list.component').then(m => m.StudentForumListComponent),
      },
      {
        path: 'forum/:id',
        loadComponent: () =>
          import('./forums/forum-discussions/forum-discussions.component').then(
            m => m.ForumDiscussionsComponent,
          ),
      },
      {
        path: 'forum/:id/conversations',
        loadComponent: () =>
          import('./forums/forum-conversations/forum-conversations.component').then(
            m => m.ForumConversationsComponent,
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./profile/student-profile/student-profile.component').then(
            m => m.StudentProfileComponent,
          ),
      },
      {
        path: 'projects/:projectId/colab',
        canActivate: [authGuard],
        loadComponent: () => import('./projects/colab/colab.component').then(m => m.ColabComponent),
      },
      // {
      //   path: 'public-profile',
      //   loadComponent: () =>
      //     import('./profile/student-public-profile/student-public-profile.component').then(
      //       m => m.StudentPublicProfileComponent,
      //     ),
      // },

      // {
      //   path: 'messages',
      //   loadComponent: () =>
      //     import('./messages/student-messages.component').then((m) => m.StudentMessagesComponent),
      // },
    ],
  },
];
