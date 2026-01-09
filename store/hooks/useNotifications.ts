// useNotifications Hook
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchNotifications, clearNotifications } from '../actions/notificationActions';

export const useNotifications = () => {
  const dispatch = useAppDispatch();

  // State
  const { notifications, loading, error } = useAppSelector((state) => state.notification);

  // Actions
  const getNotifications = useCallback(() => {
    return dispatch(fetchNotifications() as any);
  }, [dispatch]);

  const resetNotifications = useCallback(() => {
    dispatch(clearNotifications());
  }, [dispatch]);

  return {
    // State
    notifications,
    loading,
    error,

    // Actions
    fetchNotifications: getNotifications,
    clearNotifications: resetNotifications,
  };
};

export default useNotifications;
