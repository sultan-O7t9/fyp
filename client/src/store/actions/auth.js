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
export const loginUser = (email, password) => {
  return async dispatch => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );
      console.log(response.data);
      dispatch({
        type: SAVE_USER,
        payload: response.data,
      });
    } catch (error) {
      console.log(error);
    }
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
    try {
      // await axios.post("http://localhost:5000/api/auth/logout");
      dispatch({
        type: DELETE_USER,
      });
    } catch (error) {
      console.log(error);
    }
  };
};
