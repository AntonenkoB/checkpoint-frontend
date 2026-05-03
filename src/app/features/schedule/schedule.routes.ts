import {Routes} from '@angular/router';
import {ERoutParams} from "@models/router.model";
import {ESchedulePages} from "./models/schedule.model";

export const routesSchedule: Routes = [
  {
    path: `${ESchedulePages.TransferringLesson}`,
    loadComponent: () =>
      import('./pages/transferring-lesson/transferring-lesson.component').then((m) => m.TransferringLessonComponent),
  },
  {
    path: `${ESchedulePages.LessonCanceled}`,
    loadComponent: () =>
      import('./pages/lesson-canceled/lesson-canceled.component').then((m) => m.LessonCanceledComponent),
  },
  {
    path: `${ESchedulePages.RecordStudent}`,
    loadComponent: () =>
      import('./pages/record-student/record-student.component').then((m) => m.RecordStudentComponent),
  },
  {
    path: `${ESchedulePages.RecordTime}`,
    loadComponent: () =>
      import('./pages/record-time/record-time.component').then((m) => m.RecordTimeComponent),
  },
  {
    path: `:${ERoutParams.UserId}`,
    loadComponent: () =>
        import('./pages/schedule/schedule.component').then((m) => m.ScheduleComponent),
  },
  // {
  //   path: `${ESchedulePages.List}/:${ERoutParams.UserId}`,
  //   loadComponent: () =>
  //       import('./pages/schedule-list/schedule-list.component').then((m) => m.ScheduleListComponent),
  // },
  {
    path: '',
    redirectTo: `:${ERoutParams.UserId}`,
    pathMatch: 'full',
  },
];

export default routesSchedule;