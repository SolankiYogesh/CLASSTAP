//import isEmpty from "../validation/is-empty";

import {
  GET_SUBSCRIPTIONS,
  GET_UPCOMING_CLASSES,
  GET_COMPLETED_CLASSES,
  UPCOMING_CLASS_COUNT,
  COMPLETED_CLASS_COUNT,
  GET_TODAY_CLASSES,
} from '../actions/types';

const initialState = {
  subscriptions: [],
  upcomingClasses: [],
  completedClasses: [],
  upcomingClassCount: 0,
  completedClassCount: 0,
  todayClasses: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_SUBSCRIPTIONS:
      return {
        ...state,
        subscriptions: action.payload,
      };
    case GET_UPCOMING_CLASSES:
      return {
        ...state,
        upcomingClasses: action.payload,
      };
    case GET_COMPLETED_CLASSES:
      return {
        ...state,
        completedClasses: action.payload,
      };
    case UPCOMING_CLASS_COUNT:
      return {
        ...state,
        upcomingClassCount: action.payload,
      };
    case COMPLETED_CLASS_COUNT:
      return {
        ...state,
        completedClassCount: action.payload,
      };
    case GET_TODAY_CLASSES:
      return {
        ...state,
        todayClasses: action.payload,
      };
    default:
      return state;
  }
}
