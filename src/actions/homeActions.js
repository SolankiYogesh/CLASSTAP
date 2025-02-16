//import {AsyncStorage} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import {API_URI} from '../utils/config';
import setAuthToken from '../utils/setAuthToken';
import {
  CLEAR_CLASS,
  CLEAR_GYM,
  CLEAR_LOADING,
  GET_CATEGORY_CLASSES,
  GET_CLASS,
  GET_CLASSES,
  GET_COACH,
  GET_COACH_CLASSES,
  GET_ERRORS,
  GET_FAVOURITES,
  GET_GYM,
  GET_GYMS,
  GET_NEAREST_GYMS,
  GET_RECOMMENDED_CLASSES,
  GET_RECOMMENDED_GYMS,
  GET_REVIEWS,
  GET_TOP_CATEGORIES,
  GET_WHAT_TODAY_CLASSES,
  LOADING,
} from './types';

//  Get User User
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

// Get Nearest gyms
export const getGyms = () => async dispatch => {
  const latitude = await AsyncStorage.getItem('latitude');
  const longitude = await AsyncStorage.getItem('longitude');

  // const latitude = "55.75";
  // const longitude = "37.6167";
  let url = `${API_URI}/gyms?filter={"where": {"is_active": 1}}`;
  if (latitude && longitude) {
    url = `${url}&latitude=${latitude}&longitude=${longitude}`;
  }

  dispatch(setLoading());
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
          type: GET_NEAREST_GYMS,
          payload: data,
        });
        dispatch(clearLoading());
      }
    })
    .catch(err => {
      if (err.response.data.error) {
        dispatch(clearLoading());
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message,
        });
      }
    });
};

export const getGymsLocation = () => async (dispatch, getState) => {
  const latitude = await AsyncStorage.getItem('latitude');
  const longitude = await AsyncStorage.getItem('longitude');
  /* let latitude = getState().setting.latitude;
  let longitude = getState().setting.longitude; */

  let url = `${API_URI}/gyms?filter={"where": {"is_active": 1}}&latitude=${latitude}&longitude=${longitude}`;

  dispatch(setLoading());
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
          type: GET_NEAREST_GYMS,
          payload: data,
        });
        dispatch(clearLoading());
      }
    })
    .catch(err => {
      if (err.response.data.error) {
        dispatch(clearLoading());
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message,
        });
      }
    });
};

// Get Nearest gyms
export const getRecommendedGyms = () => async (dispatch, getState) => {
  let url = `${API_URI}/recommend_gym?filter={"where": {"is_active": 1}}`;
  const latitude = await AsyncStorage.getItem('latitude');
  const longitude = await AsyncStorage.getItem('longitude');
  if (latitude && longitude) {
    url = `${url}&latitude=${latitude}&longitude=${longitude}`;
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
        const {data} = res.data;
        dispatch({
          type: GET_RECOMMENDED_GYMS,
          payload: data,
        });
        //dispatch(clearLoading());
      }
    })
    .catch(err => {
      if (err.response.data.error) {
        //dispatch(clearLoading());
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message,
        });
      }
    });
};

// Get Nearest gym
export const getGym = id => (dispatch, getState) => {
  let url = `${API_URI}/gyms/${id}`;

  dispatch(setLoading());
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
          type: GET_GYM,
          payload: data,
        });
        dispatch(clearLoading());
      }
    })
    .catch(err => {
      if (err.response.data.error) {
        dispatch(clearLoading());
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message,
        });
      }
    });
};

