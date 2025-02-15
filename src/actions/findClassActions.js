import axios from 'axios';
//import {AsyncStorage} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import setAuthToken from '../utils/setAuthToken';
import {API_URI} from '../utils/config';
import {
  LOADING,
  CLEAR_LOADING,
  GET_ERRORS,
  GET_POPULAR_GYMS,
  GET_FIND_CLASSES,
  SET_GYM_AND_CLASS_COUNT,
  GET_CATEGORIES,
} from './types';

import {currentUser} from './authActions';
import isEmpty from '../validation/is-empty';

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

// get popular gyms
export const getPopularGyms = () => async dispatch => {
  let url = `${API_URI}/popular_gym?filter={"where": {"is_active": 1}}`;
  const latitude = await AsyncStorage.getItem('latitude');
  const longitude = await AsyncStorage.getItem('longitude');
  if (latitude && longitude) {
    url = `${url}&latitude=${latitude}&longitude=${longitude}`;
  }

  // console.log(latitude, longitude, '==== Map');

  //dispatch(setLoading());
  axios
    .get(url)
    .then(res => {
      if (res.data.error.code) {
        dispatch({
          type: GET_ERRORS,
          payload: res.data.error,
        });
      } else {
        const {data} = res.data;

        dispatch({
          type: GET_POPULAR_GYMS,
          payload: data,
        });
        //  dispatch(clearLoading());
      }
    })
    .catch(err => {
      if (err.response.data.error) {
        // dispatch(clearLoading());
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message,
        });
      }
    });
};

// get find classes
export const getFindClasses =
  (date = '', start_time = '', end_time = '', q = '') =>
  async dispatch => {
    const latitude = await AsyncStorage.getItem('latitude');
    const longitude = await AsyncStorage.getItem('longitude');
    let url;
    if (latitude && longitude) {
      url = `${API_URI}/classes?latitude=${latitude}&longitude=${longitude}`;
    } else {
      url = `${API_URI}/classes`;
    }

    if (date) {
      if (url.indexOf('?') > 0) {
        //url = `${url}&filter={"inClass":{"is_active": 1,"start_date":"${date}"},"where":{"$and":[{"start_time":{"$gte":"${start_time}"}},{"end_time":{"$lte":"${end_time}"}}]}}`;
        // url = `${url}&filter={"inClass":{"is_active": 1,"$and":[{"start_date":{"$lte":"${date}"}},{"end_date":{"$gte":"${date}"}}]},"where":{"$and":[{"start_time":{"$gte":"${start_time}"}},{"end_time":{"$lte":"${end_time}"}}]}}`;
        url = `${url}&filter={"inClass": {"is_active": 1},"inClassSchedule": {"$and":[{ "start_time": { "$gte": "${start_time}" } },{ "start_time": { "$lte": "${end_time}" } }]},"inScheduleDates":{"date":"${date}"}}`;
      } else {
        // url = `${url}?filter={"inClass":{"is_active": 1,"start_date":{"$lte":"${date}"}},"where":{"$and":[{"start_time":{"$gte":"${start_time}"}},{"end_time":{"$lte":"${end_time}"}}]}}`;
        //url = `${url}?filter={"inClass":{"is_active": 1,"$and":[{"start_date":{"$lte":"${date}"}},{"end_date":{"$gte":"${date}"}}]},"where":{"$and":[{"start_time":{"$gte":"${start_time}"}},{"end_time":{"$lte":"${end_time}"}}]}}`;
        url = `${url}?filter={"inClass": {"is_active": 1},"inClassSchedule": {"$and":[{ "start_time": { "$gte": "${start_time}" } },{ "start_time": { "$lte": "${end_time}" } }]},"inScheduleDates":{"date":"${date}"}}`;
      }
    }

    if (q) {
      if (url.indexOf('?') > 0) {
        url = `${url}&q=${q}`;
      } else {
        url = `${url}?q=${q}`;
      }
    }

    let checkFilter = getQueryParams('filter', url);
    if (isEmpty(checkFilter)) {
      if (url.indexOf('?') > 0) {
        url = `${url}&filter={"inClass": {"is_active": 1}}`;
      } else {
        url = `${url}?filter={"inClass": {"is_active": 1}}`;
      }
    }

    //dispatch(setLoading());
    axios
      .get(url)
      .then(res => {
        if (res.data.error.code) {
          dispatch({
            type: GET_ERRORS,
            payload: res.data.error,
          });
        } else {
          const {data, total_gym_counts, total_class_counts} = res.data;

          dispatch({
            type: GET_FIND_CLASSES,
            payload: data,
          });
          dispatch({
            type: SET_GYM_AND_CLASS_COUNT,
            gym_count: total_gym_counts,
            class_count: total_class_counts,
          });
          //  dispatch(clearLoading());
        }
      })
      .catch(err => {
        if (err.response.data.error) {
          // dispatch(clearLoading());
          dispatch({
            type: GET_ERRORS,
            payload: err.response.data.error.message,
          });
        }
      });
  };

