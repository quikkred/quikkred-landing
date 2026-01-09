// Bank Actions
import { Dispatch } from 'redux';
import { customerService } from '@/lib/api/customer.service';
import {
  FETCH_BANK_ACCOUNTS_REQUEST,
  FETCH_BANK_ACCOUNTS_SUCCESS,
  FETCH_BANK_ACCOUNTS_FAILURE,
  CLEAR_BANK_ACCOUNTS,
} from '../actionTypes/bankActionTypes';

// Fetch all bank accounts
export const fetchBankAccounts = () => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_BANK_ACCOUNTS_REQUEST });

    try {
      const result = await customerService.getBankAccounts();

      if (result.success) {
        dispatch({
          type: FETCH_BANK_ACCOUNTS_SUCCESS,
          payload: result.data || [],
        });
        return { success: true, data: result.data };
      } else {
        dispatch({
          type: FETCH_BANK_ACCOUNTS_FAILURE,
          payload: result.message || 'Failed to fetch bank accounts',
        });
        return { success: false, error: result.message };
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch bank accounts';
      const requiresAuth = errorMessage.includes('Session expired') || errorMessage.includes('login');

      dispatch({
        type: FETCH_BANK_ACCOUNTS_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage, requiresAuth };
    }
  };
};

// Clear bank accounts
export const clearBankAccounts = () => ({
  type: CLEAR_BANK_ACCOUNTS,
});
