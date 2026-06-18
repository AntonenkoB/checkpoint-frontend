import { IIncomingStudentLessons, IWeekGroupStudentLessons } from "@student/models/student.model";

export type LessonFilterMode = 'future' | 'past' | 'all';

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDay(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  return `${d}.${m}`;
}

function getWeekLabel(weekStart: Date, now: Date): string {
  const currentWeekStart = getWeekStart(now);
  const nextWeekStart = new Date(currentWeekStart);
  nextWeekStart.setDate(nextWeekStart.getDate() + 7);

  if (weekStart.getTime() === currentWeekStart.getTime()) return 'Цього тижня';
  if (weekStart.getTime() === nextWeekStart.getTime()) return 'Наступного тижня';

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  return `${formatDay(weekStart)} - ${formatDay(weekEnd)}`;
}

/**
 * Перевіряє, чи підходить дата заняття під обраний режим фільтрації.
 */
function isDateMatchingMode(lessonDateStr: string, mode: LessonFilterMode, now: Date): boolean {
  if (mode === 'all') return true;

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const lessonDate = new Date(lessonDateStr);
  // Захист на випадок, якщо рядок дати з бекенду не розпарсився (Invalid Date)
  if (isNaN(lessonDate.getTime())) return false;

  lessonDate.setHours(0, 0, 0, 0);

  if (mode === 'future') {
    return lessonDate.getTime() >= today.getTime();
  }

  if (mode === 'past') {
    return lessonDate.getTime() <= today.getTime();
  }

  return true;
}

/**
 * Групує заняття студента по тижнях з фільтрацією за часом.
 * @param data — масив занять від бекенду
 * @param mode — режим фільтрації: 'future' | 'past' | 'all'
 * @param nowDateStr — опціональний рядок дати "відліку" у форматі YYYY-MM-DD (наприклад, '2026-05-05')
 */
export function groupLessonsByWeek(
  data: IIncomingStudentLessons[],
  mode: LessonFilterMode = 'future',
  nowDateStr?: string
): IWeekGroupStudentLessons[] {

  // Визначаємо опорну дату: або парсимо переданий рядок, або беремо поточний момент
  const now = nowDateStr ? new Date(nowDateStr) : new Date();

  // Якщо передали бітий рядок (наприклад, 'hello'), падаємо назад на поточну дату
  const validNow = isNaN(now.getTime()) ? new Date() : now;

  const weekMap = new Map<
    string,
    { label: string; teacherMap: Map<number, IWeekGroupStudentLessons['week'][0]> }
  >();

  for (const lesson of data) {
    if (!isDateMatchingMode(lesson.date, mode, validNow)) {
      continue;
    }

    const { id, date, time, teacher } = lesson;
    const weekStart = getWeekStart(new Date(date));
    const weekKey = weekStart.toISOString();

    if (!weekMap.has(weekKey)) {
      weekMap.set(weekKey, {
        label: getWeekLabel(weekStart, validNow),
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
    .sort(([a], [b]) => mode === 'past' ? b.localeCompare(a) : a.localeCompare(b))
    .map(([_, { label, teacherMap }]) => ({
      label,
      week: [...teacherMap.values()],
    }));
}