import { applyMiddleware, combineReducers, createStore } from "redux";
import ReduxThunk from "redux-thunk";
import authReducer from "./reducers/auth";
// import { composeWithDevTools } from "redux-devtools-extension";

import studentsReducer from "./reducers/students";

const rootReducer = combineReducers({
  students: studentsReducer,
  auth: authReducer,
});
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default store;
