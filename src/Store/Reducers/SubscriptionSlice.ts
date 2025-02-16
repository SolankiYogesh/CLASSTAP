import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  subscriptions: [],
  upcomingClasses: [],
  completedClasses: [],
  upcomingClassCount: 0,
  completedClassCount: 0,
  todayClasses: [],
};

const classSlice = createSlice({
  name: 'class',
  initialState,
  reducers: {
    getSubscriptions: (state, action) => {
      state.subscriptions = action.payload;
    },
    getUpcomingClasses: (state, action) => {
      state.upcomingClasses = action.payload;
    },
    getCompletedClasses: (state, action) => {
      state.completedClasses = action.payload;
    },
    upcomingClassCount: (state, action) => {
      state.upcomingClassCount = action.payload;
    },
    completedClassCount: (state, action) => {
      state.completedClassCount = action.payload;
    },
    getTodayClasses: (state, action) => {
      state.todayClasses = action.payload;
    },
  },
});

export const {
  getSubscriptions,
  getUpcomingClasses,
  getCompletedClasses,
  upcomingClassCount,
  completedClassCount,
  getTodayClasses,
} = classSlice.actions;

export default classSlice.reducer;
