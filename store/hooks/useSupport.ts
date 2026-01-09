// useSupport Hook
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchSupportTickets, clearSupportTickets } from '../actions/supportActions';

export const useSupport = () => {
  const dispatch = useAppDispatch();

  // State
  const { tickets, loading, error } = useAppSelector((state) => state.support);

  // Actions
  const getSupportTickets = useCallback(() => {
    return dispatch(fetchSupportTickets() as any);
  }, [dispatch]);

  const resetSupportTickets = useCallback(() => {
    dispatch(clearSupportTickets());
  }, [dispatch]);

  return {
    // State
    tickets,
    loading,
    error,

    // Actions
    fetchSupportTickets: getSupportTickets,
    clearSupportTickets: resetSupportTickets,
  };
};

export default useSupport;
