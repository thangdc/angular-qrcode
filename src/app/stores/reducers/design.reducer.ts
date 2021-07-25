import { Action, createReducer, on } from '@ngrx/store';
import { ShapeModel } from 'src/app/shared/models';
import * as DesignAction from '../actions/design.action';

export interface DesignState {
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
    on(DesignAction.updateTemplateAction, (state, action) => ({...state, events: { ...state.events, template: action.payload } })),
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
    on(DesignAction.exportDesignAction, (state, action) => ({...state, events: { ...state.events, export: action.payload }}))
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