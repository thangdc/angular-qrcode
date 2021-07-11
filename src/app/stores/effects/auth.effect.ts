import { Injectable } from "@angular/core";
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from "src/app/modules/core";
import * as AuthAction from '../actions/auth.action';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions, 
    private authService: AuthService
  ) { }

  signin$ = createEffect(() => this.actions$.pipe(
    ofType(AuthAction.signin),
    switchMap(
      action => this.authService.signin(action.payload).pipe(
        map(user => {
          return AuthAction.signinSucceed(user);
        }),
        catchError(error => of(AuthAction.signinFailed(error)))
      )
    )
  ));
}