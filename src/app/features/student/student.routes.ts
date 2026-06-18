import {Routes} from '@angular/router';
import {EStudentPages} from "./models/student.model";

export const routesStudent: Routes = [
  {
    path: EStudentPages.StudentDashboard,
    loadComponent: () =>
      import('./pages/student-dashboard/student-dashboard.component').then((m) => m.StudentDashboardComponent),
  },
  {
    path: EStudentPages.HistoryPurchases,
    loadComponent: () =>
      import('./pages/history-purchases/history-purchases.component').then((m) => m.HistoryPurchasesComponent),
  },
  {
    path: EStudentPages.HistoryLessons,
    loadComponent: () =>
      import('./pages/history-lessons/history-lessons.component').then((m) => m.HistoryLessonsComponent),
  },
  {
    path: '',
    redirectTo: EStudentPages.StudentDashboard,
    pathMatch: 'full',
  },
];

export default routesStudent;