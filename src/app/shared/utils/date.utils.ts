import { ILesson } from "@models/lesson.model";
import {INotificationPayload} from "@notifacations/models/notifications.model";

const resetTime = (d: Date): number =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

export function formatTimeWithMinutes(timeValue: string | number): string {
  const timeStr = String(timeValue);
  return timeStr.includes(':') ? timeStr : `${timeStr}:00`;
}

export function formatDayTitle(dateString: string): string {
  if (!dateString) return '';

  const targetDate = new Date(dateString.replace(/-/g, '/'));
  const today = new Date();

  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const targetTime = resetTime(targetDate);
  const todayTime = resetTime(today);
  const tomorrowTime = resetTime(tomorrow);

  const dayAndMonth = new Intl.DateTimeFormat('uk-UA', {
    day: 'numeric',
    month: 'long',
  }).format(targetDate);

  let dayName: string;

  if (targetTime === todayTime) {
    dayName = 'Сьогодні';
  } else if (targetTime === tomorrowTime) {
    dayName = 'Завтра';
  } else {
    dayName = new Intl.DateTimeFormat('uk-UA', { weekday: 'long' }).format(targetDate);
  }

  return `${dayName}, ${dayAndMonth}`;
}

export function formatPreviousLessonToDateTime(date: string, from: number, to: number): string {
  const dayTitle = formatDayTitle(date);
  const fromTime = formatTimeWithMinutes(from);
  const toTime = formatTimeWithMinutes(to);

  return `${dayTitle}, ${fromTime} - ${toTime}`;
}

export function formatLessonToDateTime(lesson: ILesson | INotificationPayload | null | undefined): string {
  if (!lesson || !lesson.date || !lesson.time) return '';

  const dayTitle = formatDayTitle(lesson.date);
  const fromTime = formatTimeWithMinutes(lesson.time.from);
  const toTime = formatTimeWithMinutes(lesson.time.to);

  return `${dayTitle}, ${fromTime} - ${toTime}`;
}

export function formatToDateTime(date: string, from: string | number, to: string | number): string {
  const dayTitle = formatDayTitle(date);
  const fromTime = formatTimeWithMinutes(from);
  const toTime = formatTimeWithMinutes(to);

  return `${dayTitle}, ${fromTime} - ${toTime}`;
}

export function getRangeDateTwoMonth(): {from: string, to: string} {
  const dateTo = new Date();
  dateTo.setMonth(dateTo.getMonth() + 2);

  const formatDate = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split('T')[0];
  };

  return {
    from: formatDate(new Date()),
    to: formatDate(dateTo)
  };
}

export function getCurrentMonth(): string {
  // const month = this.datePipe.transform(new Date(), 'yyyy-MM');

  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return `${year}-${month}`;
}