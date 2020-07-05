import axios from 'axios';

import { setAlert } from './alert';
import { companyConstants } from '../constants';

// Get self companies
export const getSelfCompanies = () => async (dispatch) => {
  dispatch({ type: companyConstants.GET_COMPANIES_REQUEST });

  try {
    const res = await axios.get('/api/companies');

    dispatch({
      type: companyConstants.GET_COMPANIES_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: companyConstants.ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get companies
export const getCompanies = (user) => async (dispatch) => {
  dispatch({ type: companyConstants.GET_COMPANIES_REQUEST });

  try {
    const res = await axios.get(`/api/companies/user/${user}`);

    dispatch({
      type: companyConstants.GET_COMPANIES_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: companyConstants.ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Create company
export const createCompany = (formData, history, isEdit) => async (
  dispatch
) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await axios.post(`/api/companies/`, formData, config);

    dispatch({ type: companyConstants.CREATE_COMPANY, payload: res.data });

    dispatch(setAlert('Company created', 'success'));
  } catch (err) {
    const { errors } = err.response.data;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: companyConstants.ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get company
export const getCompany = (id) => async (dispatch) => {
  dispatch({ type: companyConstants.GET_COMPANY_REQUEST });

  try {
    const res = await axios.get(`/api/companies/${id}`);

    dispatch({ type: companyConstants.GET_COMPANY_SUCCESS, payload: res.data });
  } catch (err) {
    dispatch({
      type: companyConstants.ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get company
export const deleteCompany = (id) => async (dispatch) => {
  try {
    await axios.delete(`/api/companies/${id}`);

    dispatch(setAlert('Company successfully deleted', 'success'));
    dispatch({ type: companyConstants.DELETE_COMPANY, payload: id });
  } catch (err) {
    dispatch({
      type: companyConstants.ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
