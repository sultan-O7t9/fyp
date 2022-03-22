import axios from "axios";

export const SAVE_USER = "SAVE_USER";
export const DELETE_USER = "DELETE_USER";
export const READ_USER = "READ_USER";

export const readUser = () => {
  return async dispatch => {
    try {
      dispatch({
        type: READ_USER,
      });
    } catch (err) {
      console.log(err);
    }
  };
};

//
export const loginUser = data => {
  return async dispatch => {
    dispatch({
      type: SAVE_USER,
      payload: data,
    });
  };
};
export const refreshAuthToken = (accessToken, refreshToken) => {
  return async dispatch => {
    try {
      dispatch({
        type: SAVE_USER,
        payload: { accessToken, refreshToken },
      });
    } catch (error) {
      console.log(error);
    }
  };
};

export const logoutUser = () => {
  return async dispatch => {
    dispatch({
      type: DELETE_USER,
    });
  };
};
