import Student from "../../models/Student";
import { IMPORT_STUDENTS } from "../actions/students";

const initialState = {
  students: [],
};

const studentsReducer = (state = initialState, action) => {
  switch (action.type) {
    case IMPORT_STUDENTS:
      const students = action.payload.map(student => {
        return new Student(
          student.rollNo,
          student.name,
          student.department,
          student.batch
        );
      });
      return {
        ...state,
        students: students,
      };
    default:
      return state;
  }
};

export default studentsReducer;
