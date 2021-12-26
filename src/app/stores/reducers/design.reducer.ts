import { Action, createReducer, on } from '@ngrx/store';
import { ShapeModel, TemplateModel } from 'src/app/shared/models';
import * as DesignAction from '../actions/design.action';

export interface DesignState {
    templates: TemplateModel[];
    images: any[];
    shapes: ShapeModel[];
    data: string;    
    events: {
        image: any;
        template: any;
        shape: ShapeModel;
        export: any;
    }
}

export const initialDesignState: DesignState = {
    templates: [],
    images: [],
    shapes: [],
    data: null,
    events: {
        image: null,
        template: null,
        shape: null,
        export: null
    }
}

const reducer = createReducer(
    initialDesignState,
    on(DesignAction.loadDataSuccess, (state, action) => ({...state, data: action.payload })),
    on(DesignAction.addImageToStoreAction, (state, action) =>  ({...state, images: [...state.images, action ] })),
    on(DesignAction.saveImageToStoreAction, (state, action) => ({...state, images: action.payload ?? [] })),
    on(DesignAction.drawImageAction, (state, action) => ({...state, events: { ...state.events, image: action.payload } })),
    on(DesignAction.removeImageInStoreAction, (state, action) => ({...state, images: action.payload })),
    on(DesignAction.saveShapeToStoreAction, (state, action) => ({...state, shapes: [...state.shapes, action.payload ]})),
    on(DesignAction.saveShapesToStoreAction, (state, action) => ({...state, shapes: action.payload ?? [] })),
    on(DesignAction.updateShapeToStoreAction, (state, action) => {
        let index = state.shapes.map(x => x.id).indexOf(action.payload.id);
        const newArray = [...state.shapes];
        newArray[index] = action.payload;
        return {...state, shapes: newArray.sort((x, y) => x.index - y.index), events: { ...state.events, shape: action.payload } };
    }),
    on(DesignAction.updateShapeSucceedAction, (state, action) => ({...state, events: { ...state.events, shape: action.payload }})),
    on(DesignAction.selectShapeAction, (state, action) => {
        const item = state.shapes.find(x => x.id === action.id);
        return ({ ...state, events: { ...state.events, shape: item ?? null } });
    }),
    on(DesignAction.removeShapeFromStoreAction, (state, action) => {
        const shapes = state.shapes.filter(x => x.id !== action.id);
        return ({ ...state, shapes: shapes})
    }),
    on(DesignAction.exportDesignAction, (state, action) => ({...state, events: { ...state.events, export: action.payload }})),
    on(DesignAction.addTemplateToStoreAction, (state, action) => ({...state, templates: [...state.templates, action.payload ]})),
    on(DesignAction.updateTemplateToStoreAction, (state, action) => {
        let index = state.templates.map(x => x.id).indexOf(action.payload.id);
        const newArray = [...state.templates];
        newArray[index] = action.payload;
        return {...state, templates: newArray };
    }),
    on(DesignAction.deleteTemplateToStoreAction, (state, action) => {
        const templates = state.templates.filter(x => x.id !== action.id);
        return ({...state, templates: templates})
    }),
    on(DesignAction.saveTemplatesToStoreAction, (state, action) => {
        return ({...state, templates: action.payload})
    })
);
  
export function designReducer(state: DesignState | undefined, action: Action) {
    return reducer(state, action);
}

export const getDataReducer = (state: DesignState) => state.data;
export const getShapesReducer = (state: DesignState) => state.shapes;
export const getImagesReducer = (state: DesignState) => state.images;
export const getDrawImageReducer = (state: DesignState) => state.events?.image;
export const getTemplateReducer = (state: DesignState) => state.events?.template;
export const getShapeReducer = (state: DesignState) => state.events?.shape;
export const getExportReducer = (state: DesignState) => state.events?.export;
export const getTemplatesReducer = (state: DesignState) => state.templates;
export const getDefaultTemplateReducer = (state: DesignState) => state.templates.find(x => x.isDefault === true);