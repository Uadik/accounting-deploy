import axios from 'axios';

import { setAlert } from './alert';
import { documentsConstants } from '../constants';

// Get documents by company id
export const getDocuments = (id) => async (dispatch) => {
  dispatch({ type: documentsConstants.GET_DOCUMENTS_REQUEST });

  const config = {
    params: {
      company: id,
    },
  };

  try {
    const res = await axios.get(`/api/documents/`, config);

    dispatch({
      type: documentsConstants.GET_DOCUMENTS_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: documentsConstants.ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Create document on company
export const createDocument = (formData, companyId) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        company: companyId,
      },
    };

    const res = await axios.post(`/api/documents/`, formData, config);

    dispatch({ type: documentsConstants.CREATE_DOCUMENT, payload: res.data });

    dispatch(setAlert('Document saved', 'success'));
  } catch (err) {
    const { errors } = err.response.data;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: documentsConstants.ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete document by id
export const deleteDocument = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/documents/${id}`);

    dispatch({
      type: documentsConstants.DELETE_DOCUMENT,
      payload: res.data,
    });
    dispatch(setAlert('Document successfully deleted', 'success'));
  } catch (err) {
    dispatch({
      type: documentsConstants.ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Clear documents
export const clearDocuments = () => (dispatch) => {
  dispatch({ type: documentsConstants.CLEAR_DOCUMENTS });
};
