import { combineReducers, createStore } from "@reduxjs/toolkit";
import { composeWithDevTools } from "redux-devtools-extension";

export const reducer = combineReducers({});

export type RootState = ReturnType<typeof reducer>;

const store = createStore(reducer, composeWithDevTools());

export default store;
