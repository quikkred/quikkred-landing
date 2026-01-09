// Loan Actions
import { Dispatch } from 'redux';
import { customerService } from '@/lib/api/customer.service';
import {
  FETCH_LOAN_STATUS_REQUEST,
  FETCH_LOAN_STATUS_SUCCESS,
  FETCH_LOAN_STATUS_FAILURE,
  FETCH_ACTIVE_LOAN_REQUEST,
  FETCH_ACTIVE_LOAN_SUCCESS,
  FETCH_ACTIVE_LOAN_FAILURE,
  CLEAR_LOAN_STATUS,
} from '../actionTypes/loanActionTypes';

// Fetch loan status by loan number or mobile
export const fetchLoanStatus = (params: { loanNumber?: string; mobile?: string }) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_LOAN_STATUS_REQUEST });

    try {
      const result = await customerService.getLoanStatus(params);

      if (result.success) {
        dispatch({
          type: FETCH_LOAN_STATUS_SUCCESS,
          payload: result.data,
        });
        return { success: true, data: result.data };
      } else {
        dispatch({
          type: FETCH_LOAN_STATUS_FAILURE,
          payload: result.message || 'Failed to fetch loan status',
        });
        return { success: false, error: result.message };
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch loan status';

      dispatch({
        type: FETCH_LOAN_STATUS_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };
};

// Fetch active loan details
export const fetchActiveLoan = (loanNumber: string) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_ACTIVE_LOAN_REQUEST });

    try {
      const result = await customerService.getActiveLoan(loanNumber);

      if (result.success) {
        dispatch({
          type: FETCH_ACTIVE_LOAN_SUCCESS,
          payload: result.data,
        });
        return { success: true, data: result.data };
      } else {
        dispatch({
          type: FETCH_ACTIVE_LOAN_FAILURE,
          payload: result.message || 'Failed to fetch active loan',
        });
        return { success: false, error: result.message };
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch active loan';
      const requiresAuth = errorMessage.includes('Session expired') || errorMessage.includes('login');

      dispatch({
        type: FETCH_ACTIVE_LOAN_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage, requiresAuth };
    }
  };
};

// Clear loan status
export const clearLoanStatus = () => ({
  type: CLEAR_LOAN_STATUS,
});
