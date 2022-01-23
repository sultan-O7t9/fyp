import axios from "axios";
import Student from "../../models/Student";

export const IMPORT_STUDENTS = "IMPORT_STUDENTS";
export const CREATE_GROUP = "CREATE_GROUP";
export const UPDATE_STUDENT_GROUP_STATUS = "UPDATE_STUDENT_GROUP_STATUS";

//STUDENTS Actions
export const importStudents = students => {
  return async dispatch => {
    const studentsData = students.map(
      student =>
        new Student(
          student.rollNo,
          student.name,
          student.department,
          student.batch,
          null
        )
    );
    console.log(studentsData);
    try {
      const response = await axios.post(
        "https://fyp-pmo-default-rtdb.asia-southeast1.firebasedatabase.app/students.json",
        studentsData
      );
      console.log(response.data);

      dispatch({
        type: IMPORT_STUDENTS,
        payload: studentsData,
      });
    } catch (error) {}
  };
};
export const fetchStudents = students => {
  return async dispatch => {
    try {
      const response = await axios.get(
        "https://fyp-pmo-default-rtdb.asia-southeast1.firebasedatabase.app/students.json"
      );
      console.log(response.data);
      const studentsData = response.data[Object.keys(response.data)[0]];
      dispatch({
        type: IMPORT_STUDENTS,
        payload: studentsData,
      });
    } catch (error) {}
  };
};

//GROUPS Actions
export const createGroup = group => {
  return {
    type: CREATE_GROUP,
    payload: group,
  };
};
