import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthLayout, ProtectedLayout } from './components'
import { Demo, Batch, Login, Signup } from './pages'
import './App.css'

import { useStateContext } from './contexts/ContextProvider'

const App = () => {
  const { setCurrentColor, setCurrentMode, currentMode } = useStateContext()

  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode')
    const currentThemeMode = localStorage.getItem('themeMode')
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor)
      setCurrentMode(currentThemeMode)
    }
  }, []);

  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <Routes>
        {/* <Route element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route path="/dashboard" element={<ProtectedLayout />}>
          <Route path="/dashboard/demo" element={<Demo />} />
          <Route path="/dashboard/batch" element={<Batch />} />
        </Route> */}
        <Route path="/" element={<ProtectedLayout />}>
          <Route path="/" element={<Navigate to="/dashboard/demo" />} />
          <Route path="/dashboard/demo" element={<Demo />} />
          <Route path="/dashboard/batch" element={<Batch />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
