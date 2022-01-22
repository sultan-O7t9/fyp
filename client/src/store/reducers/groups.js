import Group from "../../models/Group";
import { CREATE_GROUP } from "../actions/groups";

const initialState = {
  groups: [],
};

const groupsReducer = (state = initialState, action) => {
  switch (action.type) {
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
      return {
        ...state,
        groups: [...state.groups, group],
      };

    default:
      return state;
  }
};

export default groupsReducer;
