import { createSelector } from "@reduxjs/toolkit";
import { AppState } from "@/store";

export const getState = createSelector(
  [(state: AppState) => state],
  (state) => state,
);
