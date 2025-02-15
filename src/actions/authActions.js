import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

import {API_URI} from '../utils/config'
import I18n from '../utils/i18n'
import setAuthToken from '../utils/setAuthToken'
import {
  CLEAR_CURRENT_USER,
  CLEAR_LOADING,
  CLEAR_RESET_PASSWORD,
  CLEAR_UPDATE_USER,
  GET_ADMIN_USERS,
  GET_ERROR_SOCIAL,
  GET_ERRORS,
  GET_PRE_USER,
  GET_STATS,
  GET_USERS,
  LOADING,
  RESET_PASSWORD,
  SET_CURRENT_USER,
  SET_UPDATE_USER
} from './types'

// Register User
export const registerUser = (userData, navigation) => dispatch => {
  //alert('come');
  dispatch({
    type: LOADING
  })
  axios
    .post(`${API_URI}/users/register`, userData)
    .then(res => {
      if (res.data.error.code) {
        dispatch({
          type: GET_ERRORS,
          payload: res.data.error.message
        })
      } else {
        dispatch(clearLoading())
        const {mobile, mobile_code} = userData

        navigation.navigate('Otp', {mobile, mobile_code})
      }
    })
    .catch(err => {
      if (err.response.data.error) {
        dispatch(clearLoading())
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message
        })
      }
    })
}

// Verify Otp
export const verifyOtp = (userData, navigation) => (dispatch, getState) => {
  let {lang} = getState().setting
  dispatch({
    type: LOADING
  })
  //alert('come');
  //navigation.navigate('Main');
  axios
    .post(`${API_URI}/users/verify_otp`, userData)
    .then(async res => {
      if (res.data.error.code) {
        dispatch({
          type: GET_ERRORS,
          payload: res.data.error.message
        })
      } else {
        if (userData.is_forget) {
          dispatch(clearLoading())
          navigation.navigate('ResetPassword', {
            mobile: userData.mobile,
            otp: userData.otp
          })
        } else {
          const {token, data} = res.data
          // Set token to ls
          await AsyncStorage.setItem('classTabToken', token)
          await AsyncStorage.setItem('user_id', data.id.toString())
          await AsyncStorage.setItem('pre_user_id', data.id.toString())
          // Set token to Auth header
          setAuthToken(token)
          // Set current user

          dispatch(setCurrentUser(data))
          dispatch(clearLoading())
          navigation.navigate('Success', {
            text: I18n.t('wellDone', {locale: lang}),
            shortText: I18n.t('youHaveSuccessfullyCreateYourAccount', {
              locale: lang
            }),
            buttonText: I18n.t('startNow', {locale: lang}),
            MoveScreenName: 'Main'
          })
          //navigation.navigate('Main');
          //navigation.navigate('Otp', {mobile, mobile_code});
        }
      }

      //navigation.navigate('Main');
    })
    .catch(err => {
      if (err.response.data.error) {
        dispatch(clearLoading())
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message
        })
      }
    })
}

// Login - Get User Token
export const loginUser = (userData, navigation) => dispatch => {
  dispatch({
    type: LOADING
  })
  axios
    .post(`${API_URI}/users/login`, userData)
    .then(async res => {
      if (res.data.error.code) {
        dispatch({
          type: GET_ERRORS,
          payload: res.data.error.message
        })
      } else {
        const {token, data} = res.data
        // Set token to ls
        await AsyncStorage.setItem('classTabToken', token)
        await AsyncStorage.setItem('user_id', data.id.toString())
        await AsyncStorage.setItem('pre_user_id', data.id.toString())
        // Set token to Auth header
        setAuthToken(token)
        // Set current user
        dispatch(setCurrentUser(data))

        dispatch(clearLoading())
        navigation.navigate('Main')
      }
    })
    .catch(err => {
      if (err.response.status === 421) {
        dispatch(clearLoading())
        navigation.navigate('Otp', {
          mobile: userData.mobile,
          mobile_code: '+974'
        })
      } else {
        if (err.response.data.error) {
          dispatch(clearLoading())
          dispatch({
            type: GET_ERRORS,
            payload: err.response.data.error.message
          })
        }
      }
    })
}

