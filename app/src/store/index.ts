import {configureStore} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {reducers} from "./reducers";

export type Action<T, P> = { type: T, payload: P }

export const store = configureStore({preloadedState: {},reducer: reducers});
export type AppStore = typeof store;
export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = typeof store.dispatch;
store.subscribe(() => {
    localStorage.setItem("state", JSON.stringify(store.getState()));
});

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
