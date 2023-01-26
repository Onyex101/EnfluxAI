import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { ContextProvider } from './contexts/ContextProvider'
import { AuthProvider } from './contexts/AuthProvider'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ContextProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);

