import { Pipe, PipeTransform } from "@angular/core";
import {formatLessonToDateTime} from "@shared/utils/date.utils";
import {ILesson} from "@models/lesson.model";
import {INotificationPayload} from "@notifacations/models/notifications.model";

@Pipe({
  name: "lessonDateTime",
})
export class LessonDateTimePipe implements PipeTransform {
  transform(lesson: ILesson | INotificationPayload | null | undefined): string {
    return formatLessonToDateTime(lesson);
  }
}
