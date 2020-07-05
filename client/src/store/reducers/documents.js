import { documentsConstants } from '../constants';

const {
  GET_DOCUMENTS_REQUEST,
  GET_DOCUMENTS_SUCCESS,
  CREATE_DOCUMENT,
  DELETE_DOCUMENT,
  CLEAR_DOCUMENTS,
  ERROR,
} = documentsConstants;

const initialState = {
  documents: [],
  loadingDocuments: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_DOCUMENTS_REQUEST:
      return { ...state, loadingDocuments: true };
    case GET_DOCUMENTS_SUCCESS:
      return { ...state, documents: payload, loadingDocuments: false };
    case CREATE_DOCUMENT:
      return {
        ...state,
        documents: [...state.documents, payload],
      };
    case DELETE_DOCUMENT:
      return {
        ...state,
        documents: [
          ...state.documents.filter((doc) => {
            return doc._id !== payload;
          }),
        ],
      };
    case CLEAR_DOCUMENTS:
      return { ...state, documents: [] };
    case ERROR:
      return {
        ...state,
        error: payload,
        loadingDocuments: false,
      };
    default:
      return state;
  }
}
