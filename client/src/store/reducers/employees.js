import { employeesConstants } from '../constants';

const {
  GET_EMPLOYEES_REQUEST,
  GET_EMPLOYEES_SUCCESS,
  CREATE_EMPLOYEE,
  DELETE_EMPLOYEE,
  CLEAR_EMPLOYEES,
  ERROR,
} = employeesConstants;

const initialState = {
  employees: [],
  loadingEmployees: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_EMPLOYEES_REQUEST:
      return { ...state, loadingEmployees: true };
    case GET_EMPLOYEES_SUCCESS:
      return { ...state, employees: payload, loadingEmployees: false };
    case CREATE_EMPLOYEE:
      return {
        ...state,
        employees: [...state.employees, payload],
      };
    case DELETE_EMPLOYEE:
      return {
        ...state,
        employees: [
          ...state.employees.filter((employee) => {
            return employee._id !== payload;
          }),
        ],
      };
    case CLEAR_EMPLOYEES:
      return { ...state, employees: [] };
    case ERROR:
      return {
        ...state,
        error: payload,
        loadingEmployees: false,
      };
    default:
      return state;
  }
}
