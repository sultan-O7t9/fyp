import { DELETE_USER, READ_USER, SAVE_USER } from "../actions/auth";

const initialState = {};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case READ_USER:
      return {
        ...state,
        accessToken: localStorage.getItem("accessToken"),
      };
    case SAVE_USER:
      const accessToken = action.payload.accessToken;
      const refreshToken = action.payload.refreshToken;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      return {
        ...state,
        accessToken,
      };
    case DELETE_USER:
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return {
        ...state,
        accessToken: null,
      };
    default:
      return state;
  }
};

export default authReducer;
