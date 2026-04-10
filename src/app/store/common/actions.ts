import {createActionGroup, emptyProps, props} from "@ngrx/store";
import {IAppSettings} from "@models/common.model";

export const CommonActions = createActionGroup({
  source: 'Common',
  events: {
    initialize: emptyProps(),
    initializeSuccess: props<{ initialized: boolean }>(),
    initializeFailure: props<{ error: string }>(),
    setting: props<{ setting: IAppSettings }>(),
  }
});
