// useDashboard Hook
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchDashboard, clearDashboard } from '../actions/dashboardActions';

export const useDashboard = () => {
  const dispatch = useAppDispatch();

  // State
  const { data, loading, error } = useAppSelector((state) => state.dashboard);

  // Actions
  const getDashboard = useCallback(() => {
    return dispatch(fetchDashboard() as any);
  }, [dispatch]);

  const resetDashboard = useCallback(() => {
    dispatch(clearDashboard());
  }, [dispatch]);

  return {
    // State
    dashboardData: data,
    loading,
    error,

    // Actions
    fetchDashboard: getDashboard,
    clearDashboard: resetDashboard,
  };
};

export default useDashboard;