// get find classes
export const getSearchFindClasses =
  (q, date = '', start_time = '', end_time = '') =>
  async dispatch => {
    const latitude = await AsyncStorage.getItem('latitude');
    const longitude = await AsyncStorage.getItem('longitude');
    let url = `${API_URI}/classes`;

    if (q) {
      if (url.indexOf('?') > 0) {
        url = `${url}&q=${q}`;
      } else {
        url = `${url}?q=${q}`;
      }
    }
    if (latitude && longitude) {
      if (url.indexOf('?') > 0) {
        url = `${url}&latitude=${latitude}&longitude=${longitude}`;
      } else {
        url = `${url}?latitude=${latitude}&longitude=${longitude}`;
      }
    }

    if (date) {
      if (url.indexOf('?') > 0) {
        // url = `${url}&filter={"inClass":{"is_active": 1,"start_date":"${date}"},"where":{"$and":[{"start_time":{"$gte":"${start_time}"}},{"end_time":{"$lte":"${end_time}"}}]}}`;
        //url = `${url}&filter={"where":{"$and":[{"start_date":"${date}"},{"$and":[{"start_time":{"$gte":"${start_time}"}},{"end_time":{"$lte":"${end_time}"}}]}]}}`;
        url = `${url}&filter={"inClass": {"is_active": 1},"inClassSchedule": {"$and":[{ "start_time": { "$gte": "${start_time}" } },{ "start_time": { "$lte": "${end_time}" } }]},"inScheduleDates":{"date":"${date}"}}`;
      } else {
        // url = `${url}?filter={"inClass":{"is_active": 1,"start_date":"${date}"},"where":{"$and":[{"start_time":{"$gte":"${start_time}"}},{"end_time":{"$lte":"${end_time}"}}]}}`;
        //url = `${url}?filter={"where":{"$and":[{"start_date":"${date}"},{"$and":[{"start_time":{"$gte":"${start_time}"}},{"end_time":{"$lte":"${end_time}"}}]}]}}`;
        url = `${url}?filter={"inClass": {"is_active": 1},"inClassSchedule": {"$and":[{ "start_time": { "$gte": "${start_time}" } },{ "start_time": { "$lte": "${end_time}" } }]},"inScheduleDates":{"date":"${date}"}}`;
      }
    }
    let checkFilter = getQueryParams('filter', url);
    if (isEmpty(checkFilter)) {
      if (url.indexOf('?') > 0) {
        url = `${url}&filter={"inClass": {"is_active": 1}}`;
      } else {
        url = `${url}?filter={"inClass": {"is_active": 1}}`;
      }
    }

    //dispatch(setLoading());
    axios
      .get(url)
      .then(res => {
        if (res.data.error.code) {
          dispatch({
            type: GET_ERRORS,
            payload: res.data.error,
          });
        } else {
          const {data, total_gym_counts, total_class_counts} = res.data;

          dispatch({
            type: GET_FIND_CLASSES,
            payload: data,
          });
          dispatch({
            type: SET_GYM_AND_CLASS_COUNT,
            gym_count: total_gym_counts,
            class_count: total_class_counts,
          });
          //  dispatch(clearLoading());
        }
      })
      .catch(err => {
        if (err.response.data.error) {
          // dispatch(clearLoading());
          dispatch({
            type: GET_ERRORS,
            payload: err.response.data.error.message,
          });
        }
      });
  };

