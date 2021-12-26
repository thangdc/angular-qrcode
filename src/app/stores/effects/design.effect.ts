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
        switchMap(x => this.designService.loadData(x.templateId).pipe(
            map(data => {
                return DesignAction.loadDataSuccess({ payload: data });
            })
        ))
    ));
        
    saveData$ = createEffect(() => this.actions$.pipe(
        ofType(DesignAction.saveDataAction),
        switchMap(x => this.designService.saveData(x.templateId, x.payload).pipe(
          map(data => {
                return DesignAction.saveDataSuccess(data);
          })
        ))
    ));

    addImage$ = createEffect(() => this.actions$.pipe(
        ofType(DesignAction.addImageAction),
        switchMap(x => this.designService.addImage(x.templateId, x.payload).pipe(
            map(data => {
                return DesignAction.addImageToStoreAction(data);
            })
        ))
    ));

    loadImage$ = createEffect(() => this.actions$.pipe(
        ofType(DesignAction.loadImageAction),
        switchMap(x => this.designService.loadImages(x.templateId).pipe(
            map(data => {
                return DesignAction.saveImageToStoreAction({ payload: data});
            })
        ))
    ));

    removeImage$ = createEffect(() => this.actions$.pipe(
        ofType(DesignAction.removeImageAction),
        switchMap(x => this.designService.removeImage(x.templateId, x.payload).pipe(
            map(data => {
                return DesignAction.removeImageInStoreAction({ payload: data });
            })
        ))
    ));

    addShape$ = createEffect(() => this.actions$.pipe(
        ofType(DesignAction.addShapeAction),
        switchMap(x => this.designService.addShape(x.templateId, x.payload).pipe(
            map(data => {
                return DesignAction.saveShapeToStoreAction({payload: data});
            })
        ))
    ));

    getShape$ = createEffect(() => this.actions$.pipe(
        ofType(DesignAction.getShapesAction),
        switchMap(x => this.designService.getShapes(x.templateId).pipe(
            map(data => {
                return DesignAction.saveShapesToStoreAction({payload: data});
            })
        ))
    ));

    updateShape$ = createEffect(() => this.actions$.pipe(
        ofType(DesignAction.updateShapeAction),
        switchMap(x => this.designService.updateShape(x.templateId, x.payload).pipe(
            map(data => {
                return DesignAction.updateShapeToStoreAction({payload: data});
            })
        ))
    ));

    removeShape$ = createEffect(() => this.actions$.pipe(
        ofType(DesignAction.removeShapeAction),
        switchMap(x => this.designService.removeShape(x.templateId, x.id).pipe(
            map(() => {
                return DesignAction.removeShapeFromStoreAction({id: x.id});
            })
        ))
    ));

    getTemplates$ = createEffect(() => this.actions$.pipe(
        ofType(DesignAction.getTemplatesAction),
        switchMap(item => this.designService.getTemplates().pipe(
            map(data => {
                return DesignAction.saveTemplatesToStoreAction({ payload: data});
            })
        ))
    ));

    addTemplate$ = createEffect(() => this.actions$.pipe(
        ofType(DesignAction.addTemplateAction),
        switchMap(item => this.designService.addTemplate(item.payload).pipe(
            map(data => {
                return DesignAction.addTemplateToStoreAction({payload: data});
            })
        ))
    ));

    updateTemplate$ = createEffect(() => this.actions$.pipe(
        ofType(DesignAction.updateTemplateAction),
        switchMap(item => this.designService.updateTemplate(item.payload).pipe(
            map(data => {
                return DesignAction.updateTemplateToStoreAction({payload: data});
            })
        ))
    ));

    removeTemplate$ = createEffect(() => this.actions$.pipe(
        ofType(DesignAction.deleteTemplateAction),
        switchMap(item => this.designService.removeTemplate(item.id).pipe(
            map(data => {
                return DesignAction.deleteTemplateToStoreAction({id: item.id});
            })
        ))
    ));

    markTemplateAsDefault$ = createEffect(() => this.actions$.pipe(
        ofType(DesignAction.markTemplateAsDefaultAction),
        switchMap(item => this.designService.markTemplateAsDefault(item.id).pipe(
            map(data => {
                return DesignAction.saveTemplatesToStoreAction({ payload: data });
            })
        ))
    ));
}