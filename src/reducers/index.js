import {combineReducers} from 'redux';
import authReducer from './authReducer';
import errorReducer from './errorReducer';
import settingReducer from './settingReducer';
import homeReducer from './homeReducer';
import subscriptionReducer from './subscriptionReducer';
import findClassReducer from './findClassReducer';

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  setting: settingReducer,
  home: homeReducer,
  subscription: subscriptionReducer,
  findClass: findClassReducer,
});
