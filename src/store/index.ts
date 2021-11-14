import { combineReducers, createStore } from "@reduxjs/toolkit";
import { composeWithDevTools } from "redux-devtools-extension";
import { authReducer } from "./auth";

export const reducer = combineReducers({
  auth: authReducer,
});

export type RootState = ReturnType<typeof reducer>;

const store = createStore(reducer, composeWithDevTools());

export default store;
