// useBanks Hook
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchBankAccounts, clearBankAccounts } from '../actions/bankActions';

export const useBanks = () => {
  const dispatch = useAppDispatch();

  // State
  const { accounts, loading, error } = useAppSelector((state) => state.bank);

  // Actions
  const getBankAccounts = useCallback(() => {
    return dispatch(fetchBankAccounts() as any);
  }, [dispatch]);

  const resetBankAccounts = useCallback(() => {
    dispatch(clearBankAccounts());
  }, [dispatch]);

  return {
    // State
    accounts,
    loading,
    error,

    // Actions
    fetchBankAccounts: getBankAccounts,
    clearBankAccounts: resetBankAccounts,
  };
};

export default useBanks;
