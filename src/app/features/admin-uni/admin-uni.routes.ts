import { Routes } from '@angular/router';

import { PrivateLayoutComponent } from '@app/layouts/private-layout/private-layout.component';

export const ADMIN_UNI_ROUTES: Routes = [
  {
    path: '',
    component: PrivateLayoutComponent,
    children: [
      // // Dashboard
      // {
      //   path: '',
      //   loadComponent: () => import('./dashboard/admin-uni-dashboard.component').then(m => m.AdminUniDashboardComponent)
      // },

      // // Estudiantes
      // {
      //   path: 'students',
      //   loadComponent: () => import('./students/student-list/student-list.component').then(m => m.StudentListComponent)
      // },
      // {
      //   path: 'students/:id',
      //   loadComponent: () => import('./students/student-detail/student-detail.component').then(m => m.StudentDetailComponent)
      // },

      // // Cursos
      // {
      //   path: 'courses',
      //   loadComponent: () => import('./courses/course-list/course-list.component').then(m => m.CourseListComponent)
      // },
      // {
      //   path: 'courses/new',
      //   loadComponent: () => import('./courses/course-form/course-form.component').then(m => m.CourseFormComponent)
      // },
      // {
      //   path: 'courses/:id',
      //   loadComponent: () => import('./courses/course-detail/course-detail.component').then(m => m.CourseDetailComponent)
      // },
      // {
      //   path: 'courses/:id/edit',
      //   loadComponent: () => import('./courses/course-form/course-form.component').then(m => m.CourseFormComponent)
      // },

      // // Profesores
      // {
      //   path: 'teachers',
      //   loadComponent: () => import('./teachers/teacher-list/teacher-list.component').then(m => m.TeacherListComponent)
      // }
    ]
  }
];
