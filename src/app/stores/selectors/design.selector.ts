import { createSelector } from '@ngrx/store';
import * as fromFeature from '../reducers';
import * as fromDesign from '../reducers/design.reducer';

export const getDesignState = createSelector(
  fromFeature.getAppStateFromFeature,
  (state: fromFeature.AppState) => state.design
);

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

export const getShapesSelector = createSelector(
  getDesignState,
  fromDesign.getShapesReducer
)

export const getShapeSelector = createSelector(
  getDesignState,
  fromDesign.getShapeReducer
)

export const getExportSelector = createSelector(
  getDesignState,
  fromDesign.getExportReducer
)

export const getTemplatesSelector = createSelector(
  getDesignState,
  fromDesign.getTemplatesReducer
)

export const getDefaultTemplateSelector = createSelector(
  getDesignState,
  fromDesign.getDefaultTemplateReducer
)