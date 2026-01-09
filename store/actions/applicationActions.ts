// Application Actions
import { Dispatch } from 'redux';
import { customerService } from '@/lib/api/customer.service';
import {
  FETCH_APPLICATIONS_REQUEST,
  FETCH_APPLICATIONS_SUCCESS,
  FETCH_APPLICATIONS_FAILURE,
  FETCH_NEW_APPLICATIONS_REQUEST,
  FETCH_NEW_APPLICATIONS_SUCCESS,
  FETCH_NEW_APPLICATIONS_FAILURE,
  CLEAR_APPLICATIONS,
} from '../actionTypes/applicationActionTypes';

// Fetch paginated applications
export const fetchApplications = (page: number = 1, limit: number = 10) => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_APPLICATIONS_REQUEST });

    try {
      const result = await customerService.getApplications(page, limit);

      if (result.success) {
        dispatch({
          type: FETCH_APPLICATIONS_SUCCESS,
          payload: {
            data: result.data?.data || [],
            pagination: result.data?.pagination || {
              totalRecords: 0,
              totalPages: 1,
              currentPage: page,
              limit,
            },
          },
        });
        return { success: true, data: result.data };
      } else {
        dispatch({
          type: FETCH_APPLICATIONS_FAILURE,
          payload: result.message || 'Failed to fetch applications',
        });
        return { success: false, error: result.message };
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch applications';
      const requiresAuth = errorMessage.includes('Session expired') || errorMessage.includes('login');

      dispatch({
        type: FETCH_APPLICATIONS_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage, requiresAuth };
    }
  };
};

// Fetch new loan applications
export const fetchNewApplications = () => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_NEW_APPLICATIONS_REQUEST });

    try {
      const result = await customerService.getNewApplications();

      if (result.success) {
        dispatch({
          type: FETCH_NEW_APPLICATIONS_SUCCESS,
          payload: result.data,
        });
        return { success: true, data: result.data };
      } else {
        dispatch({
          type: FETCH_NEW_APPLICATIONS_FAILURE,
          payload: result.message || 'Failed to fetch new applications',
        });
        return { success: false, error: result.message };
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch new applications';
      const requiresAuth = errorMessage.includes('Session expired') || errorMessage.includes('login');

      dispatch({
        type: FETCH_NEW_APPLICATIONS_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage, requiresAuth };
    }
  };
};

// Clear applications
export const clearApplications = () => ({
  type: CLEAR_APPLICATIONS,
});
