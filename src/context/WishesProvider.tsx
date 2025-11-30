import { useState } from 'react';
import type { ReactNode } from 'react';
import type { Wish } from '../types/wish';
import type { WishesContextType } from './WishesContext.types';
import { WishesContext } from './WishesContext';

interface WishesProviderProps {
  children: ReactNode;
}

export function WishesProvider({ children }: WishesProviderProps) {
  const [wishes, setWishes] = useState<Wish[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const value: WishesContextType = {
    wishes,
    loading,
    error,
    hasMore,
    currentPage,
    setWishes,
    setLoading,
    setError,
    setHasMore,
    setCurrentPage,
  };

  return <WishesContext.Provider value={value}>{children}</WishesContext.Provider>;
}

