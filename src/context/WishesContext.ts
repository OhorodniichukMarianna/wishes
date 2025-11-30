import { createContext } from 'react';
import type { WishesContextType } from './WishesContext.types';

export const WishesContext = createContext<WishesContextType | undefined>(undefined);

