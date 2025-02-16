import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  error: '',
  isLoading: false,
  socialError: '',
};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    getErrors: (state, action) => {
      state.error = action.payload;
    },
    clearErrors: state => {
      state.error = '';
      state.isLoading = false;
    },
    setErrorLoading: state => {
      state.isLoading = true;
    },
    clearLoading: state => {
      state.isLoading = false;
    },
    getErrorSocial: (state, action) => {
      state.socialError = action.payload;
    },
    clearErrorSocial: state => {
      state.socialError = '';
    },
  },
});

export const {
  getErrors,
  clearErrors,
  setErrorLoading,
  clearLoading,
  getErrorSocial,
  clearErrorSocial,
} = errorSlice.actions;

export default errorSlice.reducer;
