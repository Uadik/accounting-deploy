import { profileConstants } from '../constants';

const {
  GET_REQUEST,
  GET_SUCCESS,
  GET_PROFILES,
  ERROR,
  CLEAR,
} = profileConstants;

const initialState = {
  profile: null,
  profiles: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case GET_SUCCESS:
      return {
        ...state,
        profile: payload,
        loading: false,
      };
    case GET_PROFILES:
      return {
        ...state,
        profiles: payload,
        loading: false,
      };
    case CLEAR:
      return {
        ...state,
        profile: null,
        profiles: [],
        loading: false,
      };
    case ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
}
