import {
    ActionReducerMap,
    createFeatureSelector,
    MetaReducer
} from '@ngrx/store';

import { environment } from '../../../environments/environment';
import * as Authentication from './auth.reducer';
import * as Design from './design.reducer';

export interface AppState {
    authentication: Authentication.AuthenticationState,
    design: Design.DesignState
}

export const initAppState: AppState = {
    authentication: Authentication.initialAuthenState,
    design: Design.initialDesignState
}

export const reducers: ActionReducerMap<AppState> = {
    authentication: Authentication.authenReducer,
    design: Design.designReducer
};
  
export const getAppStateFromFeature = createFeatureSelector<AppState>('appFeatures');  
export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
  
export * from './auth.reducer';
export * from './design.reducer';