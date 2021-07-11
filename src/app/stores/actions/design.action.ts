import { createAction, props } from "@ngrx/store";

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

const UPDATE_TEMPLATE = "[Design] Update template";

export const loadDataAction = createAction(
    LOAD_DATA
)

export const saveDataAction = createAction(
    SAVE_DATA,
    props<{payload: string}>()
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
    props<{payload: any}>()
)

export const addImageToStoreAction = createAction(
    ADD_IMAGE_TO_STORE,
    props<{payload: any}>()
)

export const loadImageAction = createAction(
    LOAD_IMAGE
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
    props<{ payload: any}>()
)

export const removeImageInStoreAction = createAction(
    REMOVE_IMAGE_IN_STORE,
    props<{ payload: any}>()
)

export const updateTemplateAction = createAction(
    UPDATE_TEMPLATE,
    props<{ payload: any}>()
)