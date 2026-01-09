// Document Actions
import { Dispatch } from 'redux';
import { customerService } from '@/lib/api/customer.service';
import {
  FETCH_DOCUMENTS_REQUEST,
  FETCH_DOCUMENTS_SUCCESS,
  FETCH_DOCUMENTS_FAILURE,
  CLEAR_DOCUMENTS,
} from '../actionTypes/documentActionTypes';

// Fetch all documents
export const fetchDocuments = () => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_DOCUMENTS_REQUEST });

    try {
      const result = await customerService.getDocuments();

      if (result.success) {
        dispatch({
          type: FETCH_DOCUMENTS_SUCCESS,
          payload: result.data?.documents || [],
        });
        return { success: true, data: result.data?.documents };
      } else {
        dispatch({
          type: FETCH_DOCUMENTS_FAILURE,
          payload: result.message || 'Failed to fetch documents',
        });
        return { success: false, error: result.message };
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch documents';
      const requiresAuth = errorMessage.includes('Session expired') || errorMessage.includes('login');

      dispatch({
        type: FETCH_DOCUMENTS_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage, requiresAuth };
    }
  };
};

// Clear documents
export const clearDocuments = () => ({
  type: CLEAR_DOCUMENTS,
});
