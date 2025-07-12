import { Routes } from '@angular/router';
import { Roles } from '@app/core/enums/roles';
import { roleGuard } from '@app/core/guards/user/role.guard';
import { PrivateLayoutComponent } from '@app/layouts/private-layout/private-layout.component';

export const STUDENT_ROUTES: Routes = [
  {
    path: '',
    component: PrivateLayoutComponent,
    canActivate: [roleGuard([Roles.USER, 'user', 'student'])], // Múltiples variantes
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
        path: 'courses',
        loadComponent: () =>
          import('./courses/course-list/course-list.component').then(m => m.CourseListComponent),
      },
      {
        path: 'courses/enroll',
        loadComponent: () =>
          import('./courses/course-enrollment/course-enrollment.component').then(
            m => m.CourseEnrollmentComponent,
          ),
      },
      {
        path: 'courses/:id',
        loadComponent: () =>
          import('./courses/course-detail/course-detail.component').then(
            m => m.CourseDetailComponent,
          ),
      },
      {
        path: 'events',
        loadComponent: () =>
          import('./events/event-list/event-list.component').then(m => m.EventListComponent),
      },
      {
        path: 'events/my-events',
        loadComponent: () =>
          import('./events/my-events/my-events.component').then(m => m.MyEventsComponent),
      },
      {
        path: 'opportunities',
        loadComponent: () =>
          import('./opportunities/opportunity-list/opportunity-list.component').then(
            m => m.OpportunityListComponent,
          ),
      },
      {
        path: 'forums',
        loadComponent: () =>
          import('./forums/forum-list/forum-list.component').then(m => m.ForumListComponent),
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./projects/project-list/project-list.component').then(
            m => m.ProjectListComponent,
          ),
      },
      {
        path: 'grades',
        loadComponent: () =>
          import('./grades/grades-list/grades-list.component').then(m => m.GradesListComponent),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./profile/student-profile/student-profile.component').then(
            m => m.StudentProfileComponent,
          ),
      },
    ],
  },
];
