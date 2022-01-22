import { combineReducers, createStore } from "redux";
import studentsReducer from "./reducers/students";
const rootReducer = combineReducers({
  students: studentsReducer,
});
const store = createStore(rootReducer);

export default store;
