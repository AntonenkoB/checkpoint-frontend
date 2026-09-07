import {ActionReducerMap} from "@ngrx/store";
import {commonReducer, CommonState} from "./common/reducer";
import {CommonEffects} from "./common/effects";
import {routerFeatureReducer, RouterState} from "./router/reducer";
import {RouterEffects} from "./router/effects";

export interface AppState {
  common: CommonState
  router: RouterState
}

export const appEffects = [
  CommonEffects,
  RouterEffects,
];

export const appReducers: ActionReducerMap<AppState> = {
  common: commonReducer,
  router: routerFeatureReducer,
};