export const getGymLocation = id => async (dispatch, getState) => {
  const latitude = await AsyncStorage.getItem('latitude');
  const longitude = await AsyncStorage.getItem('longitude');
  /* let latitude = getState().setting.latitude;
  let longitude = getState().setting.longitude; */
  let url = `${API_URI}/gyms/${id}?latitude=${latitude}&longitude=${longitude}`;

  dispatch(setLoading());
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
          type: GET_GYM,
          payload: data,
        });
        dispatch(clearLoading());
      }
    })
    .catch(err => {
      if (err.response.data.error) {
        dispatch(clearLoading());
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
    .get(`${API_URI}/recommend_category?filter={"where": {"is_active": 1}}`)
    .then(res => {
      if (res.data.error.code) {
        dispatch({
          type: GET_ERRORS,
          payload: res.data.error,
        });
      } else {
        const {data} = res.data;

        dispatch({
          type: GET_TOP_CATEGORIES,
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

// get genders
export const getGenders = () => dispatch => {
  //dispatch(setLoading());
  axios
    .get(`${API_URI}/categories`)
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

export const addFavorite = addFavoriteData => (dispatch, getState) => {
  let gym = {...getState().home.gym};
  let gymClass = {...getState().home.class};

  axios
    .post(`${API_URI}/favourites`, addFavoriteData)
    .then(async res => {
      if (res.data.error.code) {
        dispatch({
          type: GET_ERRORS,
          payload: res.data.error.message,
        });
      } else {
        const {data} = res.data;
        if (addFavoriteData.class === 'Gym') {
          gym.favourite = data;
          dispatch({
            type: GET_GYM,
            payload: gym,
          });
        } else if (addFavoriteData.class === 'Class') {
          gymClass.favourite = data;
          dispatch({
            type: GET_CLASS,
            payload: gymClass,
          });
        }

        dispatch(clearLoading());
      }
    })
    .catch(err => {
      if (err.response.data.error) {
        dispatch(clearLoading());
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message,
        });
      }
    });
};

export const removeFavorite = (id, favType) => (dispatch, getState) => {
  let gym = {...getState().home.gym};
  let gymClass = {...getState().home.class};
  let favourites = [...getState().home.favourites];
  /* dispatch({
    type: LOADING,
  }); */
  axios
    .delete(`${API_URI}/favourites/${id}`)
    .then(async res => {
      if (res.data.error.code) {
        dispatch({
          type: GET_ERRORS,
          payload: res.data.error.message,
        });
      } else {
        const {data} = res.data;

        if (favourites.length > 0) {
          favourites = favourites.filter(favourite => favourite.id !== id);
          dispatch({
            type: GET_FAVOURITES,
            payload: favourites,
          });
        }

        if (favType === 'Gym') {
          delete gym.favourite;
          dispatch({
            type: GET_GYM,
            payload: gym,
          });
        } else if (favType === 'Class') {
          delete gymClass.favourite;
          dispatch({
            type: GET_CLASS,
            payload: gymClass,
          });
        }

        dispatch(clearLoading());
      }
    })
    .catch(err => {
      if (err.response.data.error) {
        dispatch(clearLoading());
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message,
        });
      }
    });
};

export const getFavorites = user_id => (dispatch, getState) => {
  //let gym = {...getState().home.gym};
  dispatch({
    type: LOADING,
  });
  axios
    .get(`${API_URI}/favourites?filter={"where": {"user_id": ${user_id}}}`)
    .then(async res => {
      if (res.data.error.code) {
        dispatch({
          type: GET_ERRORS,
          payload: res.data.error.message,
        });
      } else {
        const {data} = res.data;

        dispatch({
          type: GET_FAVOURITES,
          payload: data,
        });
        dispatch(clearLoading());
      }
    })
    .catch(err => {
      if (err.response.data.error) {
        dispatch(clearLoading());
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message,
        });
      }
    });
};

export const addReview = addReviewData => (dispatch, getState) => {
  let gym = {...getState().home.gym};
  let gymClass = {...getState().home.class};
  let reviews = [...getState().home.reviews];

  dispatch({
    type: LOADING,
  });
  axios
    .post(`${API_URI}/reviews`, addReviewData)
    .then(async res => {
      if (res.data.error.code) {
        dispatch({
          type: GET_ERRORS,
          payload: res.data.error.message,
        });
      } else {
        const {data} = res.data;
        if (addReviewData.class === 'Gym') {
          if (gym.reviews.length < 2) {
            gym.reviews.push(data);
            gym.rating_count = gym.rating_count + 1;
            dispatch({
              type: GET_GYM,
              payload: gym,
            });
          }
        } else if (addReviewData.class === 'Class') {
          if (gymClass.reviews.length < 2) {
            gymClass.reviews.push(data);
            gymClass.rating_count = gymClass.rating_count + 1;
            dispatch({
              type: GET_CLASS,
              payload: gymClass,
            });
          }
        }
        reviews.push(data);
        dispatch({
          type: GET_REVIEWS,
          payload: reviews,
        });

        //getReviews(addReviewData.foreign_id, addReviewData.class);
        dispatch(clearLoading());
      }
    })
    .catch(err => {
      if (err.response.data.error) {
        dispatch(clearLoading());
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message,
        });
      }
    });
};

export const getReviews =
  (foreign_id, foreign_class) => (dispatch, getState) => {
    //let gym = {...getState().home.gym};
    dispatch({
      type: LOADING,
    });
    axios
      .get(
        `${API_URI}/reviews?filter={"where": {"foreign_id": ${foreign_id}, "class": "${foreign_class}", "is_active": 1}}`,
      )
      .then(async res => {
        if (res.data.error.code) {
          dispatch({
            type: GET_ERRORS,
            payload: res.data.error.message,
          });
        } else {
          const {data} = res.data;

          dispatch({
            type: GET_REVIEWS,
            payload: data,
          });
          dispatch(clearLoading());
        }
      })
      .catch(err => {
        if (err.response.data.error) {
          dispatch(clearLoading());
          dispatch({
            type: GET_ERRORS,
            payload: err.response.data.error.message,
          });
        }
      });
  };

// Get Nearest classes
export const getClasses = () => (dispatch, getState) => {
  let url = `${API_URI}/classes?filter={"inClass": {"is_active": 1}}`;

  dispatch(setLoading());
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
          type: GET_CLASSES,
          payload: data,
        });
        dispatch(clearLoading());
      }
    })
    .catch(err => {
      if (err.response.data.error) {
        dispatch(clearLoading());
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message,
        });
      }
    });
};

