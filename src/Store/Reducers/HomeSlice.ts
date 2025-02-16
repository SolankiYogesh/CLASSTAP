import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  error: '',
  gyms: [],
  nearestGyms: [],
  recommendedGyms: [],
  gym: {},
  categories: [],
  reviews: [],
  favourites: [],
  classes: [],
  recommendedClasses: [],
  class: {},
  coach: {},
  categoryClasses: [],
  coachClasses: [],
  todayClasses: [],
};

const gymSlice = createSlice({
  name: 'gym',
  initialState,
  reducers: {
    getTopCategories: (state, action) => {
      state.categories = action.payload;
    },
    getGyms: (state, action) => {
      state.gyms = action.payload;
    },
    getNearestGyms: (state, action) => {
      state.nearestGyms = action.payload;
    },
    getRecommendedGyms: (state, action) => {
      state.recommendedGyms = action.payload;
    },
    getGym: (state, action) => {
      state.gym = action.payload;
    },
    clearGym: state => {
      state.gym = {};
    },
    getReviews: (state, action) => {
      state.reviews = action.payload;
    },
    getFavourites: (state, action) => {
      state.favourites = action.payload;
    },
    getClasses: (state, action) => {
      state.classes = action.payload;
    },
    getRecommendedClasses: (state, action) => {
      state.recommendedClasses = action.payload;
    },
    getCategoryClasses: (state, action) => {
      state.categoryClasses = action.payload;
    },
    getCoachClasses: (state, action) => {
      state.coachClasses = action.payload;
    },
    getWhatTodayClasses: (state, action) => {
      state.todayClasses = action.payload;
    },
    getClass: (state, action) => {
      state.class = action.payload;
    },
    clearClass: state => {
      state.class = {};
    },
    getCoach: (state, action) => {
      state.coach = action.payload;
    },
  },
});

export const {
  getTopCategories,
  getGyms,
  getNearestGyms,
  getRecommendedGyms,
  getGym,
  clearGym,
  getReviews,
  getFavourites,
  getClasses,
  getRecommendedClasses,
  getCategoryClasses,
  getCoachClasses,
  getWhatTodayClasses,
  getClass,
  clearClass,
  getCoach,
} = gymSlice.actions;

export default gymSlice.reducer;
