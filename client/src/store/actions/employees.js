import axios from 'axios';

import { setAlert } from './alert';
import { employeesConstants } from '../constants';

// Get employees by company id
export const getEmployees = (id) => async (dispatch) => {
  dispatch({ type: employeesConstants.GET_EMPLOYEES_REQUEST });

  const config = {
    params: {
      company: id,
    },
  };

  try {
    const res = await axios.get(`/api/employees/`, config);

    dispatch({
      type: employeesConstants.GET_EMPLOYEES_SUCCESS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: employeesConstants.ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Create employee on company
export const createEmployee = (formData, companyId) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      params: {
        company: companyId,
      },
    };

    const res = await axios.post(`/api/employees/`, formData, config);

    dispatch({ type: employeesConstants.CREATE_EMPLOYEE, payload: res.data });

    dispatch(setAlert('Employee saved', 'success'));
  } catch (err) {
    const { errors } = err.response.data;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }

    dispatch({
      type: employeesConstants.ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete employee by id
export const deleteEmployee = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/employees/${id}`);

    dispatch({
      type: employeesConstants.DELETE_EMPLOYEE,
      payload: res.data,
    });
    dispatch(setAlert('Employee successfully deleted', 'success'));
  } catch (err) {
    dispatch({
      type: employeesConstants.ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Clear employees
export const clearEmployees = () => (dispatch) => {
  dispatch({ type: employeesConstants.CLEAR_EMPLOYEES });
};
