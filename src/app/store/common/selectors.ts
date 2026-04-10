import {createFeatureSelector, createSelector} from '@ngrx/store';
import {CommonState} from './reducer';

const selectCommonState = createFeatureSelector<CommonState>('common');

export const selectInitialized = createSelector(
  selectCommonState,
  (state: CommonState) => state.initialized
);