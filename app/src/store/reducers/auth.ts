import { createAction, createReducer } from "@reduxjs/toolkit";

export const setUserName = createAction<string>("topic/set_user_name");

export type AuthState = { userName: string; };
const initalAuthState: AuthState = { userName: "" };

const authReducer = createReducer<AuthState>(initalAuthState, (builder) => {
    builder.addCase(setUserName, (state, action) => {
        if (state) {
            state.userName = action.payload;
        }
    });
});

export default authReducer;
