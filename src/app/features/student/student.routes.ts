import { Routes } from '@angular/router';
import { Roles } from '@app/core/enums/roles';
import { roleGuard } from '@app/core/guards/user/role.guard';
import { PrivateLayoutComponent } from '@app/layouts/private-layout/private-layout.component';

export const STUDENT_ROUTES: Routes = [
  {
    path: '',
    component: PrivateLayoutComponent,
    canActivate: [roleGuard([Roles.STUDENTS.toLowerCase()])],
    children: [
      // // Cursos matriculados
      // {
      //   path: 'courses',
      //   loadComponent: () => import('./courses/enrolled-courses/enrolled-courses.component').then(m => m.EnrolledCoursesComponent)
      // },
      // {
      //   path: 'courses/:id',
      //   loadComponent: () => import('./courses/course-detail/course-detail.component').then(m => m.CourseDetailComponent)
      // },
      // // Calificaciones
      // {
      //   path: 'grades',
      //   loadComponent: () => import('./grades/grades-list/grades-list.component').then(m => m.GradesListComponent)
      // },
      // // Perfil del estudiante
      // {
      //   path: 'profile',
      //   loadComponent: () => import('./profile/student-profile/student-profile.component').then(m => m.StudentProfileComponent)
      // },
      // // Inscripción a nuevos cursos
      // {
      //   path: 'enrollment',
      //   loadComponent: () => import('./enrollment/course-enrollment/course-enrollment.component').then(m => m.CourseEnrollmentComponent)
      // }
    ],
  },
];
