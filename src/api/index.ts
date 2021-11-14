import axios, { AxiosResponse } from "axios";

const MAPBOX_URL = process.env.REACT_APP_MAPBOX_URL || "";

const MAPBOX_QUERY_PARAMS = {
  country: "NG",
  // types: "address",
  access_token: process.env.REACT_APP_MAPBOX_ACCESS_TOKEN,
};

export const getMapboxPlaces = (query: string): Promise<AxiosResponse> => {
  return axios.get(
    `${MAPBOX_URL}/mapbox.places/${query.replace(/\//g, "%2F")}.json`,
    {
      params: MAPBOX_QUERY_PARAMS,
    }
  );
};
