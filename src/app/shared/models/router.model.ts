import {EAuthPages} from "../../features/auth/models/router.model";
import {EUserPages} from "../../features/users/models/user.model";
import {ESchedulePages} from "../../features/schedule/models/schedule.model";
import {ERatePages} from "@rates/models/rates.model";

export enum EAppPages {
  Auth = 'auth',
  Users = 'users',
  Schedule = 'schedule',
  Market = 'market',
  Rates = 'rates',
}

export enum ERoutParams {
  UserId = 'userId',
  StudentId = 'userId',
  TeacherId = 'teacherId'
}

export type TRouter = EAppPages | EAuthPages | EUserPages | ESchedulePages | ERatePages | string | number | null;