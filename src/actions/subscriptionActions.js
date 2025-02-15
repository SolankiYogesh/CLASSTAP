import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URI } from "../utils/config";
import {
  LOADING,
  CLEAR_LOADING,
  GET_ERRORS,
  GET_SUBSCRIPTIONS,
  GET_UPCOMING_CLASSES,
  GET_COMPLETED_CLASSES,
  UPCOMING_CLASS_COUNT,
  COMPLETED_CLASS_COUNT,
  GET_TODAY_CLASSES,
} from "./types";

import { currentUser } from "./authActions";
import I18n from "../utils/i18n";

export const setLoading = () => {
  return {
    type: LOADING,
  };
};

export const clearLoading = () => {
  return {
    type: CLEAR_LOADING,
  };
};

export const getNewSubscriptionRequest = (incomingData) => {
  let url = `${API_URI}/user_subscriptions`;
  dispatch(setLoading());

  axios
    .post(url, incomingData)
    .then((res) => {
      if (res.data.error.code) {
        dispatch({
          type: GET_ERRORS,
          payload: res.data.error,
        });
      } else {
        const { data } = res.data;

        return data;
      }
    })
    .catch((err) => {
      if (err.response.data.error) {
        dispatch(clearLoading());
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message,
        });
      }
    });
};

// get Subscriptions
export const getSubscriptions = () => (dispatch) => {
  let url = `${API_URI}/subscriptions`;

  dispatch(setLoading());
  axios
    .get(url)
    .then((res) => {
      if (res.data.error.code) {
        dispatch({
          type: GET_ERRORS,
          payload: res.data.error,
        });
      } else {
        const { data } = res.data;

        dispatch({
          type: GET_SUBSCRIPTIONS,
          payload: data,
        });
        dispatch(clearLoading());
      }
    })
    .catch((err) => {
      if (err.response.data.error) {
        dispatch(clearLoading());
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message,
        });
      }
    });
};

// Add user subscription
export const addUserSubscription =
  (addData, navigation) => (dispatch, getState) => {
    let user = { ...getState().auth.user };
    let lang = getState().setting.lang;
    dispatch(setLoading());
    axios
      .post(`${API_URI}/user_subscriptions`, addData)
      .then((res) => {
        if (res.data.error.code) {
          dispatch({
            type: GET_ERRORS,
            payload: res.data.error.message,
          });
        } else {
          const { data } = res.data;

          dispatch(clearLoading());
          dispatch(currentUser());
          // navigation.navigate('Success', {
          //   text: I18n.t('successful', {locale: lang}),
          //   shortText: I18n.t('youHaveSuccessfullySubscribedTo', {locale: lang}),
          //   buttonText: I18n.t('showMeSchedule', {locale: lang}),
          //   MoveScreenName: 'Profile',
          // });
          //navigation.navigate('Profile');
        }
      })
      .catch((err) => {
        if (err.response.data.error) {
          dispatch(clearLoading());
          dispatch({
            type: GET_ERRORS,
            payload: err.response.data.error.message,
          });
        }
      });
  };

// Add booking class
export const addBookingClass =
  (addData, navigation) => (dispatch, getState) => {
    dispatch(setLoading());
    axios
      .post(`${API_URI}/booking_classes`, addData)
      .then((res) => {
        if (res.data.error.code) {
          dispatch({
            type: GET_ERRORS,
            payload: res.data.error.message,
          });
        } else {
          const { data } = res.data;

          dispatch(clearLoading());
          navigation.navigate("Home");
        }
      })
      .catch((err) => {
        if (err.response.data.error) {
          dispatch(clearLoading());
          dispatch({
            type: GET_ERRORS,
            payload: err.response.data.error.message,
          });
        }
      });
  };

// get upcoming classes
export const getUpcomingClasses = () => (dispatch, getState) => {
  const { id } = getState().auth.user;
  let url = `${API_URI}/booking_classes?filter={"where": {"user_id": ${id}}}`;

  dispatch(setLoading());
  axios
    .get(url)
    .then((res) => {
      if (res.data.error.code) {
        dispatch({
          type: GET_ERRORS,
          payload: res.data.error,
        });
      } else {
        const { data } = res.data;

        dispatch({
          type: GET_UPCOMING_CLASSES,
          payload: data,
        });
        dispatch(clearLoading());
      }
    })
    .catch((err) => {
      if (err.response.data.error) {
        dispatch(clearLoading());
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message,
        });
      }
    });
};

// get completed classes
export const getCompletedClasses = () => (dispatch, getState) => {
  const { id } = getState().auth.user;
  let url = `${API_URI}/booking_classes?filter={"where": {"user_id": ${id}}}`;

  dispatch(setLoading());
  axios
    .get(url)
    .then((res) => {
      if (res.data.error.code) {
        dispatch({
          type: GET_ERRORS,
          payload: res.data.error,
        });
      } else {
        const { data } = res.data;

        dispatch({
          type: GET_COMPLETED_CLASSES,
          payload: data,
        });
        dispatch(clearLoading());
      }
    })
    .catch((err) => {
      if (err.response.data.error) {
        dispatch(clearLoading());
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message,
        });
      }
    });
};

// Get what's on today
export const getWhatsOnToday = (user_id) => async (dispatch, getState) => {
  //const user_id = await AsyncStorage.getItem('user_id');
  const latitude = await AsyncStorage.getItem("latitude");
  const longitude = await AsyncStorage.getItem("longitude");

  let url = `${API_URI}/whats_on_today?filter={"where":{"user_id":${user_id},"is_cancel":false}}`;

  if (latitude && longitude) {
    url = `${url}&latitude=${latitude}&longitude=${longitude}`;
  }

  //dispatch(setLoading());
  axios
    .get(url)
    .then((res) => {
      if (res.data.error.code) {
        dispatch({
          type: GET_ERRORS,
          payload: res.data.error,
        });
      } else {
        const { data } = res.data;

        dispatch({
          type: GET_TODAY_CLASSES,
          payload: data.bookingClass,
        });
        dispatch({
          type: UPCOMING_CLASS_COUNT,
          payload: data.upcoming_class.count,
        });
        dispatch({
          type: COMPLETED_CLASS_COUNT,
          payload: data.completed_class.count,
        });
        dispatch({
          type: GET_UPCOMING_CLASSES,
          payload: data.upcoming_class.rows,
        });
        dispatch({
          type: GET_COMPLETED_CLASSES,
          payload: data.completed_class.rows,
        });

        // dispatch(clearLoading());
      }
    })
    .catch((err) => {
      if (err.response.data.error) {
        //dispatch(clearLoading());
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message,
        });
      }
    });
};

// get Subscriptions
export const getSubscriptionsRefresh = () => (dispatch) => {
  let url = `${API_URI}/subscriptions`;

  axios
    .get(url)
    .then((res) => {
      if (res.data.error.code) {
      } else {
        const { data } = res.data;

        dispatch({
          type: GET_SUBSCRIPTIONS,
          payload: data,
        });
      }
    })
    .catch((err) => {
      if (err.response.data.error) {
      }
    });
};
