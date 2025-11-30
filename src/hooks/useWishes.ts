import { useCallback } from 'react';
import { useWishesContext } from './useWishesContext';
import { useSnackbar } from '../context/SnackbarContext';
import type { Wish, NewWish, SortBy, SortOrder } from '../types/wish';

const API_BASE_URL = 'http://localhost:3001';

export function useWishes() {
  const { wishes, loading, error, hasMore, currentPage, setWishes, setLoading, setError, setHasMore, setCurrentPage } = useWishesContext();
  const { showSnackbar } = useSnackbar();

  const ITEMS_PER_PAGE = 10;

  const apiRequest = async <T,>(
    url: string,
    options?: RequestInit,
    errorMessage?: string
  ): Promise<T> => {
    try {
      const response = await fetch(url, options);
      return await response.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : errorMessage || 'Request failed';
      throw new Error(message);
    }
  };

  const getWishes = useCallback(async (sortBy?: SortBy, sortOrder?: SortOrder, page: number = 1, append: boolean = false): Promise<Wish[]> => {
    setLoading(true);
    setError(null);
    
    if (!append) {
      setWishes(null);
    }
    
    try {
      let url = `${API_BASE_URL}/wishes`;
      
      const params = new URLSearchParams();
      
      if (sortBy) {
        const sortField = sortOrder === 'desc' ? `-${sortBy}` : sortBy;
        params.append('_sort', sortField);
      }
      
      params.append('_page', page.toString());
      params.append('_per_page', ITEMS_PER_PAGE.toString());
      
      url += `?${params.toString()}`;
      console.log('Fetching with URL:', url);
      
      const response = await fetch(url);
      const paginatedResponse = await response.json();
      
      const wishesData = paginatedResponse.data || paginatedResponse;
      const hasMoreItems = paginatedResponse.next !== null && paginatedResponse.next !== undefined;
      
      setHasMore(hasMoreItems);
      
      if (append && wishes) {
        setWishes([...wishes, ...wishesData]);
        setCurrentPage(page);
      } else {
        setWishes(wishesData);
        setCurrentPage(page);
      }
      
      setLoading(false);
      
      if (!append) {
        showSnackbar('Wishes loaded successfully', 'success');
      }
      
      return wishesData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch wishes';
      setError(errorMessage);
      if (!append) {
        setWishes(null);
      }
      setLoading(false);
      showSnackbar(errorMessage, 'error');
      throw error;
    }
  }, [wishes, setWishes, setLoading, setError, setHasMore, setCurrentPage, showSnackbar]);

  const createWish = useCallback(async (newWish: NewWish): Promise<Wish> => {
    setLoading(true);
    setError(null);
    
    try {
      const wishToCreate = {
        ...newWish,
        createdAt: new Date().toISOString(),
      };

      const createdWish = await apiRequest<Wish>(
        `${API_BASE_URL}/wishes`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(wishToCreate),
        },
        'Failed to create wish'
      );
      
      await getWishes();
      showSnackbar('Wish created successfully', 'success');
      
      return createdWish;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create wish';
      setError(errorMessage);
      setLoading(false);
      showSnackbar(errorMessage, 'error');
      throw error;
    }
  }, [getWishes, setLoading, setError, showSnackbar]);

  const updateWish = useCallback(async (id: string, updates: Partial<Wish>): Promise<Wish> => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedWish = await apiRequest<Wish>(
        `${API_BASE_URL}/wishes/${id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        },
        'Failed to update wish'
      );
      
      await getWishes();
      showSnackbar('Wish updated successfully', 'success');
      
      return updatedWish;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update wish';
      setError(errorMessage);
      setLoading(false);
      showSnackbar(errorMessage, 'error');
      throw error;
    }
  }, [getWishes, setLoading, setError, showSnackbar]);

  const deleteWish = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      await apiRequest<void>(
        `${API_BASE_URL}/wishes/${id}`,
        { method: 'DELETE' },
        'Failed to delete wish'
      );
      
      await getWishes();
      showSnackbar('Wish deleted successfully', 'success');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete wish';
      setError(errorMessage);
      setLoading(false);
      showSnackbar(errorMessage, 'error');
      throw error;
    }
  }, [getWishes, setLoading, setError, showSnackbar]);

  return {
    wishes,
    loading,
    error,
    hasMore,
    currentPage,
    getWishes,
    createWish,
    updateWish,
    deleteWish,
  };
}