export const getClassesLocation = () => async (dispatch, getState) => {
  /* let latitude = getState().setting.latitude;
  let longitude = getState().setting.longitude; */
  const latitude = await AsyncStorage.getItem('latitude');
  const longitude = await AsyncStorage.getItem('longitude');
  let url = `${API_URI}/classes?filter={"inClass": {"is_active": 1}}&latitude=${latitude}&longitude=${longitude}`;

  dispatch(setLoading());
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
          type: GET_CLASSES,
          payload: data,
        });
        dispatch(clearLoading());
      }
    })
    .catch(err => {
      if (err.response.data.error) {
        dispatch(clearLoading());
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message,
        });
      }
    });
};

export const getRecommendedClasses = () => async (dispatch, getState) => {
  let url = `${API_URI}/recommend_class?filter={"where": {"is_active": 1}}`;
  const latitude = await AsyncStorage.getItem('latitude');
  const longitude = await AsyncStorage.getItem('longitude');
  if (latitude && longitude) {
    url = `${url}&latitude=${latitude}&longitude=${longitude}`;
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
        const {data} = res.data;
        dispatch({
          type: GET_RECOMMENDED_CLASSES,
          payload: data,
        });
        // dispatch(clearLoading());
      }
    })
    .catch(err => {
      if (err.response.data.error) {
        //dispatch(clearLoading());
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message,
        });
      }
    });
};

// Get Category classes
export const getCategoryClasses = id => (dispatch, getState) => {
  dispatch(setLoading());
  axios
    .get(
      `${API_URI}/classes?filter={"inClass": {"is_active": 1},"inClassCategory": {"category_id": ${id}}}`,
    )
    .then(res => {
      if (res.data.error.code) {
        dispatch({
          type: GET_ERRORS,
          payload: res.data.error,
        });
      } else {
        const {data} = res.data;
        dispatch({
          type: GET_CATEGORY_CLASSES,
          payload: data,
        });
        dispatch(clearLoading());
      }
    })
    .catch(err => {
      if (err.response.data.error) {
        dispatch(clearLoading());
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message,
        });
      }
    });
};

// Get Nearest classes
export const getCoachClasses = id => (dispatch, getState) => {
  dispatch(setLoading());
  axios
    .get(
      `${API_URI}/classes?filter={"inClass": {"is_active": 1},"inClassSchedule": {"coach_id": ${id}}}`,
    )
    .then(res => {
      if (res.data.error.code) {
        dispatch({
          type: GET_ERRORS,
          payload: res.data.error,
        });
      } else {
        const {data} = res.data;
        dispatch({
          type: GET_COACH_CLASSES,
          payload: data,
        });
        dispatch(clearLoading());
      }
    })
    .catch(err => {
      if (err.response.data.error) {
        dispatch(clearLoading());
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message,
        });
      }
    });
};

// Get  class
export const getClass = id => (dispatch, getState) => {
  let url = `${API_URI}/classes/${id}`;
  dispatch(setLoading());
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
          type: GET_CLASS,
          payload: data,
        });
        dispatch(clearLoading());
      }
    })
    .catch(err => {
      if (err.response.data.error) {
        dispatch(clearLoading());
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message,
        });
      }
    });
};

