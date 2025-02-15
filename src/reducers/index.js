import {combineReducers} from 'redux'

import authReducer from './authReducer'
import errorReducer from './errorReducer'
import findClassReducer from './findClassReducer'
import homeReducer from './homeReducer'
import settingReducer from './settingReducer'
import subscriptionReducer from './subscriptionReducer'

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  setting: settingReducer,
  home: homeReducer,
  subscription: subscriptionReducer,
  findClass: findClassReducer
})
