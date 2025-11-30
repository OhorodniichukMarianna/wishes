import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { Snackbar } from '../components/Snackbar';

interface SnackbarContextType {
  showSnackbar: (message: string, type: 'success' | 'error' | 'info') => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
}

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isOpen: boolean;
  }>({
    message: '',
    type: 'info',
    isOpen: false,
  });

  const showSnackbar = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setSnackbar({
      message,
      type,
      isOpen: true,
    });
  }, []);

  const handleClose = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, isOpen: false }));
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isOpen={snackbar.isOpen}
        onClose={handleClose}
      />
    </SnackbarContext.Provider>
  );
}