// Forgot Password
export const forgotPassword =
  (userData, navigation) => (dispatch, getState) => {
    dispatch({
      type: LOADING
    })
    axios
      .post(`${API_URI}/users/forgot_password`, userData)
      .then(res => {
        if (res.data.error.code) {
          dispatch({
            type: GET_ERRORS,
            payload: res.data.error.message
          })
        } else {
          const {mobile, mobile_code} = userData
          dispatch(clearLoading())
          navigation.navigate('Otp', {mobile, mobile_code, is_forget: true})
        }
      })
      .catch(err => {
        if (err.response.data.error) {
          dispatch(clearLoading())
          dispatch({
            type: GET_ERRORS,
            payload: err.response.data.error.message
          })
        }
      })
  }

// Reset Password
export const resetPassword = (userData, navigation) => (dispatch, getState) => {
  dispatch({
    type: CLEAR_RESET_PASSWORD
  })

  dispatch({
    type: LOADING
  })

  axios
    .post(`${API_URI}/users/reset_password`, userData)
    .then(res => {
      if (res.data.error.code) {
        dispatch({
          type: GET_ERRORS,
          payload: res.data.error.message
        })
      } else {
        dispatch(clearLoading())
        dispatch({
          type: RESET_PASSWORD
        })
        //navigation.navigate('Login');
      }
    })
    .catch(err => {
      if (err.response.data.error) {
        dispatch(clearLoading())
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message
        })
      }
    })
}

export const clearResetPassword = () => dispatch => {
  dispatch({
    type: CLEAR_RESET_PASSWORD
  })
}

// Log user out
export const logoutUser = navigation => dispatch => {
  dispatch({
    type: LOADING
  })
  axios
    .get(`${API_URI}/users/logout`)
    .then(async res => {
      if (res.data.error.code) {
        dispatch({
          type: GET_ERRORS,
          payload: res.data.error.message
        })
      } else {
        dispatch(clearLoading())
        dispatch(setCurrentUser({}))
        // Remove token from localStorage
        await AsyncStorage.removeItem('classTabToken')
        await AsyncStorage.removeItem('user_id')
        // Remove auth header for future requests
        setAuthToken(false)
        // Set current user
        //dispatch(clearCurrentProfile());
        navigation.navigate('Auth')
      }
    })
    .catch(err => {
      if (err.response.data.error) {
        dispatch(clearLoading())
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message
        })
      }
    })
}

//  Get User User
export const currentUser = () => dispatch => {
  /* dispatch({
    type: LOADING,
  }); */
  axios
    .get(`${API_URI}/me/users`)
    .then(res => {
      if (res.data.error.code) {
        // Remove token from localStorage
        AsyncStorage.removeItem('classTabToken')
        AsyncStorage.removeItem('user_id')
        // Remove auth header for future requests
        setAuthToken(false)
        // Set current user
        dispatch(clearCurrentProfile())

        /*  dispatch({
          type: GET_ERRORS,
          payload: res.data.error.message,
        }); */
        //history.push("/login");
        /*  dispatch({
          type: GET_ERRORS,
          payload: res.data.error,
        }); */
      } else {
        // Save to localStorage
        const {data} = res.data

        // dispatch(clearLoading());
        // Set current user
        dispatch(setCurrentUser(data))
      }
    })
    .catch(err => {
      //dispatch(clearLoading());
      // Remove token from localStorage
      //AsyncStorage.removeItem('classTabToken');
      // Remove auth header for future requests
      //setAuthToken(false);
      // Set current user
      // dispatch(clearCurrentProfile());
      //history.push("/login");
      // window.location.href = `${window.location.origin.toString()}/`;
      /*  dispatch({
        type: GET_ERRORS,
        payload: err,
      }); */
    })
}

export const clearCurrentProfile = () => dispatch => {
  return {
    type: CLEAR_CURRENT_USER,
    payload: {}
  }
}

// Set logged in user
export const setCurrentUser = user => {
  return {
    type: SET_CURRENT_USER,
    payload: user
  }
}

// Update User
export const updateUser = (userData, id, navigation) => dispatch => {
  dispatch(setLoading())
  dispatch({
    type: CLEAR_UPDATE_USER
  })
  axios
    .put(`${API_URI}/users/${id}`, userData)
    .then(res => {
      if (res.data.error.code) {
        dispatch(clearLoading())
        dispatch({
          type: GET_ERRORS,
          payload: res.data.error.message
        })
      } else {
        const {data} = res.data
        dispatch(clearLoading())
        // Set current user
        dispatch(setCurrentUser(data))
        dispatch({
          type: SET_UPDATE_USER
        })
      }
    })
    .catch(err => {
      if (err.response.data.error) {
        dispatch(clearLoading())
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message
        })
      }
    })
}

