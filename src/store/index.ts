import { combineReducers, createStore } from "@reduxjs/toolkit";
import { composeWithDevTools } from "redux-devtools-extension";
import { authReducer } from "./auth";
import { searchReducer } from "./search";

export const reducer = combineReducers({
  auth: authReducer,
  search: searchReducer,
});

export type RootState = ReturnType<typeof reducer>;

const store = createStore(reducer, composeWithDevTools());

export default store;
