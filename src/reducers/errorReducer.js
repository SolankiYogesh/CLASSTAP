import {
  GET_ERRORS,
  CLEAR_ERRORS,
  LOADING,
  CLEAR_LOADING,
  GET_ERROR_SOCIAL,
  CLEAR_ERROR_SOCIAL,
} from '../actions/types';

const initialState = {
  error: '',
  isLodaing: false,
  socialError: '',
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return {
        ...state,
        error: action.payload,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: '',
        isLodaing: false,
      };
    case LOADING:
      return {
        ...state,
        isLodaing: true,
      };
    case CLEAR_LOADING:
      return {
        ...state,
        isLodaing: false,
      };
    case GET_ERROR_SOCIAL:
      return {
        ...state,
        socialError: action.payload,
      };
    case CLEAR_ERROR_SOCIAL:
      return {
        ...state,
        socialError: '',
      };
    default:
      return state;
  }
}
