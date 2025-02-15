import {CLEAR_ERRORS, CLEAR_ERROR_SOCIAL, CLEAR_LOADING} from './types';

// Clear Error
export const clearErrors = () => dispatch => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};

export const clearSocialErrors = () => dispatch => {
  dispatch({
    type: CLEAR_ERROR_SOCIAL,
  });
};

export const clearLoading = () => dispatch => {
  dispatch({
    type: CLEAR_LOADING,
  });
};
