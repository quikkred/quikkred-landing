// useProfile Hook
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchProfile, clearProfile } from '../actions/profileActions';

export const useProfile = () => {
  const dispatch = useAppDispatch();

  // State
  const { data, loading, error } = useAppSelector((state) => state.profile);

  // Actions
  const getProfile = useCallback(() => {
    return dispatch(fetchProfile() as any);
  }, [dispatch]);

  const resetProfile = useCallback(() => {
    dispatch(clearProfile());
  }, [dispatch]);

  return {
    // State
    profileData: data,
    loading,
    error,

    // Actions
    fetchProfile: getProfile,
    clearProfile: resetProfile,
  };
};

export default useProfile;
