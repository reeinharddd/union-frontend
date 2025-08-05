// Fabian Mendoza
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
    ],
  },
];
