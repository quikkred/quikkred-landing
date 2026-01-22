// Document Reducer
import {
  FETCH_DOCUMENTS_REQUEST,
  FETCH_DOCUMENTS_SUCCESS,
  FETCH_DOCUMENTS_FAILURE,
  CLEAR_DOCUMENTS,
} from '../actionTypes/documentActionTypes';

export interface DocumentState {
  documents: any[];
  loading: boolean;
  error: string | null;
}

const initialState: DocumentState = {
  documents: [],
  loading: false,
  error: null,
};

const documentReducer = (state = initialState, action: any): DocumentState => {
  switch (action.type) {
    case FETCH_DOCUMENTS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_DOCUMENTS_SUCCESS:
      return {
        ...state,
        loading: false,
        documents: action.payload,
        error: null,
      };
    case FETCH_DOCUMENTS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case CLEAR_DOCUMENTS:
      return initialState;

    default:
      return state;
  }
};

export default documentReducer;
