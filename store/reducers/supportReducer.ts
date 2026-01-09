// Support Reducer
import {
  FETCH_SUPPORT_TICKETS_REQUEST,
  FETCH_SUPPORT_TICKETS_SUCCESS,
  FETCH_SUPPORT_TICKETS_FAILURE,
  CLEAR_SUPPORT_TICKETS,
} from '../actionTypes/supportActionTypes';

export interface SupportState {
  tickets: any[];
  loading: boolean;
  error: string | null;
}

const initialState: SupportState = {
  tickets: [],
  loading: false,
  error: null,
};

const supportReducer = (state = initialState, action: any): SupportState => {
  switch (action.type) {
    case FETCH_SUPPORT_TICKETS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_SUPPORT_TICKETS_SUCCESS:
      return {
        ...state,
        loading: false,
        tickets: action.payload,
        error: null,
      };
    case FETCH_SUPPORT_TICKETS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case CLEAR_SUPPORT_TICKETS:
      return initialState;

    default:
      return state;
  }
};

export default supportReducer;
