import {combineReducers, configureStore, Tuple} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import {thunk} from 'redux-thunk';

import AuthSlice from './Reducers/AuthSlice';
import ErrorSlice from './Reducers/ErrorSlice';
import FindClassSlice from './Reducers/FindClassSlice';
import HomeSlice from './Reducers/HomeSlice';
import SettingSlice from './Reducers/SettingSlice';
import SubscriptionSlice from './Reducers/SubscriptionSlice';

const tuple = new Tuple(thunk);

if (__DEV__) {
  tuple.concat(logger);
}

const rootReducer = combineReducers({
  auth: AuthSlice,
  errors: ErrorSlice,
  setting: SettingSlice,
  home: HomeSlice,
  subscription: SubscriptionSlice,
  findClass: FindClassSlice,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: () => tuple,
});
export type RootState = ReturnType<typeof rootReducer>
