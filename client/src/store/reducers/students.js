import Group from "../../models/Group";
import {
  IMPORT_STUDENTS,
  CREATE_GROUP,
  UPDATE_STUDENT_GROUP_STATUS,
} from "../actions/students";

const initialState = {
  students: [],
  groups: [],
};

const studentsReducer = (state = initialState, action) => {
  switch (action.type) {
    //STUDENTS Actions
    case IMPORT_STUDENTS:
      return {
        ...state,
        students: action.payload,
      };
    case UPDATE_STUDENT_GROUP_STATUS:
      return {
        ...state,
        students: action.payload,
      };
    // --------------------------------------------
    //GROUPS Actions
    case CREATE_GROUP:
      const tempGroup = action.payload;
      const group = new Group(
        `${state.groups.length + 1}_SE_18`,
        tempGroup.leader,
        tempGroup.members,
        tempGroup.supervisor,
        tempGroup.projectTitle,
        tempGroup.description
      );
      const members = {};
      for (const item of tempGroup.members) {
        members[item] = item;
      }
      console.log(members);
      // return state;
      const registeredStudents = state.students.map(student => {
        if (members.hasOwnProperty(student.rollNo)) student.setGroup(group.id);
        return student;
      });
      console.log("Registered", registeredStudents);

      return {
        ...state,
        students: registeredStudents,
        groups: [...state.groups, group],
      };

    default:
      return state;
  }
};

export default studentsReducer;
