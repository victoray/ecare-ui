import { createAction, createReducer } from "@reduxjs/toolkit";
import type { RootState } from "./index";

export type AuthState = {
  showSignUp: boolean;
  showLogin: boolean;
};

export const showSignUpModal = createAction("AUTH/SHOW_SIGN_UP_MODAL");
export const hideSignUpModal = createAction("AUTH/HIDE_SIGN_UP_MODAL");
export const showLoginModal = createAction("AUTH/SHOW_LOGIN_MODAL");
export const hideLoginModal = createAction("AUTH/HIDE_LOGIN_MODAL");

const initialState: AuthState = {
  showSignUp: false,
  showLogin: false,
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
    });
});

export const selectShowLogin = (state: RootState) => state.auth.showLogin;
export const selectShowSignUp = (state: RootState) => state.auth.showSignUp;
