import { v4 as uuid } from 'uuid';

import { alertConstants } from '../constants';

const setAlert = (msg, alertType) => (dispatch) => {
  const id = uuid();
  dispatch({
    type: alertConstants.SET,
    payload: {
      msg,
      alertType,
      id,
    },
  });

  setTimeout(
    () => dispatch({ type: alertConstants.REMOVE, payload: id }),
    5000
  );
};

const removeAlert = (id) => (dispatch) => {
  return { type: alertConstants.REMOVE, payload: id };
};

export { setAlert, removeAlert };
