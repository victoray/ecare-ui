import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { useSelector } from "react-redux";
import { selectToken } from "../store/auth";
import { useMemo } from "react";

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

const commonConfig: AxiosRequestConfig = {
  baseURL: process.env.REACT_APP_API_URL || "https://ecare247.herokuapp.com",
};

export class Api {
  client: AxiosInstance;
  publicClient: AxiosInstance;
  private token: string;

  constructor(token: string) {
    this.token = token;

    this.publicClient = axios.create(commonConfig);
    this.client = axios.create({
      ...commonConfig,
      headers: {
        Authorization: `JWT ${token}`,
      },
    });
    this.client.interceptors.response.use((response) => response.data);
    this.publicClient.interceptors.response.use((response) => response.data);
  }
}

export const useApi = (): Api => {
  const token = useSelector(selectToken);

  return useMemo(() => {
    return new Api(token);
  }, [token]);
};
