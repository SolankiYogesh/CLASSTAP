//import isEmpty from "../validation/is-empty";

import {SET_CURRENT_LANGUAGE, SET_LAT_LONG} from '../actions/types'

const initialState = {
  lang: 'en',
  isSettingLodaing: false,
  latitude: '',
  longitude: ''
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_LANGUAGE:
      return {
        ...state,
        lang: action.payload,
        isSettingLodaing: false
      }
    case SET_LAT_LONG:
      return {
        ...state,
        latitude: action.latitude,
        longitude: action.longitude
      }
    default:
      return state
  }
}