// get find classes filter
export const getFilterFindClasses =
  (filter, navigation, filterData = {}) =>
  async dispatch => {
    const latitude = await AsyncStorage.getItem('latitude');
    const longitude = await AsyncStorage.getItem('longitude');
    let url = `${API_URI}/classes?filter=${filter}`;
    if (latitude && longitude) {
      if (url.indexOf('?') > 0) {
        url = `${url}&latitude=${latitude}&longitude=${longitude}`;
      } else {
        url = `${url}?latitude=${latitude}&longitude=${longitude}`;
      }
    }

    //dispatch(setLoading());
    axios
      .get(url)
      .then(res => {
        if (res.data.error.code) {
          dispatch({
            type: GET_ERRORS,
            payload: res.data.error,
          });
        } else {
          const {data, total_gym_counts, total_class_counts} = res.data;

          dispatch({
            type: GET_FIND_CLASSES,
            payload: data,
          });
          dispatch({
            type: SET_GYM_AND_CLASS_COUNT,
            gym_count: total_gym_counts,
            class_count: total_class_counts,
          });
          navigation.navigate('FindClass');
          navigation.state.params.onGoBack(filterData);
          //  dispatch(clearLoading());
        }
      })
      .catch(err => {
        if (err.response.data.error) {
          // dispatch(clearLoading());
          dispatch({
            type: GET_ERRORS,
            payload: err.response.data.error.message,
          });
        }
      });
  };

// get find classes count
export const getFilterFindClassCount = filter => async dispatch => {
  const latitude = await AsyncStorage.getItem('latitude');
  const longitude = await AsyncStorage.getItem('longitude');
  let url = `${API_URI}/classes?filter=${filter}`;
  if (latitude && longitude) {
    if (url.indexOf('?') > 0) {
      url = `${url}&latitude=${latitude}&longitude=${longitude}`;
    } else {
      url = `${url}?latitude=${latitude}&longitude=${longitude}`;
    }
  }

  //dispatch(setLoading());
  axios
    .get(url)
    .then(res => {
      if (res.data.error.code) {
        dispatch({
          type: GET_ERRORS,
          payload: res.data.error,
        });
      } else {
        const {data, total_class_counts, total_gym_counts} = res.data;

        dispatch({
          type: SET_GYM_AND_CLASS_COUNT,
          gym_count: total_gym_counts,
          class_count: total_class_counts,
        });
        dispatch({
          type: GET_FIND_CLASSES,
          payload: data,
        });
        //  dispatch(clearLoading());
      }
    })
    .catch(err => {
      if (err.response.data.error) {
        // dispatch(clearLoading());
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message,
        });
      }
    });
};

// Get Categories
export const getCategories = () => dispatch => {
  //dispatch(setLoading());
  axios
    .get(`${API_URI}/categories?filter={"where": {"is_active": 1}}`)
    .then(res => {
      if (res.data.error.code) {
        dispatch({
          type: GET_ERRORS,
          payload: res.data.error,
        });
      } else {
        const {data} = res.data;
        dispatch({
          type: GET_CATEGORIES,
          payload: data,
        });
        //dispatch(clearLoading());
      }
    })
    .catch(err => {
      if (err.response.data.error) {
        // dispatch(clearLoading());
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message,
        });
      }
    });
};

const getQueryParams = (params, url) => {
  let href = url;
  //this expression is to get the query strings
  let reg = new RegExp('[?&]' + params + '=([^&#]*)', 'i');
  let queryString = reg.exec(href);
  return queryString ? queryString[1] : null;
};

// get find classes filter
export const getFilterFindClassesNew = filter => async dispatch => {
  const latitude = await AsyncStorage.getItem('latitude');
  const longitude = await AsyncStorage.getItem('longitude');
  let url = `${API_URI}/classes?filter=${filter}`;
  if (latitude && longitude) {
    if (url.indexOf('?') > 0) {
      url = `${url}&latitude=${latitude}&longitude=${longitude}`;
    } else {
      url = `${url}?latitude=${latitude}&longitude=${longitude}`;
    }
  }

  //dispatch(setLoading());
  axios
    .get(url)
    .then(res => {
      if (res.data.error.code) {
        dispatch({
          type: GET_ERRORS,
          payload: res.data.error,
        });
      } else {
        const {data, total_gym_counts, total_class_counts} = res.data;

        dispatch({
          type: GET_FIND_CLASSES,
          payload: data,
        });
        dispatch({
          type: SET_GYM_AND_CLASS_COUNT,
          gym_count: total_gym_counts,
          class_count: total_class_counts,
        });

        //  dispatch(clearLoading());
      }
    })
    .catch(err => {
      if (err.response.data.error) {
        // dispatch(clearLoading());
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message,
        });
      }
    });
};
