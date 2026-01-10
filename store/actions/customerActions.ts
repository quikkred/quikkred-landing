import { Dispatch } from 'redux';
import * as actionTypes from '../actionTypes/customerActionTypes';
import { API_BASE_URL } from '@/lib/config';

// Build API URL with /api prefix
const API_URL = `${API_BASE_URL}/api`;

// Helper to get auth token
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken') ||
         localStorage.getItem('token') ||
         localStorage.getItem('authToken');
};

// Helper for API calls
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
};

// ==================== Customer Actions ====================

export const fetchCustomer = () => async (dispatch: Dispatch) => {
  dispatch({ type: actionTypes.FETCH_CUSTOMER_REQUEST });

  try {
    const data = await apiCall('/customer/get', { method: 'GET' });
    dispatch({
      type: actionTypes.FETCH_CUSTOMER_SUCCESS,
      payload: data,
    });
    return data;
  } catch (error: any) {
    dispatch({
      type: actionTypes.FETCH_CUSTOMER_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// ==================== Aadhaar Status Actions ====================

export const fetchAadhaarStatus = () => async (dispatch: Dispatch) => {
  dispatch({ type: actionTypes.FETCH_AADHAAR_STATUS_REQUEST });

  try {
    const data = await apiCall('/kyc/aadhaar/status', { method: 'GET' });
    dispatch({
      type: actionTypes.FETCH_AADHAAR_STATUS_SUCCESS,
      payload: data,
    });
    return data;
  } catch (error: any) {
    dispatch({
      type: actionTypes.FETCH_AADHAAR_STATUS_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// ==================== eSign Status Actions ====================

export const fetchESignStatus = (documentNumber?: string) => async (dispatch: Dispatch) => {
  dispatch({ type: actionTypes.FETCH_ESIGN_STATUS_REQUEST });

  try {
    const endpoint = documentNumber
      ? `/kyc/eSign/document?documentNumber=${documentNumber}`
      : '/kyc/eSign/document';
    const data = await apiCall(endpoint, { method: 'GET' });
    dispatch({
      type: actionTypes.FETCH_ESIGN_STATUS_SUCCESS,
      payload: data,
    });
    return data;
  } catch (error: any) {
    dispatch({
      type: actionTypes.FETCH_ESIGN_STATUS_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// ==================== BRE Initialize Actions ====================

export const initializeBRE = () => async (dispatch: Dispatch) => {
  dispatch({ type: actionTypes.BRE_INITIALIZE_REQUEST });

  try {
    const data = await apiCall('/kyc/bre/initialize', { method: 'GET' });
    dispatch({
      type: actionTypes.BRE_INITIALIZE_SUCCESS,
      payload: data,
    });
    return data;
  } catch (error: any) {
    dispatch({
      type: actionTypes.BRE_INITIALIZE_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// ==================== BSA Update Actions ====================

export const updateBSA = () => async (dispatch: Dispatch) => {
  dispatch({ type: actionTypes.BSA_UPDATE_REQUEST });

  try {
    const data = await apiCall('/kyc/bsa/update', { method: 'GET' });
    dispatch({
      type: actionTypes.BSA_UPDATE_SUCCESS,
      payload: data,
    });
    return data;
  } catch (error: any) {
    dispatch({
      type: actionTypes.BSA_UPDATE_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// ==================== Loan Products Actions ====================

export const fetchLoanProducts = () => async (dispatch: Dispatch) => {
  dispatch({ type: actionTypes.FETCH_LOAN_PRODUCTS_REQUEST });

  try {
    const data = await apiCall('/loanProduct/allLoanProductsNameOnly', { method: 'GET' });
    dispatch({
      type: actionTypes.FETCH_LOAN_PRODUCTS_SUCCESS,
      payload: data,
    });
    return data;
  } catch (error: any) {
    dispatch({
      type: actionTypes.FETCH_LOAN_PRODUCTS_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// ==================== eSign Initialize Actions ====================

export const initializeESign = () => async (dispatch: Dispatch) => {
  dispatch({ type: actionTypes.ESIGN_INITIALIZE_REQUEST });

  try {
    const data = await apiCall('/kyc/eSign/initialize', { method: 'GET' });
    dispatch({
      type: actionTypes.ESIGN_INITIALIZE_SUCCESS,
      payload: data,
    });
    return data;
  } catch (error: any) {
    dispatch({
      type: actionTypes.ESIGN_INITIALIZE_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// ==================== Finfactor Actions ====================

export const fetchFinfactor = () => async (dispatch: Dispatch) => {
  dispatch({ type: actionTypes.FETCH_FINFACTOR_REQUEST });

  try {
    const data = await apiCall('/kyc/finfactor/initialize', { method: 'GET' });
    dispatch({
      type: actionTypes.FETCH_FINFACTOR_SUCCESS,
      payload: data,
    });
    return data;
  } catch (error: any) {
    dispatch({
      type: actionTypes.FETCH_FINFACTOR_FAILURE,
      payload: error.message,
    });
    throw error;
  }
};

// ==================== Clear Actions ====================

export const clearCustomerData = () => ({
  type: actionTypes.CLEAR_CUSTOMER_DATA,
});

export const clearErrors = () => ({
  type: actionTypes.CLEAR_ERRORS,
});
