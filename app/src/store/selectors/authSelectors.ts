import { createSelector } from "@reduxjs/toolkit";
import { getState } from "./baseSelectors";

const getAuthModel = createSelector([getState], (state) => state.authModel);
export const getUserName = createSelector([getAuthModel], (authModel) => {
    return authModel.userName;
});
