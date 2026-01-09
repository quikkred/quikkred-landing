// Profile Actions
import { Dispatch } from 'redux';
import { customerService } from '@/lib/api/customer.service';
import {
  FETCH_PROFILE_REQUEST,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAILURE,
  CLEAR_PROFILE,
} from '../actionTypes/profileActionTypes';

// Fetch profile data
export const fetchProfile = () => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_PROFILE_REQUEST });

    try {
      const result = await customerService.getProfile();

      if (result.success) {
        dispatch({
          type: FETCH_PROFILE_SUCCESS,
          payload: result.data,
        });
        return { success: true, data: result.data };
      } else {
        dispatch({
          type: FETCH_PROFILE_FAILURE,
          payload: result.message || 'Failed to fetch profile',
        });
        return { success: false, error: result.message };
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch profile';
      const requiresAuth = errorMessage.includes('Session expired') || errorMessage.includes('login');

      dispatch({
        type: FETCH_PROFILE_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage, requiresAuth };
    }
  };
};

// Clear profile
export const clearProfile = () => ({
  type: CLEAR_PROFILE,
});
