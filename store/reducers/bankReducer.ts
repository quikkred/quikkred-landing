// Bank Reducer
import {
  FETCH_BANK_ACCOUNTS_REQUEST,
  FETCH_BANK_ACCOUNTS_SUCCESS,
  FETCH_BANK_ACCOUNTS_FAILURE,
  CLEAR_BANK_ACCOUNTS,
} from '../actionTypes/bankActionTypes';

export interface BankState {
  accounts: any[];
  loading: boolean;
  error: string | null;
}

const initialState: BankState = {
  accounts: [],
  loading: false,
  error: null,
};

const bankReducer = (state = initialState, action: any): BankState => {
  switch (action.type) {
    case FETCH_BANK_ACCOUNTS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_BANK_ACCOUNTS_SUCCESS:
      return {
        ...state,
        loading: false,
        accounts: action.payload,
        error: null,
      };
    case FETCH_BANK_ACCOUNTS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case CLEAR_BANK_ACCOUNTS:
      return initialState;

    default:
      return state;
  }
};

export default bankReducer;
