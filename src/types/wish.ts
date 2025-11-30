export interface Wish {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  priority: 'low' | 'medium' | 'high';
  price: number;
  completed: boolean;
  createdAt: string;
}

export type NewWish = Omit<Wish, 'id' | 'createdAt'>;

export type UpdateWish = Partial<Omit<Wish, 'id'>>;

export type SortBy = 'createdAt' | 'price';
export type SortOrder = 'asc' | 'desc';

