import { loginFailure, loginStart, loginSuccess,registerFailure,registerSuccess,registerStart,logOut } from "./userRedux";
import { publicRequest,userRequest } from "../requestMethods";

export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await publicRequest.post("auth/login", user);
    const { token } = res.data; 
    localStorage.setItem('token', token);
    dispatch(loginSuccess(res.data));
    return true;
  } catch (err) {
    if (err.response && err.response.status === 400) {
      // Dispatch loginFailure specifically for 400 Bad Request
      dispatch(loginFailure("Invalid credentials. Please check your email and password."));
    } else {
      dispatch(loginFailure(err.response?.data?.message || "An error occurred during login."));
    }
    return false;
  }
};

export const register = async (dispatch, user) => {
  dispatch(registerStart());
  try {
    const res = await publicRequest.post("auth/register", user);
    dispatch(registerSuccess(res.data));
    return true;
  } catch (err) {
    dispatch(registerFailure(err.response?.data?.message || "An error occurred during registration."));
    return false;
  }
};

export const logout = async (dispatch) => {
    dispatch(logOut());
};
