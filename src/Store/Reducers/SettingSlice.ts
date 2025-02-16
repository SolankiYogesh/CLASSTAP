import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  lang: 'en',
  isSettingLoading: false,
  latitude: '',
  longitude: '',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setCurrentLanguage: (state, action) => {
      state.lang = action.payload;
      state.isSettingLoading = false;
    },
    setLatLong: (state, action) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
  },
});

export const {setCurrentLanguage, setLatLong} = settingsSlice.actions;

export default settingsSlice.reducer;
