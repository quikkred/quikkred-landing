// useLoans Hook
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  fetchLoanStatus,
  fetchActiveLoan,
  clearLoanStatus,
} from '../actions/loanActions';

export const useLoans = () => {
  const dispatch = useAppDispatch();

  // State
  const {
    loanStatus,
    activeLoan,
    statusLoading,
    activeLoanLoading,
    statusError,
    activeLoanError,
  } = useAppSelector((state) => state.loan);

  // Actions
  const getLoanStatus = useCallback(
    (params: { loanNumber?: string; mobile?: string }) => {
      return dispatch(fetchLoanStatus(params) as any);
    },
    [dispatch]
  );

  const getActiveLoan = useCallback(
    (loanNumber: string) => {
      return dispatch(fetchActiveLoan(loanNumber) as any);
    },
    [dispatch]
  );

  const resetLoanStatus = useCallback(() => {
    dispatch(clearLoanStatus());
  }, [dispatch]);

  return {
    // State
    loanStatus,
    activeLoan,
    statusLoading,
    activeLoanLoading,
    statusError,
    activeLoanError,

    // Actions
    fetchLoanStatus: getLoanStatus,
    fetchActiveLoan: getActiveLoan,
    clearLoanStatus: resetLoanStatus,
  };
};

export default useLoans;
