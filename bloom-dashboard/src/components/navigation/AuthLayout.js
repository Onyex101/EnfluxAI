import React from 'react'
import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from '../../contexts/AuthProvider'

const AuthLayout = () => {
    const { user } = useAuth();

    if (user) {
        return <Navigate to="/dashboard/demo" />;
    }
    return (
        <Outlet />
    )
}

export default AuthLayout