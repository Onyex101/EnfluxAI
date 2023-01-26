import React from 'react'
import { Navigate, useOutlet } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthProvider'
import { useStateContext } from '../../contexts/ContextProvider'
import { Sidebar, Navbar, Footer } from '../index'

const ProtectedLayout = () => {
    const { user } = useAuth()
    const { activeMenu } = useStateContext()
    const outlet = useOutlet()
    // if (!user) {
    //     // user is not authenticated
    //     return <Navigate to="/" />;
    // }
    return (
        <div className="flex relative dark:bg-main-dark-bg">
            {activeMenu ? (
                <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
                    <Sidebar />
                </div>
            ) : (
                <div className="w-0 dark:bg-secondary-dark-bg">
                    <Sidebar />
                </div>
            )}
            <div
                className={
                    activeMenu
                        ? 'dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  '
                        : 'bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 '
                }
            >
                <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
                    <Navbar />
                </div>
                <div>
                    {outlet}
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default ProtectedLayout