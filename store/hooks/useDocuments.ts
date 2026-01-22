// useDocuments Hook
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchDocuments, clearDocuments } from '../actions/documentActions';

export const useDocuments = () => {
  const dispatch = useAppDispatch();

  // State
  const { documents, loading, error } = useAppSelector((state) => state.document);

  // Actions
  const getDocuments = useCallback(() => {
    return dispatch(fetchDocuments() as any);
  }, [dispatch]);

  const resetDocuments = useCallback(() => {
    dispatch(clearDocuments());
  }, [dispatch]);

  return {
    // State
    documents,
    loading,
    error,

    // Actions
    fetchDocuments: getDocuments,
    clearDocuments: resetDocuments,
  };
};

export default useDocuments;
