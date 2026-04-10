import {createReducer, on} from "@ngrx/store";
import {CommonActions} from "./actions";
import {DEFAULT_APP_SETTINGS, IAppSettings} from "@models/common.model";

export interface CommonState {
  initialized: boolean;
  setting: IAppSettings;
}

const initialState: CommonState = {
  initialized: false,
  setting: DEFAULT_APP_SETTINGS,
};

export const commonReducer = createReducer(
  initialState,
  on(CommonActions.initialize, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
);
