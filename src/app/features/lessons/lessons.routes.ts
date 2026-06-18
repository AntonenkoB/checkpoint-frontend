import {Routes} from '@angular/router';
import {ELessonPages} from "@lessons/models/lessons.model";
import {ERoutParams} from "@models/router.model";

export const routesLessons: Routes = [
  {
    path: ELessonPages.LessonType,
    loadComponent: () =>
      import('./pages/lessons-type/lessons-type.component').then((m) => m.LessonsTypeComponent),
  },
  {
    path: ELessonPages.SelectTeacher,
    loadComponent: () =>
      import('./pages/select-teacher/select-teacher.component').then((m) => m.SelectTeacherComponent),
  },
  {
    path: `:${ERoutParams.TeacherId}/${ELessonPages.RecordTime}`,
    loadComponent: () =>
      import('./pages/record-time/record-time.component').then((m) => m.RecordTimeComponent),
  },
  {
    path: ELessonPages.LessonTransferringType,
    loadComponent: () =>
      import('./pages/lesson-transferring-type/lesson-transferring-type.component').then((m) => m.LessonTransferringTypeComponent),
  },
  {
    path: ELessonPages.LessonTransferringSuccess,
    loadComponent: () =>
      import('./pages/lesson-transferring-success/lesson-transferring-success.component').then((m) => m.LessonTransferringSuccessComponent),
  },
  {
    path: ELessonPages.LessonCanceled,
    loadComponent: () =>
      import('./pages/lesson-canceled/lesson-canceled.component').then((m) => m.LessonCanceledComponent),
  },
  {
    path: ELessonPages.LessonSuccess,
    loadComponent: () =>
      import('./pages/lessons-success/lessons-success.component').then((m) => m.LessonsSuccessComponent),
  },
  {
    path: '',
    redirectTo: ELessonPages.LessonType,
    pathMatch: 'full',
  },
];

export default routesLessons;