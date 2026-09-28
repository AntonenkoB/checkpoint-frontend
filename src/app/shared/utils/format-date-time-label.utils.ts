const MS_IN_DAY = 86_400_000;

const timeFormatter = new Intl.DateTimeFormat('uk-UA', {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

const dayMonthFormatter = new Intl.DateTimeFormat('uk-UA', {
  day: '2-digit',
  month: 'long',
});

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function getCalendarDayDiff(target: Date, base: Date): number {
  return Math.round((startOfDay(target) - startOfDay(base)) / MS_IN_DAY);
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatDayMonth(date: Date): string {
  const parts = dayMonthFormatter.formatToParts(date);
  const day = parts.find((part) => part.type === 'day')?.value ?? '';
  const month = parts.find((part) => part.type === 'month')?.value ?? '';

  return `${day} ${capitalize(month)}`;
}

export function formatDateTimeLabel(isoString: string, now: Date = new Date()): string {
  if (!isoString) return '';

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';

  const time = timeFormatter.format(date);

  switch (getCalendarDayDiff(date, now)) {
    case 0:
      return time;
    case -1:
      return `Учора, ${time}`;
    case 1:
      return `Завтра, ${time}`;
    default:
      return `${formatDayMonth(date)}, ${time}`;
  }
}