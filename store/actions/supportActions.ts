// Support Actions
import { Dispatch } from 'redux';
import { customerService } from '@/lib/api/customer.service';
import {
  FETCH_SUPPORT_TICKETS_REQUEST,
  FETCH_SUPPORT_TICKETS_SUCCESS,
  FETCH_SUPPORT_TICKETS_FAILURE,
  CLEAR_SUPPORT_TICKETS,
} from '../actionTypes/supportActionTypes';

// Fetch all support tickets
export const fetchSupportTickets = () => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_SUPPORT_TICKETS_REQUEST });

    try {
      const result = await customerService.getSupportTickets();

      if (result.success) {
        dispatch({
          type: FETCH_SUPPORT_TICKETS_SUCCESS,
          payload: result.data || [],
        });
        return { success: true, data: result.data };
      } else {
        dispatch({
          type: FETCH_SUPPORT_TICKETS_FAILURE,
          payload: result.message || 'Failed to fetch support tickets',
        });
        return { success: false, error: result.message };
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch support tickets';
      const requiresAuth = errorMessage.includes('Session expired') || errorMessage.includes('login');

      dispatch({
        type: FETCH_SUPPORT_TICKETS_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage, requiresAuth };
    }
  };
};

// Clear support tickets
export const clearSupportTickets = () => ({
  type: CLEAR_SUPPORT_TICKETS,
});
