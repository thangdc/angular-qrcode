import { createAction, props } from "@ngrx/store";
import { ShapeModel, TemplateModel } from "src/app/shared/models";

const SAVE_DATA = "[Design] Save data";
const SAVE_DATA_SUCCESS = "[Design] Save data successfully";
const LOAD_DATA = "[Design] Load data";
const LOAD_DATA_SUCCESS = "[Design] Load data successfully";

const ADD_IMAGE = "[Design] Add image";
const ADD_IMAGE_TO_STORE = "[Design] Add image to storage";
const LOAD_IMAGE = "[Design] Load image";
const SAVE_IMAGE_TO_STORE = "[Design] Save image to store";

const DRAW_IMAGE = "[Desgin] Draw image";
const REMOVE_IMAGE = "[Design] Remove image";
const REMOVE_IMAGE_IN_STORE = "[Design] Remove image in store";

const ADD_SHAPE = "[Design] Add shape";
const SAVE_SHAPE_TO_STORE = "[Design] Save shape to store";
const GET_SHAPES = "[Design] Get shape";
const SAVE_SHAPES_TO_STORE = "[Design] Save shapes to store";

const UPDATE_SHAPE = "[Design] Update shape";
const UPDATE_SHAPE_TO_STORE = "[Design] Update shape to store";
const UPDATE_SHAPE_SUCCEED = "[Design] Update shape successfully";
const SELECT_SHAPE = "[Design] Select shape";
const REMOVE_SHAPE = "[Design] Remove shape";
const REMOVE_SHAPE_FROM_STORE = "[Design] Remove shape from store";
const SElECTED_SHAPE = "[Design] Selected shape";
const EXPORT_DESIGN = "[Design] Export design";

const GET_TEMPLATES = "[Design] Get template";
const ADD_TEMPLATE = "[Design] Add template";
const UPDATE_TEMPLATE = "[Design] Update template";
const DELETE_TEMPLATE = "[Desgin] Delete template";
const MARK_TEMPLATE_AS_DEFAULT = "[Design] Mark template as default";
const GET_DEFAULT_TEMPLATE = "[Desgin] Get default template";

const GET_TEMPLATES_TO_STORE = "[Design] Get template and update to store";
const ADD_TEMPLATE_TO_STORE = "[Design] Add template to store";
const UPDATE_TEMPLATE_TO_STORE = "[Design] Update template to store";
const DELETE_TEMPLATE_TO_STORE = "[Desgin] Delete template to store";


export const loadDataAction = createAction(
    LOAD_DATA,
    props<{ templateId: number }>()
)

export const saveDataAction = createAction(
    SAVE_DATA,
    props<{ templateId: number, payload: string}>()
)

export const saveDataSuccess = createAction(
    SAVE_DATA_SUCCESS,
    props<{payload: string}>()
)

export const loadDataSuccess = createAction(
    LOAD_DATA_SUCCESS,
    props<{payload: string}>()
)

export const addImageAction = createAction(
    ADD_IMAGE,
    props<{ templateId: number, payload: any }>()
)

export const addImageToStoreAction = createAction(
    ADD_IMAGE_TO_STORE,
    props<{payload: any}>()
)

export const loadImageAction = createAction(
    LOAD_IMAGE,
    props<{ templateId: number }>()
)

export const saveImageToStoreAction = createAction(
    SAVE_IMAGE_TO_STORE,
    props<{ payload: any }>()
)

export const drawImageAction = createAction(
    DRAW_IMAGE,
    props<{ payload: any }>()
)

export const removeImageAction = createAction(
    REMOVE_IMAGE,
    props<{ templateId: number, payload: any}>()
)

export const removeImageInStoreAction = createAction(
    REMOVE_IMAGE_IN_STORE,
    props<{ payload: any}>()
)

export const getTemplatesAction = createAction(
    GET_TEMPLATES
)

export const saveTemplatesToStoreAction = createAction(
    GET_TEMPLATES_TO_STORE,
    props<{ payload: TemplateModel[] }>()
)

export const addTemplateAction = createAction(
    ADD_TEMPLATE,
    props<{ payload: TemplateModel }>()
)

export const addTemplateToStoreAction = createAction(
    ADD_TEMPLATE_TO_STORE,
    props<{ payload: TemplateModel }>()
)

export const updateTemplateAction = createAction(
    UPDATE_TEMPLATE,
    props<{ payload: TemplateModel }>()
)

export const updateTemplateToStoreAction = createAction(
    UPDATE_TEMPLATE_TO_STORE,
    props<{ payload: TemplateModel }>()
)

export const deleteTemplateAction = createAction(
    DELETE_TEMPLATE,
    props<{ id: number }>()
)

export const markTemplateAsDefaultAction = createAction(
    MARK_TEMPLATE_AS_DEFAULT,
    props<{ id: number }>()
)

export const getDefaultTemplateAction = createAction(
    GET_DEFAULT_TEMPLATE
)

export const deleteTemplateToStoreAction = createAction(
    DELETE_TEMPLATE_TO_STORE,
    props<{ id: number }>()
)

export const addShapeAction = createAction(
    ADD_SHAPE,
    props<{ templateId: number, payload: ShapeModel}>()
)

export const saveShapeToStoreAction = createAction(
    SAVE_SHAPE_TO_STORE,
    props<{ payload: ShapeModel}>()
)

export const getShapesAction = createAction(
    GET_SHAPES,
    props<{ templateId: number }>()
)

export const saveShapesToStoreAction = createAction(
    SAVE_SHAPES_TO_STORE,
    props<{ payload: any}>()
)

export const updateShapeAction = createAction(
    UPDATE_SHAPE,
    props<{ templateId: number, payload: any}>()
)

export const updateShapeToStoreAction = createAction(
    UPDATE_SHAPE_TO_STORE,
    props<{payload: any}>()
)

export const updateShapeSucceedAction = createAction(
    UPDATE_SHAPE_SUCCEED,
    props<{payload: any}>()
)

export const selectShapeAction = createAction(
    SELECT_SHAPE,
    props<{ id: number }>()
)

export const removeShapeAction = createAction(
    REMOVE_SHAPE,
    props<{ templateId: number, id: number }>()
)

export const removeShapeFromStoreAction = createAction(
    REMOVE_SHAPE_FROM_STORE,
    props<{ id: number }>()
)

export const selectedShapeAction = createAction(
    SElECTED_SHAPE
)

export const exportDesignAction = createAction(
    EXPORT_DESIGN,
    props<{ payload: any}>()
)