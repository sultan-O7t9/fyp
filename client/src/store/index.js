import { applyMiddleware, combineReducers, createStore } from "redux";
import ReduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import studentsReducer from "./reducers/students";

const rootReducer = combineReducers({
  students: studentsReducer,
});
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default store;
