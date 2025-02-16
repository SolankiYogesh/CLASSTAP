import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: {},
  preUser: {},
  users: [],
  admins: [],
  stats: {},
  isAuthLoading: false,
  isResetPassword: false,
  isUpdateUser: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.isAuthLoading = false;
      state.isUpdateUser = false;
    },
    getPreUser: (state, action) => {
      state.preUser = action.payload;
    },
    clearCurrentUser: state => {
      state.isAuthenticated = false;
      state.user = {};
      state.isUpdateUser = false;
    },
    getUsers: (state, action) => {
      state.users = action.payload;
    },
    getAdminUsers: (state, action) => {
      state.admins = action.payload;
    },
    getStats: (state, action) => {
      state.stats = action.payload;
    },
    loading: state => {
      state.isAuthLoading = true;
    },
    resetPassword: state => {
      state.isResetPassword = true;
    },
    clearResetPassword: state => {
      state.isResetPassword = false;
    },
    setUpdateUser: state => {
      state.isUpdateUser = true;
    },
    clearUpdateUser: state => {
      state.isUpdateUser = false;
    },
  },
});

export const {
  setCurrentUser,
  getPreUser,
  clearCurrentUser,
  getUsers,
  getAdminUsers,
  getStats,
  loading,
  resetPassword,
  clearResetPassword,
  setUpdateUser,
  clearUpdateUser,
} = userSlice.actions;

export default userSlice.reducer;
