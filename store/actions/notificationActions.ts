// Notification Actions
import { Dispatch } from 'redux';
import { customerService } from '@/lib/api/customer.service';
import {
  FETCH_NOTIFICATIONS_REQUEST,
  FETCH_NOTIFICATIONS_SUCCESS,
  FETCH_NOTIFICATIONS_FAILURE,
  CLEAR_NOTIFICATIONS,
} from '../actionTypes/notificationActionTypes';

// Fetch all notifications
export const fetchNotifications = () => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_NOTIFICATIONS_REQUEST });

    try {
      const result = await customerService.getNotifications();

      if (result.success) {
        dispatch({
          type: FETCH_NOTIFICATIONS_SUCCESS,
          payload: result.data || [],
        });
        return { success: true, data: result.data };
      } else {
        dispatch({
          type: FETCH_NOTIFICATIONS_FAILURE,
          payload: result.message || 'Failed to fetch notifications',
        });
        return { success: false, error: result.message };
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch notifications';
      const requiresAuth = errorMessage.includes('Session expired') || errorMessage.includes('login');

      // Handle 403 specifically for notifications
      if (errorMessage.includes('403') || errorMessage.includes('forbidden')) {
        dispatch({
          type: FETCH_NOTIFICATIONS_FAILURE,
          payload: 'Notifications not available for your account type',
        });
        return { success: false, error: 'Notifications not available' };
      }

      dispatch({
        type: FETCH_NOTIFICATIONS_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage, requiresAuth };
    }
  };
};

// Clear notifications
export const clearNotifications = () => ({
  type: CLEAR_NOTIFICATIONS,
});