export const clearUpdateUser = () => dispatch => {
  dispatch({
    type: CLEAR_UPDATE_USER
  })
}

export const setLoading = () => {
  return {
    type: LOADING
  }
}

export const clearLoading = () => {
  return {
    type: CLEAR_LOADING
  }
}

// Get User
export const getUser = id => dispatch => {
  dispatch(setLoading())
  axios
    .get(`${API_URI}/users/${id}`)
    .then(res => {
      if (res.data.error.code) {
        dispatch({
          type: GET_ERRORS,
          payload: res.data.error
        })
      } else {
        const {data} = res.data
        dispatch(clearLoading())
        dispatch({
          type: GET_PRE_USER,
          payload: data
        })
        //dispatch(setCurrentUser(data));
      }
    })
    .catch(err => {
      if (err.response.data.error) {
        dispatch(clearLoading())
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message
        })
      }
    })
}

// Get all Users
export const getAllUser = () => dispatch => {
  //`${API_URI}/users?filter={"include":{"0": "attachment"},"where": {"role_id": 2, "is_deleted": 0, "is_mobile_number_verified": 1},"skip": "0","limit":"all"}`
  axios
    .get(`${API_URI}/users`)
    .then(res => {
      if (res.data.error.code) {
        dispatch({
          type: GET_ERRORS,
          payload: res.data.error
        })
      } else {
        const {data} = res.data
        dispatch({
          type: GET_USERS,
          payload: data
        })
      }
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    })
}

// Get all Admins
export const getAllAdmin = () => dispatch => {
  axios
    .get(
      `${API_URI}/users?filter={"include":{"0": "attachment"},"where": {"role_id": 1, "is_deleted": 0},"skip": "0","limit":"all"}`,
    )
    .then(res => {
      if (res.data.error.code) {
        dispatch({
          type: GET_ERRORS,
          payload: res.data.error
        })
      } else {
        const {data} = res.data
        dispatch({
          type: GET_ADMIN_USERS,
          payload: data
        })
      }
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    })
}

export const getStats = () => dispatch => {
  axios
    .get(`${API_URI}/stats`)
    .then(res => {
      if (res.data.error.code) {
        dispatch({
          type: GET_ERRORS,
          payload: res.data.error
        })
      } else {
        const {data} = res
        dispatch({
          type: GET_STATS,
          payload: data
        })
      }
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err
      })
    })
}

// Update Admin
export const updateAdmin = (userData, id) => (dispatch, getState) => {
  let admins = [...getState().auth.admins]

  axios
    .put(`${API_URI}/users/${id}`, userData)
    .then(res => {
      if (res.data.error.code) {
        dispatch({
          type: GET_ERRORS,
          payload: res.data.error
        })
      } else {
        const {data} = res.data
        admins = admins.map(user => {
          if (user.id === data.id) {
            user = {...user, ...data}
          }
          return user
        })
        dispatch({
          type: GET_ADMIN_USERS,
          payload: admins
        })
      }
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      }),
    )
}

// Delete User
export const deleteUser = id => (dispatch, getState) => {
  let users = [...getState().auth.users]

  axios
    .delete(`${API_URI}/users/${id}`)
    .then(res => {
      if (res.data.error.code) {
        dispatch({
          type: GET_ERRORS,
          payload: res.data.error
        })
      } else {
        users = users.filter(user => user.id !== id)
        dispatch({
          type: GET_USERS,
          payload: users
        })
      }
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      }),
    )
}

// Delete Admin
export const deleteAdmin = id => (dispatch, getState) => {
  let admins = [...getState().auth.admins]

  axios
    .delete(`${API_URI}/users/${id}`)
    .then(res => {
      if (res.data.error.code) {
        dispatch({
          type: GET_ERRORS,
          payload: res.data.error
        })
      } else {
        admins = admins.filter(user => user.id !== id)
        dispatch({
          type: GET_ADMIN_USERS,
          payload: admins
        })
      }
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      }),
    )
}

