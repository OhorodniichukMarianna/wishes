import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { WishesProvider } from './context/WishesProvider.tsx'
import { SnackbarProvider } from './context/SnackbarContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SnackbarProvider>
      <WishesProvider>
        <App />
      </WishesProvider>
    </SnackbarProvider>
  </StrictMode>,
)
