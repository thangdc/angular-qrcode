import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { DesignService } from "src/app/shared/services/design.service";
import * as DesignAction from '../actions/design.action';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
export class DesignEffects {

    constructor(private actions$: Actions,
        private designService: DesignService) { }
    
    loadData$ = createEffect(() => this.actions$.pipe(
        ofType(DesignAction.loadDataAction),
        switchMap(() => this.designService.loadData().pipe(
            map(data => {
                return DesignAction.loadDataSuccess({ payload: data });
            })
        ))
    ));
        
    saveData$ = createEffect(() => this.actions$.pipe(
        ofType(DesignAction.saveDataAction),
        switchMap(action => this.designService.saveData(action.payload).pipe(
          map(data => {
                return DesignAction.saveDataSuccess(data);
          })
        ))
    ));

    addImage$ = createEffect(() => this.actions$.pipe(
        ofType(DesignAction.addImageAction),
        switchMap(action => this.designService.addImage(action.payload).pipe(
            map(data => {
                return DesignAction.addImageToStoreAction(data);
            })
        ))
    ));

    loadImage$ = createEffect(() => this.actions$.pipe(
        ofType(DesignAction.loadImageAction),
        switchMap(() => this.designService.loadImages().pipe(
            map(data => {
                return DesignAction.saveImageToStoreAction({ payload: data});
            })
        ))
    ));

    removeImage$ = createEffect(() => this.actions$.pipe(
        ofType(DesignAction.removeImageAction),
        switchMap(item => this.designService.removeImage(item.payload).pipe(
            map(data => {
                return DesignAction.removeImageInStoreAction({ payload: data });
            })
        ))
    ));
}