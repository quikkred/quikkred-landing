// Product Actions
import { Dispatch } from 'redux';
import { customerService } from '@/lib/api/customer.service';
import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  CLEAR_PRODUCTS,
} from '../actionTypes/productActionTypes';

// Fetch all products (public API - no auth required)
export const fetchProducts = () => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_PRODUCTS_REQUEST });

    try {
      const result = await customerService.getLoanProducts();

      if (result.success) {
        dispatch({
          type: FETCH_PRODUCTS_SUCCESS,
          payload: result.data || [],
        });
        return { success: true, data: result.data };
      } else {
        dispatch({
          type: FETCH_PRODUCTS_FAILURE,
          payload: result.message || 'Failed to fetch products',
        });
        return { success: false, error: result.message };
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to fetch products';

      dispatch({
        type: FETCH_PRODUCTS_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };
};

// Clear products
export const clearProducts = () => ({
  type: CLEAR_PRODUCTS,
});
