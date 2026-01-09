// Loan Reducer
import {
  FETCH_LOAN_STATUS_REQUEST,
  FETCH_LOAN_STATUS_SUCCESS,
  FETCH_LOAN_STATUS_FAILURE,
  FETCH_ACTIVE_LOAN_REQUEST,
  FETCH_ACTIVE_LOAN_SUCCESS,
  FETCH_ACTIVE_LOAN_FAILURE,
  CLEAR_LOAN_STATUS,
} from '../actionTypes/loanActionTypes';

export interface LoanState {
  loanStatus: any | null;
  activeLoan: any | null;
  statusLoading: boolean;
  activeLoanLoading: boolean;
  statusError: string | null;
  activeLoanError: string | null;
}

const initialState: LoanState = {
  loanStatus: null,
  activeLoan: null,
  statusLoading: false,
  activeLoanLoading: false,
  statusError: null,
  activeLoanError: null,
};

const loanReducer = (state = initialState, action: any): LoanState => {
  switch (action.type) {
    case FETCH_LOAN_STATUS_REQUEST:
      return { ...state, statusLoading: true, statusError: null };
    case FETCH_LOAN_STATUS_SUCCESS:
      return {
        ...state,
        statusLoading: false,
        loanStatus: action.payload,
        statusError: null,
      };
    case FETCH_LOAN_STATUS_FAILURE:
      return { ...state, statusLoading: false, statusError: action.payload };

    case FETCH_ACTIVE_LOAN_REQUEST:
      return { ...state, activeLoanLoading: true, activeLoanError: null };
    case FETCH_ACTIVE_LOAN_SUCCESS:
      return {
        ...state,
        activeLoanLoading: false,
        activeLoan: action.payload,
        activeLoanError: null,
      };
    case FETCH_ACTIVE_LOAN_FAILURE:
      return { ...state, activeLoanLoading: false, activeLoanError: action.payload };

    case CLEAR_LOAN_STATUS:
      return initialState;

    default:
      return state;
  }
};

export default loanReducer;
