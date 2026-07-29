import { Pipe, PipeTransform } from "@angular/core";
import {formatPreviousLessonToDateTime} from "@shared/utils/date.utils";
import {INotificationPayload} from "@notifacations/models/notifications.model";

@Pipe({
  name: "lessonPreviousDateTime",
})
export class LessonPreviousDateTimePipe implements PipeTransform {
  transform(lesson: INotificationPayload | null | undefined): string {
    if (!lesson) {
      return ''
    }
    return formatPreviousLessonToDateTime(lesson?.previous_date, lesson?.previous_time.from, lesson?.previous_time.to);
  }
}
