import { companyConstants } from '../constants';

const {
  GET_COMPANIES_REQUEST,
  GET_COMPANIES_SUCCESS,
  GET_COMPANY_REQUEST,
  GET_COMPANY_SUCCESS,
  DELETE_COMPANY,
  CREATE_COMPANY,
  ERROR,
} = companyConstants;

const initialState = {
  companies: [],
  firm: null,
  companiesLoading: true,
  firmLoading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_COMPANIES_REQUEST:
      return { ...state, companiesLoading: true };
    case GET_COMPANIES_SUCCESS:
      return { ...state, companies: payload, companiesLoading: false };
    case GET_COMPANY_REQUEST:
      return { ...state, firm: payload, firmLoading: true };
    case GET_COMPANY_SUCCESS:
      return { ...state, firm: payload, firmLoading: false };
    case CREATE_COMPANY:
      return {
        ...state,
        companies: [...state.companies, payload],
      };
    case DELETE_COMPANY:
      return {
        ...state,
        companies: [
          ...state.companies.filter((company) => {
            return company._id !== payload;
          }),
        ],
      };
    case ERROR:
      return {
        ...state,
        error: payload,
        companiesLoading: false,
        firmLoading: false,
      };
    default:
      return state;
  }
}
