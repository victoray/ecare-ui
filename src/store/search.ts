import { createAction, createReducer } from "@reduxjs/toolkit";
import type { RootState } from ".";
import { Point } from "geojson";

type Coordinates = [number, number];

export type MapBoxFeature = {
  id: string;
  type: "Feature";
  place_type: Array<string>;
  text: string;
  place_name: string;
  center: [number, number];
  geometry: Point;
};
export type SearchParams = {
  feature?: MapBoxFeature;
  careProvider?: string;
};

const initialState: SearchParams = {};

export const setFeature = createAction<MapBoxFeature>("SEARCH/SET_COORDINATES");
export const setCareProvider = createAction<string>("SEARCH/SET_CARE_PROVIDER");
export const clearSearch = createAction("SEARCH/CLEAR_SEARCH");
export const setSearchParams = createAction<SearchParams>(
  "SEARCH/SET_SEARCH_PARAMS"
);

export const searchReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setFeature, (state, { payload }) => {
      return {
        ...state,
        feature: payload,
      };
    })
    .addCase(setCareProvider, (state, { payload }) => {
      return {
        ...state,
        careProvider: payload,
      };
    })
    .addCase(clearSearch, () => {
      return {};
    })
    .addCase(setSearchParams, (state, { payload }) => {
      return payload;
    });
});

export const selectSearchParams = (state: RootState) => state.search;
