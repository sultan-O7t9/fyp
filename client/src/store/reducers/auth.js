import {
  accessToken as keyAccessToken,
  refreshToken as keyRefreshToken,
} from "../../utils/keys";
import { DELETE_USER, READ_USER, SAVE_USER } from "../actions/auth";

const initialState = {};
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case READ_USER:
      return {
        ...state,
        accessToken: localStorage.getItem(keyAccessToken),
      };
    case SAVE_USER:
      const accessToken = action.payload.accessToken;
      const refreshToken = action.payload.refreshToken;
      localStorage.setItem(keyAccessToken, accessToken);
      localStorage.setItem(keyRefreshToken, refreshToken);
      return {
        ...state,
        accessToken,
      };
    case DELETE_USER:
      localStorage.removeItem(keyAccessToken);
      localStorage.removeItem(keyRefreshToken);
      // window.location.reload();
      return {
        ...state,
        accessToken: null,
      };
    default:
      return state;
  }
};

export default authReducer;
