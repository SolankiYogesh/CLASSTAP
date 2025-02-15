//import isEmpty from "../validation/is-empty";

import {
  GET_POPULAR_GYMS,
  GET_FIND_CLASSES,
  SET_GYM_AND_CLASS_COUNT,
  GET_CATEGORIES,
} from '../actions/types';

const initialState = {
  popularGyms: [],
  findClasses: [],
  gym_count: 0,
  class_count: 0,
  categories: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_POPULAR_GYMS:
      return {
        ...state,
        popularGyms: action.payload,
      };
    case GET_FIND_CLASSES:
      return {
        ...state,
        findClasses: action.payload,
      };
    case SET_GYM_AND_CLASS_COUNT:
      return {
        ...state,
        gym_count: action.gym_count,
        class_count: action.class_count,
      };
    case GET_CATEGORIES:
      return {
        ...state,
        categories: action.payload,
      };
    default:
      return state;
  }
}
