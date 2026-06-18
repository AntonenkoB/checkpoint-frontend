import {Routes} from '@angular/router';
import {ERoutParams} from "@models/router.model";
import {ESchedulePages} from "./models/schedule.model";

export const routesSchedule: Routes = [
  {
    path: `${ESchedulePages.RecordStudent}`,
    loadComponent: () =>
      import('./pages/record-student/record-student.component').then((m) => m.RecordStudentComponent),
  },
  {
    path: `:${ERoutParams.UserId}`,
    loadComponent: () =>
        import('./pages/schedule/schedule.component').then((m) => m.ScheduleComponent),
  },
  {
    path: '',
    redirectTo: `:${ERoutParams.UserId}`,
    pathMatch: 'full',
  },
];

export default routesSchedule;