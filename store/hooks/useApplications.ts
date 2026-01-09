// useApplications Hook
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  fetchApplications,
  fetchNewApplications,
  clearApplications,
} from '../actions/applicationActions';

export const useApplications = () => {
  const dispatch = useAppDispatch();

  // State
  const {
    applications,
    newApplications,
    pagination,
    loading,
    newApplicationsLoading,
    error,
    newApplicationsError,
  } = useAppSelector((state) => state.application);

  // Actions
  const getApplications = useCallback(
    (page: number = 1, limit: number = 10) => {
      return dispatch(fetchApplications(page, limit) as any);
    },
    [dispatch]
  );

  const getNewApplications = useCallback(() => {
    return dispatch(fetchNewApplications() as any);
  }, [dispatch]);

  const resetApplications = useCallback(() => {
    dispatch(clearApplications());
  }, [dispatch]);

  return {
    // State
    applications,
    newApplications,
    pagination,
    loading,
    newApplicationsLoading,
    error,
    newApplicationsError,

    // Actions
    fetchApplications: getApplications,
    fetchNewApplications: getNewApplications,
    clearApplications: resetApplications,
  };
};

export default useApplications;
