import type { Wish } from '../types/wish';

export interface WishesContextType {
  wishes: Wish[] | null;
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  setWishes: (wishes: Wish[] | null | ((prev: Wish[] | null) => Wish[] | null)) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setHasMore: (hasMore: boolean) => void;
  setCurrentPage: (page: number) => void;
}

