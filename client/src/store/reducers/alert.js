import { alertConstants } from '../constants';

const initialState = [];

export default function alert(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case alertConstants.SET:
      return [...state, payload];
    case alertConstants.REMOVE:
      return state.filter((alert) => alert.id !== payload);
    default:
      return state;
  }
}
