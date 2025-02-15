import { applyMiddleware, compose,createStore } from "redux"
import thunk from "redux-thunk"

import rootReducer from "./src/reducers"

const initialState = {}

const middleware = [thunk]

const composeenhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  rootReducer,
  initialState,
  composeenhancer(applyMiddleware(...middleware))
)

export default store
