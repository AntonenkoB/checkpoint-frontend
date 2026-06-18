import {ITimeRange} from "@schedule/models/schedule.model";

export interface ILesson {
  id: number;
  date: string;
  time: ITimeRange;
}