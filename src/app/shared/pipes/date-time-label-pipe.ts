import { Pipe, PipeTransform } from "@angular/core";
import {formatDateTimeLabel} from "@shared/utils/format-date-time-label.utils";

@Pipe({
  name: "dateTimeLabel",
})
export class DateTimeLabelPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    return value ? formatDateTimeLabel(value) : '';
  }
}
