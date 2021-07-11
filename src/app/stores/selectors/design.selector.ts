import { createSelector } from '@ngrx/store';
import * as fromFeature from '../reducers';
import * as fromDesign from '../reducers/design.reducer';

export const getDesignState = createSelector(
  fromFeature.getAppStateFromFeature,
  (state: fromFeature.AppState) => state.design
);

export const getShapesSelector = createSelector(
  getDesignState,
  fromDesign.getShapesReducer
)

export const getSelectShapeSelector = createSelector(
  getDesignState,
  fromDesign.getSelectShapeReducer
)

export const getDataSelector = createSelector(
  getDesignState,
  fromDesign.getDataReducer
)

export const getImagesSelector = createSelector(
  getDesignState,
  fromDesign.getImagesReducer
)

export const getDrawImageSelector = createSelector(
  getDesignState,
  fromDesign.getDrawImageReducer
)

export const getTemplateSelector = createSelector(
  getDesignState,
  fromDesign.getTemplateReducer
)