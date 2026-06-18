import { Pipe, PipeTransform } from "@angular/core";
import {formatDayTitle} from "@shared/utils/date.utils";

@Pipe({
  name: "dayTitle",
})
export class DayTitlePipe implements PipeTransform {
  transform(date: string): string {
    return formatDayTitle(date);
  }
}
