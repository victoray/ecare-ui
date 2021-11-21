import React, { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store";
import { keyBy } from "lodash";
import MapboxSearch from "./MapBoxSearch";
import { createAction, createReducer } from "@reduxjs/toolkit";

import { Point } from "geojson";

export type MapBoxFeature = {
  id: string;
  type: "Feature";
  place_type: Array<string>;
  text: string;
  place_name: string;
  center: [number, number];
  geometry: Point;
};

// STATE
export type SearchState = {
  address: string;
  suggestions: Record<string, MapBoxFeature>;
  highlighted: string | null;
  opened: boolean;
};

export const initialState: SearchState = {
  address: "",
  suggestions: {},
  highlighted: null,
  opened: false,
};

// ACTIONS

const changeAddress = createAction<string>("SEARCH/CHANGE_ADDRESS");
const suggest = createAction<Array<MapBoxFeature>>("SEARCH/SUGGEST");
const selectFeature = createAction<MapBoxFeature>("SEARCH/SELECT_FEATURE");
const highlight = createAction<string | null>("SEARCH/HIGHLIGHT");
const open = createAction<boolean>("SEARCH/OPEN");

// REDUCERS

export const searchReducer = createReducer<SearchState>(
  initialState,
  (builder) => {
    builder
      .addCase(changeAddress, (state, { payload }) => {
        return {
          ...state,
          address: payload,
          suggestions: payload.trim() === "" ? {} : state.suggestions,
        };
      })
      .addCase(suggest, (state, { payload }) => {
        return {
          ...state,
          suggestions: keyBy(payload, "id"),
        };
      })
      .addCase(highlight, (state, { payload }) => {
        return {
          ...state,
          highlighted: payload,
        };
      })
      .addCase(open, (state, { payload }) => {
        return {
          ...state,
          opened: payload,
        };
      });
  }
);

// SELECTORS

export const selectSuggestions = (
  state: RootState
): Record<string, MapBoxFeature> => {
  return {};
};

const Search: FC = () => {
  const dispatch = useDispatch();
  const suggestions = useSelector(selectSuggestions);

  return (
    <MapboxSearch
      onSearchComplete={(features) => dispatch(suggest(features))}
      onDropdownVisibleChange={(opened) => dispatch(open(opened))}
      onSelect={(featureId) =>
        dispatch(selectFeature(suggestions[featureId.id]))
      }
      onMouseEnter={(featureId) => dispatch(highlight(featureId))}
      onMouseLeave={() => dispatch(highlight(null))}
    />
  );
};

export default Search;
