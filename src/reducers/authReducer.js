//import isEmpty from "../validation/is-empty";

import {
  CLEAR_CURRENT_USER,
  CLEAR_RESET_PASSWORD,
  CLEAR_UPDATE_USER,
  GET_ADMIN_USERS,
  GET_PRE_USER,
  GET_STATS,
  GET_USERS,
  LOADING,
  RESET_PASSWORD,
  SET_CURRENT_USER,
  SET_UPDATE_USER,
} from '../actions/types';

const initialState = {
  isAuthenticated: false,
  user: {},
  preUser: {},
  users: [],
  admins: [],
  stats: {},
  isAuthLodaing: false,
  isResetPassword: false,
  isUpdateUser: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        isAuthLodaing: false,
        isUpdateUser: false,
      };
    case GET_PRE_USER:
      return {
        ...state,
        preUser: action.payload,
      };
    case CLEAR_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: false,
        user: {},
        isUpdateUser: false,
      };
    case GET_USERS:
      return {
        ...state,
        users: action.payload,
      };
    case GET_ADMIN_USERS:
      return {
        ...state,
        admins: action.payload,
      };
    case GET_STATS:
      return {
        ...state,
        stats: action.payload,
      };
    case LOADING:
      return {
        ...state,
        isAuthLodaing: true,
      };

    case RESET_PASSWORD:
      return {
        ...state,
        isResetPassword: true,
      };

    case CLEAR_RESET_PASSWORD:
      return {
        ...state,
        isResetPassword: false,
      };

    case SET_UPDATE_USER:
      return {
        ...state,
        isUpdateUser: true,
      };

    case CLEAR_UPDATE_USER:
      return {
        ...state,
        isUpdateUser: false,
      };

    default:
      return state;
  }
}
