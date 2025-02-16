import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  popularGyms: [],
  findClasses: [],
  gym_count: 0,
  class_count: 0,
  categories: [],
};

const gymSlice = createSlice({
  name: 'gym',
  initialState,
  reducers: {
    getPopularGyms: (state, action) => {
      state.popularGyms = action.payload;
    },
    getFindClasses: (state, action) => {
      state.findClasses = action.payload;
    },
    setGymAndClassCount: (state, action) => {
      state.gym_count = action.payload.gym_count;
      state.class_count = action.payload.class_count;
    },
    getCategories: (state, action) => {
      state.categories = action.payload;
    },
  },
});

export const {
  getPopularGyms,
  getFindClasses,
  setGymAndClassCount,
  getCategories,
} = gymSlice.actions;

export default gymSlice.reducer;
