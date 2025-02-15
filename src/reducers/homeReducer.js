import {
  GET_TOP_CATEGORIES,
  GET_GYMS,
  GET_GYM,
  GET_REVIEWS,
  GET_FAVOURITES,
  GET_CLASSES,
  GET_CLASS,
  GET_COACH,
  GET_CATEGORY_CLASSES,
  GET_COACH_CLASSES,
  GET_NEAREST_GYMS,
  GET_RECOMMENDED_GYMS,
  GET_RECOMMENDED_CLASSES,
  CLEAR_GYM,
  CLEAR_CLASS,
  GET_WHAT_TODAY_CLASSES,
} from '../actions/types';

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

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_TOP_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };
    case GET_GYMS:
      return {
        ...state,
        gyms: action.payload,
      };
    case GET_NEAREST_GYMS:
      return {
        ...state,
        nearestGyms: action.payload,
      };
    case GET_RECOMMENDED_GYMS:
      return {
        ...state,
        recommendedGyms: action.payload,
      };
    case GET_GYM:
      return {
        ...state,
        gym: action.payload,
      };
    case CLEAR_GYM:
      return {
        ...state,
        gym: {},
      };
    case GET_REVIEWS:
      return {
        ...state,
        reviews: action.payload,
      };
    case GET_FAVOURITES:
      return {
        ...state,
        favourites: action.payload,
      };
    case GET_CLASSES:
      return {
        ...state,
        classes: action.payload,
      };
    case GET_RECOMMENDED_CLASSES:
      return {
        ...state,
        recommendedClasses: action.payload,
      };
    case GET_CATEGORY_CLASSES:
      return {
        ...state,
        categoryClasses: action.payload,
      };
    case GET_COACH_CLASSES:
      return {
        ...state,
        coachClasses: action.payload,
      };
    case GET_WHAT_TODAY_CLASSES:
      return {
        ...state,
        todayClasses: action.payload,
      };
    case GET_CLASS:
      return {
        ...state,
        class: action.payload,
      };
    case CLEAR_CLASS:
      return {
        ...state,
        class: {},
      };
    case GET_COACH:
      return {
        ...state,
        coach: action.payload,
      };
    default:
      return state;
  }
}
