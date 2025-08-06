import { Routes } from '@angular/router';
import { authGuard } from '@app/core/guards/user/auth.guard';
import { roleGuard } from '@app/core/guards/user/role.guard';
import { DynamicLayoutComponent } from '@app/layouts/dynamic-layout/dynamic-layout.component';

export const STUDENT_ROUTES: Routes = [
  {
    path: '',
    component: DynamicLayoutComponent,
    canActivate: [authGuard, roleGuard([2])], // ✅ Estudiante = 2
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
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
        path: 'projects',
        loadComponent: () =>
          import('./projects/project-list/project-list.component').then(
            m => m.ProjectListComponent,
          ),
      },
      {
        path: 'opportunities',
        loadComponent: () =>
          import('./opportunities/opportunity-list/opportunity-list.component').then(
            m => m.OpportunityListComponent,
          ),
      },
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
        path: 'project-detail/:id',
        loadComponent: () =>
          import('./projects/project-detail/project-detail.component').then(
            m => m.ProjectDetailComponent,
          ),
      },
      {
        path: 'projects/:projectId/colab',
        canActivate: [authGuard],
        loadComponent: () => import('./projects/colab/colab.component').then(m => m.ColabComponent),
      },
      {
        path: 'public-profile',
        loadComponent: () =>
          import('./profile/student-profile-public/student-profile-public.component').then(
            m => m.StudentProfilePublicComponent,
          ),
      },
      {
        path: 'public-profile/:id',
        loadComponent: () =>
          import('./profile/student-profile-public/student-profile-public.component').then(
            m => m.StudentProfilePublicComponent,
          ),
      },
      {
        path: 'events',
        loadComponent: () =>
          import('./events/event-list/event-list.component').then(m => m.EventListComponent),
      },
      {
        path: 'events/:id',
        loadComponent: () =>
          import('./events/event-detaill/event-detaill.component').then(
            m => m.EventDetaillComponent,
          ),
      },
      {
        path: 'my-register',
        loadComponent: () =>
          import('./events/my-register/my-register.component').then(m => m.MyRegisterComponent),
      },
    ],
  },
];
