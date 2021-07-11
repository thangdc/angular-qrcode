import { createAction, props } from "@ngrx/store";
import { User } from "src/app/modules/core/models";

const SIGNIN = "[Authentication] Signin";
const SIGNIN_SUCCEED = "[Authentication] Signin Succeed";
const SIGNIN_FAILED = "[Authentication] Signin Failed";

export const signin = createAction(
    SIGNIN,
    props<{ payload: User }>()
);

export const signinSucceed = createAction(
    SIGNIN_SUCCEED,
    props<User>()
);

export const signinFailed = createAction(
    SIGNIN_FAILED,
    props<any>()
); 