import { createAction, createReducer } from "@reduxjs/toolkit";
import type { RootState } from ".";

export type User = {
  uuid: string;
  email: string;
  dateOfBirth: string | null;
  emergencyContact: string | null;
  gender: string | null;
  governmentId: string | null;
  legalName: string | null;
  profileImage: string | null;
  role: string | null;
  roleType: "provider" | "patient" | null;
  username: string;
};
export type AuthState = {
  showSignUp: boolean;
  showLogin: boolean;
  token: string;
  user: User | null;
};

export const showSignUpModal = createAction("AUTH/SHOW_SIGN_UP_MODAL");
export const hideSignUpModal = createAction("AUTH/HIDE_SIGN_UP_MODAL");
export const showLoginModal = createAction("AUTH/SHOW_LOGIN_MODAL");
export const hideLoginModal = createAction("AUTH/HIDE_LOGIN_MODAL");
export const setToken = createAction<string>("AUTH/SET_TOKEN");
export const clearToken = createAction("AUTH/CLEAR_TOKEN");
export const setUser = createAction<User>("AUTH/SET_USER");

const initialState: AuthState = {
  showSignUp: false,
  showLogin: false,
  token: "",
  user: null,
};

export const authReducer = createReducer<AuthState>(initialState, (builder) => {
  return builder
    .addCase(showLoginModal, (state) => {
      return {
        ...state,
        showLogin: true,
      };
    })
    .addCase(showSignUpModal, (state) => {
      return {
        ...state,
        showSignUp: true,
      };
    })
    .addCase(hideLoginModal, (state) => {
      return {
        ...state,
        showLogin: false,
      };
    })
    .addCase(hideSignUpModal, (state) => {
      return {
        ...state,
        showSignUp: false,
      };
    })
    .addCase(setToken, (state, { payload }) => {
      return {
        ...state,
        token: payload,
        user: !payload ? null : state.user,
      };
    })
    .addCase(setUser, (state, { payload }) => {
      return {
        ...state,
        user: payload,
      };
    });
});

export const selectShowLogin = (state: RootState) => state.auth.showLogin;
export const selectShowSignUp = (state: RootState) => state.auth.showSignUp;
export const selectToken = (state: RootState) => state.auth.token;
export const selectIsSignedIn = (state: RootState) => {
  return Boolean(selectToken(state));
};
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsProvider = (state: RootState) =>
  state.auth.user?.roleType === "provider";
