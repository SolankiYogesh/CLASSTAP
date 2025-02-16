import {AsyncStorage} from 'react-native';

import {SET_CURRENT_LANGUAGE, SET_LAT_LONG} from './types';
export const setLanguage = lang => {
  return {
    type: SET_CURRENT_LANGUAGE,
    payload: lang,
  };
};

export const setLatLong = (latitude, longitude) => dispatch => {
  dispatch({
    type: SET_LAT_LONG,
    latitude,
    longitude,
  });
};
