import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { DashboardProvider } from './context/DashboardContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <DashboardProvider>
        <App />
      </DashboardProvider>
    </BrowserRouter>
  </StrictMode>,
)
