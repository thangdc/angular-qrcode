import { Action, createReducer, on } from '@ngrx/store';
import { ShapeEnums } from 'src/app/modules/core/enums';
import * as DesignAction from '../actions/design.action';

export interface DesignState {
    templates: {}[];
    images: any[];
    shapes: {}[];
    selectShape: any;
    data: string;
    events: {
        image: any;
        template: any;
    }
}

export const initialDesignState: DesignState = {
    templates: [],
    images: [],
    shapes: [
        {
            shapeType: ShapeEnums.Rectangle,
            display: 'Hình vuông', 
            x: 10, 
            y: 50, 
            width: 100, 
            height: 100, 
            radius: 70, 
            stroke: '#62C5FF', 
            name: 'shape', 
            strokeWidth: 4, 
            draggable: true ,
            strokeScaleEnabled: false
        },
        { 
            shapeType: ShapeEnums.Circle,
            display: 'Hình tròn', 
            x: 100, 
            y: 100, 
            radius: 50, 
            stroke: '#62C5FF', 
            name: 'shape', 
            strokeWidth: 4, 
            draggable: true,
            strokeScaleEnabled: false
        },
        {
            shapeType: ShapeEnums.Text,
            display: 'Văn bản',
            x: 10, 
            y: 10, 
            text: "Danh ngôn\n\nHãy nhớ rằng nợ nần chỉ là một công cụ, giống như búa hoặc cưa. Nó có thể được sử dụng để giúp bạn xây dựng một tương lai tài chính vững mạnh, hoặc đẩy sụp tương lai ấy. Bạn là người quyết định mình muốn sử dụng nó như thế nào.", 
            fontSize: 18, 
            fontFamily: 'Calibri',
            fill: '#555',
            name: 'shape',
            width: 300,
            padding: 0,
            align: 'left',
            draggable: true
        },
        {
            shapeType: ShapeEnums.QRCode,
            x: 10,
            y: 10,
            display: 'Mã QR Code',
            text: 'http://www.thangdc.com',
            width: 100,
            height: 100,
            draggable: true,
            colorDark : "#000000",
            colorLight : "#ffffff"
        }
    ],
    selectShape: null,
    data: null,
    events: {
        image: null,
        template: null
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
);
  
export function designReducer(state: DesignState | undefined, action: Action) {
    return reducer(state, action);
}

export const getShapesReducer = (state: DesignState) => state.shapes;
export const getSelectShapeReducer = (state: DesignState) => state.selectShape;
export const getDataReducer = (state: DesignState) => state.data;

export const getImagesReducer = (state: DesignState) => state.images;
export const getDrawImageReducer = (state: DesignState) => state.events.image;
export const getTemplateReducer = (state: DesignState) => state.events.template;