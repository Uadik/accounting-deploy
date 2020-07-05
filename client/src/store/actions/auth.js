import axios from 'axios';

import { authConstants, profileConstants } from '../constants';
import { setAlert } from './alert';
import setAuthToken from '../../utils/setAuthToken';

// Load user
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/users/auth');

    dispatch({
      type: authConstants.USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({ type: authConstants.ERROR });
  }
};

// Register user
export const register = (name, email, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ name, email, password });

  try {
    const res = await axios.post('/api/users/register', body, config);

    dispatch({
      type: authConstants.REGISTER_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (err) {
    const { errors } = err.response.data;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: authConstants.REGISTER_FAILURE,
    });
  }
};

// Login user
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('/api/users/login', body, config);

    dispatch({
      type: authConstants.LOGIN_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (err) {
    const { errors } = err.response.data;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: authConstants.LOGIN_FAILURE,
    });
  }
};

// Logout
export const logout = () => (dispatch) => {
  dispatch({ type: authConstants.LOGOUT });
  dispatch({ type: profileConstants.CLEAR });
};