export const getClassLocation = id => async (dispatch, getState) => {
  const latitude = await AsyncStorage.getItem('latitude');
  const longitude = await AsyncStorage.getItem('longitude');
  /* let latitude = getState().setting.latitude;
  let longitude = getState().setting.longitude; */
  let url = `${API_URI}/classes/${id}?latitude=${latitude}&longitude=${longitude}`;

  dispatch(setLoading());
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
          type: GET_CLASS,
          payload: data,
        });
        dispatch(clearLoading());
      }
    })
    .catch(err => {
      if (err.response.data.error) {
        dispatch(clearLoading());
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message,
        });
      }
    });
};

// Get  class
export const getCoach = id => (dispatch, getState) => {
  let url = `${API_URI}/coaches/${id}`;

  dispatch(setLoading());
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
          type: GET_COACH,
          payload: data,
        });
        dispatch(clearLoading());
      }
    })
    .catch(err => {
      if (err.response.data.error) {
        dispatch(clearLoading());
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message,
        });
      }
    });
};

export const getCoachLocation = id => async (dispatch, getState) => {
  const latitude = await AsyncStorage.getItem('latitude');
  const longitude = await AsyncStorage.getItem('longitude');
  /* let latitude = getState().setting.latitude;
  let longitude = getState().setting.longitude; */
  let url = `${API_URI}/coaches/${id}?latitude=${latitude}&longitude=${longitude}`;

  dispatch(setLoading());
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
          type: GET_COACH,
          payload: data,
        });
        dispatch(clearLoading());
      }
    })
    .catch(err => {
      if (err.response.data.error) {
        dispatch(clearLoading());
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message,
        });
      }
    });
};

export const clearGym = () => (dispatch, getState) => {
  dispatch({
    type: CLEAR_GYM,
  });
};

export const clearClass = () => (dispatch, getState) => {
  dispatch({
    type: CLEAR_CLASS,
  });
};

export const getTodayClasses = () => async (dispatch, getState) => {
  let date = new Date();
  let dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[0];
  let url = `${API_URI}/today_classes`;
  const latitude = await AsyncStorage.getItem('latitude');
  const longitude = await AsyncStorage.getItem('longitude');
  if (latitude && longitude) {
    url = `${url}?latitude=${latitude}&longitude=${longitude}`;
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
        const {data} = res.data;

        dispatch({
          type: GET_WHAT_TODAY_CLASSES,
          payload: data,
        });
        // dispatch(clearLoading());
      }
    })
    .catch(err => {
      if (err.response.data.error) {
        //dispatch(clearLoading());
        /* dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message,
        }); */
      }
    });
};

export const getCoach1 = id => (dispatch, getState) => {
  let url = `${API_URI}/coaches/${id}`;

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
          type: GET_COACH,
          payload: data,
        });
        dispatch(clearLoading());
      }
    })
    .catch(err => {
      if (err.response.data.error) {
        dispatch(clearLoading());
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message,
        });
      }
    });
};

export const getCoachLocation1 = id => async (dispatch, getState) => {
  const latitude = await AsyncStorage.getItem('latitude');
  const longitude = await AsyncStorage.getItem('longitude');
  /* let latitude = getState().setting.latitude;
  let longitude = getState().setting.longitude; */
  let url = `${API_URI}/coaches/${id}?latitude=${latitude}&longitude=${longitude}`;

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
          type: GET_COACH,
          payload: data,
        });
        dispatch(clearLoading());
      }
    })
    .catch(err => {
      if (err.response.data.error) {
        dispatch(clearLoading());
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message,
        });
      }
    });
};

// Get Nearest gyms
export const getGymsRefresh = () => async (dispatch, getState) => {
  const latitude = await AsyncStorage.getItem('latitude');
  const longitude = await AsyncStorage.getItem('longitude');

  let url = `${API_URI}/gyms?filter={"where": {"is_active": 1}}`;
  if (latitude && longitude) {
    url = `${url}&latitude=${latitude}&longitude=${longitude}`;
  }

  axios
    .get(url)
    .then(res => {
      if (res.data.error.code) {
      } else {
        const {data} = res.data;

        dispatch({
          type: GET_NEAREST_GYMS,
          payload: data,
        });
      }
    })
    .catch(err => {
      if (err.response.data.error) {
      }
    });
};

export const getFavoritesRefresh = user_id => (dispatch, getState) => {
  //let gym = {...getState().home.gym};

  axios
    .get(`${API_URI}/favourites?filter={"where": {"user_id": ${user_id}}}`)
    .then(async res => {
      if (res.data.error.code) {
      } else {
        const {data} = res.data;

        dispatch({
          type: GET_FAVOURITES,
          payload: data,
        });
      }
    })
    .catch(err => {
      if (err.response.data.error) {
      }
    });
};
