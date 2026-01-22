// useProducts Hook
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchProducts, clearProducts } from '../actions/productActions';

export const useProducts = () => {
  const dispatch = useAppDispatch();

  // State
  const { products, loading, error } = useAppSelector((state) => state.product);

  // Actions
  const getProducts = useCallback(() => {
    return dispatch(fetchProducts() as any);
  }, [dispatch]);

  const resetProducts = useCallback(() => {
    dispatch(clearProducts());
  }, [dispatch]);

  return {
    // State
    products,
    loading,
    error,

    // Actions
    fetchProducts: getProducts,
    clearProducts: resetProducts,
  };
};

export default useProducts;
