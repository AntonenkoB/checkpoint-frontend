import {EAuthPages} from "../../features/auth/models/router.model";
import {EUserPages} from "../../features/users/models/user.model";

export enum EAppPages {
  Auth = 'auth',
  Users = 'users',
}

export enum ERoutParams {
  UserId = 'userId'
}

export type TRouter = EAppPages | EAuthPages | EUserPages | string | number;