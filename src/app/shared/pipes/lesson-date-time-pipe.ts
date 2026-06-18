import { Pipe, PipeTransform } from "@angular/core";
import {formatLessonToDateTime} from "@shared/utils/date.utils";
import {ILesson} from "@models/lesson.model";

@Pipe({
  name: "lessonDateTime",
})
export class LessonDateTimePipe implements PipeTransform {
  transform(lesson: ILesson | null | undefined): string {
    return formatLessonToDateTime(lesson);
  }
}