// Add Admin
export const addAdmin = userData => (dispatch, getState) => {
  let admins = [...getState().auth.admins]
  axios
    .post(`${API_URI}/users`, userData)
    .then(res => {
      if (res.data.error.code) {
        dispatch({
          type: GET_ERRORS,
          payload: res.data.error
        })
      } else {
        const {data} = res.data
        admins.push(data)
        dispatch({
          type: GET_ADMIN_USERS,
          payload: admins
        })
      }
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      }),
    )
}

// showandhide dropdown

// Social Login - Get User Token
export const socialLoginUser = (userData, navigation) => dispatch => {
  dispatch({
    type: LOADING
  })

  axios
    .post(`${API_URI}/users/social_login`, userData)
    .then(async res => {
      if (res.data.error.code) {
        dispatch({
          type: GET_ERROR_SOCIAL,
          payload: res.data.error.message
        })
      } else {
        const {token, data} = res.data

        // Set token to ls
        await AsyncStorage.setItem('classTabToken', token)
        await AsyncStorage.setItem('user_id', data.id.toString())
        await AsyncStorage.setItem('pre_user_id', data.id.toString())
        // Set token to Auth header
        setAuthToken(token)
        // Set current user
        dispatch(setCurrentUser(data))

        dispatch(clearLoading())
        navigation.navigate('Main')
      }
    })
    .catch(err => {
      dispatch(clearLoading())
      if (err.response.data.error) {
        dispatch({
          type: GET_ERROR_SOCIAL,
          payload: err.response.data.error.message
        })
      }
    })
}

// Update User Device Token
export const updateUserDeviceToken = async userData => {
  const id = await AsyncStorage.get('user_id')

  axios
    .put(`${API_URI}/users/${id}`, userData)
    .then(res => {
      if (res.data.error.code) {
        dispatch({
          type: GET_ERRORS,
          payload: res.data.error.message
        })
      } else {
        const {data} = res.data

        // Set current user
        dispatch(setCurrentUser(data))
        dispatch({
          type: SET_UPDATE_USER
        })
      }
    })
    .catch(err => {
      if (err.response.data.error) {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message
        })
      }
    })
}

// Delete attachment
export const deleteAttachment = id => dispatch => {
  axios
    .delete(`${API_URI}/attachments/${id}`)
    .then(res => {
      if (res.data.error.code) {
        dispatch(clearLoading())
        dispatch({
          type: GET_ERRORS,
          payload: res.data.error.message
        })
      } else {
        const {data} = res.data

        // Set current user
        dispatch(currentUser())
      }
    })
    .catch(err => {
      if (err.response.data.error) {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data.error.message
        })
      }
    })
}

// Change Mobile
export const changeMobile =
  (userData, id, navigation) => (dispatch, getState) => {
    dispatch({
      type: LOADING
    })

    axios
      .put(`${API_URI}/users/update_mobile_no/${id}`, userData)
      .then(res => {
        if (res.data.error.code) {
          dispatch({
            type: GET_ERRORS,
            payload: res.data.error.message
          })
        } else {
          const {mobile, mobile_code} = userData

          dispatch(clearLoading())
          navigation.navigate('MobileOtp', {
            mobile,
            mobile_code
          })
        }
      })
      .catch(err => {
        if (err.response.data.error) {
          dispatch(clearLoading())
          dispatch({
            type: GET_ERRORS,
            payload: err.response.data.error.message
          })
        }
      })
  }

// Verify Mobile Otp
export const verifyMobileOtp =
  (userData, id, navigation) => (dispatch, getState) => {
    let {lang} = getState().setting
    dispatch({
      type: LOADING
    })
    //alert('come');
    //navigation.navigate('Main');
    axios
      .put(`${API_URI}/users/update_mobile_no_verify/${id}`, userData)
      .then(async res => {
        if (res.data.error.code) {
          dispatch({
            type: GET_ERRORS,
            payload: res.data.error.message
          })
        } else {
          dispatch(clearLoading())
          dispatch(currentUser())
          navigation.navigate('Account')
        }

        //navigation.navigate('Main');
      })
      .catch(err => {
        if (err.response.data.error) {
          dispatch(clearLoading())
          dispatch({
            type: GET_ERRORS,
            payload: err.response.data.error.message
          })
        }
      })
  }
