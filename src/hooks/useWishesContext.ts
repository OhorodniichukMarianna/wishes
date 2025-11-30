import { useContext } from 'react';
import { WishesContext } from '../context/WishesContext';

export function useWishesContext() {
  const context = useContext(WishesContext);
  if (context === undefined) {
    throw new Error('useWishesContext must be used within a WishesProvider');
  }
  return context;
}

