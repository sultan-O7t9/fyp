export const CREATE_GROUP = "CREATE_GROUP";

export const createGroup = group => {
  return {
    type: CREATE_GROUP,
    payload: group,
  };
};
