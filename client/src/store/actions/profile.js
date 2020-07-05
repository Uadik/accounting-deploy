import axios from 'axios';
import { setAlert } from './alert';
import { profileConstants } from '../constants';

// Get current user profile
export const getCurrentProfile = () => async (dispatch) => {
  try {
    // dispatch({ type: profileConstants.GET_REQUEST });

    const res = await axios.get('api/profile/me');

    dispatch({ type: profileConstants.GET_SUCCESS, payload: res.data });
  } catch (err) {
    dispatch({
      type: profileConstants.ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Create or update profile
export const createProfile = (formData, history, edit = false) => async (
  dispatch
) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post('api/profile', formData, config);

    dispatch({ type: profileConstants.GET_SUCCESS, payload: res.data });

    dispatch(setAlert(edit ? 'Profile updated' : 'Profile created', 'success'));

    if (!edit) {
      history.push('/dashboard');
    }
  } catch (err) {
    const { errors } = err.response.data;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: profileConstants.ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Fetch new profiles
export const getProfiles = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/profile/all');

    dispatch({
      type: profileConstants.GET_PROFILES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: profileConstants.ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get profile by handle
export const getProfile = (handle) => async (dispatch) => {
  dispatch({
    type: profileConstants.GET_REQUEST,
  });

  try {
    const res = await axios.get(`/api/profile/handle/${handle}`);

    dispatch({
      type: profileConstants.GET_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: profileConstants.ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
