import {IIncomingStudentLessons, IWeekGroupStudentLessons} from "@student/models/student.model";

export class StudentHelper {
  public static groupLessonsByWeek(data: IIncomingStudentLessons[]): IWeekGroupStudentLessons[] {
    const now     = new Date();
    const weekMap = new Map<string, { label: string; teacherMap: Map<number, IWeekGroupStudentLessons['week'][0]> }>();

    for (const { id, date, time, teacher } of data) {
      const weekStart = this.getWeekStart(new Date(date));
      const weekKey = weekStart.toISOString();

      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, {
          label: this.getWeekLabel(weekStart, now),
          teacherMap: new Map(),
        });
      }

      const week = weekMap.get(weekKey)!;
      const teacherIdKey = teacher ? teacher.id : 0;

      if (!week.teacherMap.has(teacherIdKey)) {
        week.teacherMap.set(teacherIdKey, {
          teacher,
          lessons: []
        });
      }

      week.teacherMap.get(teacherIdKey)!.lessons.push({ id, date, time });
    }

    return [...weekMap.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([_, { label, teacherMap }]) => ({
        label,
        week: [...teacherMap.values()],
      }));
  }

  private static getWeekStart(date: Date): Date {
    const d    = new Date(date);
    const day  = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private static getWeekLabel(weekStart: Date, now: Date): string {
    const currentWeekStart = this.getWeekStart(now);
    const nextWeekStart    = new Date(currentWeekStart);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);

    if (weekStart.getTime() === currentWeekStart.getTime()) return 'Цього тижня';
    if (weekStart.getTime() === nextWeekStart.getTime()) return 'Наступного тижня';

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);

    return `${this.formatDay(weekStart)} - ${this.formatDay(weekEnd)}`;
  }

  private static formatDay(date: Date): string {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    return `${d}.${m}`;
  }
}
