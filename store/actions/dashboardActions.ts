// Dashboard Actions
import { Dispatch } from 'redux';
import { customerService } from '@/lib/api/customer.service';
import {
  FETCH_DASHBOARD_REQUEST,
  FETCH_DASHBOARD_SUCCESS,
  FETCH_DASHBOARD_FAILURE,
  CLEAR_DASHBOARD,
} from '../actionTypes/dashboardActionTypes';

// Fetch dashboard data
export const fetchDashboard = () => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_DASHBOARD_REQUEST });

    try {
      const result = await customerService.getDashboard();

      if (result.success) {
        dispatch({
          type: FETCH_DASHBOARD_SUCCESS,
          payload: result.data,
        });
        return { success: true, data: result.data };
      } else {
        dispatch({
          type: FETCH_DASHBOARD_FAILURE,
          payload: result.message || 'Failed to fetch dashboard data',
        });
        return { success: false, error: result.message };
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch dashboard data';
      const requiresAuth = errorMessage.includes('Session expired') || errorMessage.includes('login');

      dispatch({
        type: FETCH_DASHBOARD_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage, requiresAuth };
    }
  };
};

// Clear dashboard
export const clearDashboard = () => ({
  type: CLEAR_DASHBOARD,
});
