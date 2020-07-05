import { authConstants } from '../constants';

const {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  USER_LOADED,
  LOGOUT,
  ERROR,
} = authConstants;

const initState = {
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  user: null,
};

export default function (state = initState, action) {
  const { type, payload } = action;

  switch (type) {
    case REGISTER_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        token: payload.token,
        isAuthenticated: true,
        loading: false,
      };

    case REGISTER_FAILURE:
    case LOGIN_FAILURE:
    case LOGOUT:
    case ERROR:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
      };

    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };

    default:
      return state;
  }
}
