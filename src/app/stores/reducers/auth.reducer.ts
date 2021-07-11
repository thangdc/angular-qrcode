import { Action, createReducer, on } from '@ngrx/store';
import { User } from "src/app/modules/core/models";
import * as AuthAction from '../actions/auth.action';

export interface AuthenticationState {
    user: User;
    isLoading: boolean;
    error: any;
}

export const initialAuthenState: AuthenticationState = {
    user: null,
    isLoading: false,
    error: null
}

const reducer = createReducer(
    initialAuthenState,
    on(AuthAction.signin, state => ({ ...state, isLoading: true })),
    on(AuthAction.signinSucceed, (state, payload) => ({ ...state, user: payload, error: null, isLoading: false })),
    on(AuthAction.signinFailed, (state, payload) => ({ ...state, error: payload, isLoading: false }))
  );
  
export function authenReducer(state: AuthenticationState | undefined, action: Action) {
    return reducer(state, action);
}
  
export const isLoading = (state: AuthenticationState) => state.isLoading;
export const getError = (state: AuthenticationState) => state.error;
export const getUser = (state: AuthenticationState) => state.user;
  