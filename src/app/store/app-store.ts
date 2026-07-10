import {ActionReducerMap} from "@ngrx/store";
import {commonReducer, CommonState} from "./common/reducer";
import {CommonEffects} from "./common/effects";
import {routerFeatureReducer, RouterState} from "./router/reducer";
import {RouterEffects} from "./router/effects";
import {userReducer, UserState} from "../features/users/store/reduser";
import {UserEffects} from "../features/users/store/effects";

export interface AppState {
  common: CommonState
  router: RouterState
  users: UserState
}

export const appEffects = [
  CommonEffects,
  RouterEffects,
  UserEffects
];

export const appReducers: ActionReducerMap<AppState> = {
  common: commonReducer,
  router: routerFeatureReducer,
  users: userReducer
};
