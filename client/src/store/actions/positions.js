import axios from 'axios';

import { setAlert } from './alert';
import { positionsConstants } from '../constants';

// Fetch positions at companyId with parentId
export const getPositions = (companyId, parentId, setLoading) => async (
  dispatch
) => {
  dispatch({ type: positionsConstants.GET_POSITIONS_REQUEST });
  setLoading(true);

  const config = {
    params: {
      parent: parentId ? parentId : 'null',
      company: companyId,
    },
  };

  try {
    const res = await axios.get('/api/positions/', config);

    dispatch({
      type: positionsConstants.GET_POSITIONS_SUCCESS,
      payload: { positions: res.data, parentId },
    });
    setLoading(false);
  } catch (err) {
    dispatch({
      type: positionsConstants.ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
    setLoading(false);
  }
};

// Create position at companyId with parentId
export const createPosition = (formData, companyId, parentId) => async (
  dispatch
) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      parent: parentId,
      company: companyId,
    },
  };

  try {
    const res = await axios.post('/api/positions/', formData, config);

    dispatch({
      type: positionsConstants.CREATE_POSITION,
      payload: res.data,
    });
    dispatch(setAlert('Position successfully created', 'success'));
  } catch (err) {
    dispatch({
      type: positionsConstants.ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete position
export const deletePosition = (parentId) => async (dispatch) => {
  try {
    await axios.delete(`/api/positions/${parentId}`);

    dispatch({ type: positionsConstants.DELETE_POSITION, payload: parentId });
    dispatch(setAlert('Position successfully deleted', 'success'));
  } catch (err) {
    dispatch({
      type: positionsConstants.ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Clear positions
export const clearPositions = (parentId) => (dispatch) => {
  dispatch({ type: positionsConstants.CLEAR_POSITIONS, payload: parentId });
};
