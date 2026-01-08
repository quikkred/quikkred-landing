'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  fetchCustomer,
  fetchAadhaarStatus,
  fetchESignStatus,
  initializeBRE,
  updateBSA,
  fetchLoanProducts,
  fetchFinfactor,
  initializeESign,
  clearCustomerData,
  clearErrors,
} from '../actions/customerActions';

export const useCustomer = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const customer = useAppSelector((state) => state.customer.customer);
  const customerLoading = useAppSelector((state) => state.customer.customerLoading);
  const customerError = useAppSelector((state) => state.customer.customerError);

  const aadhaarStatus = useAppSelector((state) => state.customer.aadhaarStatus);
  const aadhaarStatusLoading = useAppSelector((state) => state.customer.aadhaarStatusLoading);

  const eSignStatus = useAppSelector((state) => state.customer.eSignStatus);
  const eSignStatusLoading = useAppSelector((state) => state.customer.eSignStatusLoading);

  const breData = useAppSelector((state) => state.customer.breData);
  const breLoading = useAppSelector((state) => state.customer.breLoading);

  const bsaData = useAppSelector((state) => state.customer.bsaData);
  const bsaLoading = useAppSelector((state) => state.customer.bsaLoading);

  const loanProducts = useAppSelector((state) => state.customer.loanProducts);
  const loanProductsLoading = useAppSelector((state) => state.customer.loanProductsLoading);

  const finfactorData = useAppSelector((state) => state.customer.finfactorData);
  const finfactorLoading = useAppSelector((state) => state.customer.finfactorLoading);

  const eSignInitData = useAppSelector((state) => state.customer.eSignInitData);
  const eSignInitLoading = useAppSelector((state) => state.customer.eSignInitLoading);

  // Actions
  const getCustomer = useCallback(() => {
    return dispatch(fetchCustomer() as any);
  }, [dispatch]);

  const getAadhaarStatus = useCallback(() => {
    return dispatch(fetchAadhaarStatus() as any);
  }, [dispatch]);

  const getESignStatus = useCallback((documentNumber?: string) => {
    return dispatch(fetchESignStatus(documentNumber) as any);
  }, [dispatch]);

  const initBRE = useCallback(() => {
    return dispatch(initializeBRE() as any);
  }, [dispatch]);

  const updateBSAStatus = useCallback(() => {
    return dispatch(updateBSA() as any);
  }, [dispatch]);

  const getLoanProducts = useCallback(() => {
    return dispatch(fetchLoanProducts() as any);
  }, [dispatch]);

  const getFinfactor = useCallback(() => {
    return dispatch(fetchFinfactor() as any);
  }, [dispatch]);

  const initESign = useCallback(() => {
    return dispatch(initializeESign() as any);
  }, [dispatch]);

  const clearData = useCallback(() => {
    dispatch(clearCustomerData());
  }, [dispatch]);

  const clearAllErrors = useCallback(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  return {
    // State
    customer,
    customerLoading,
    customerError,
    aadhaarStatus,
    aadhaarStatusLoading,
    eSignStatus,
    eSignStatusLoading,
    breData,
    breLoading,
    bsaData,
    bsaLoading,
    loanProducts,
    loanProductsLoading,
    finfactorData,
    finfactorLoading,
    eSignInitData,
    eSignInitLoading,

    // Actions
    getCustomer,
    getAadhaarStatus,
    getESignStatus,
    initBRE,
    updateBSAStatus,
    getLoanProducts,
    getFinfactor,
    initESign,
    clearData,
    clearAllErrors,
  };
};

export default useCustomer;
