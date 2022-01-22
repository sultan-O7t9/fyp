import { combineReducers, createStore } from "redux";
import groupsReducer from "./reducers/groups";
import studentsReducer from "./reducers/students";
const rootReducer = combineReducers({
  students: studentsReducer,
  groups: groupsReducer,
});
const store = createStore(rootReducer);

export default store;
