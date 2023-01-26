import React from 'react'
import { SignupForm } from '../components'
import logo from '../data/Logo_signature.png'

const Signup = () => {
    return (
        <div className="bg-white dark:bg-gray-900">
            <div className="flex justify-center h-screen">
                <div className="hidden lg:block lg:w-2/3 bg-enflux_purple">
                    <div className="flex items-center justify-center h-full px-20">
                        <div>
                            {/* <h2 className="text-4xl font-bold text-white">Enflux</h2>

                            <p className="max-w-xl mt-3 text-gray-300">Lorem ipsum dolor sit, amet consectetur adipisicing elit. In autem ipsa, nulla laboriosam dolores, repellendus perferendis libero suscipit nam temporibus molestiae</p> */}
                            <img src={logo} alt="enflux-logo" className="w-[300px] h-[128px]" />
                        </div>
                    </div>
                </div>

                <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
                    <div className="flex-1">
                        <div className="text-center">
                            <h2 className="text-4xl font-bold text-center text-gray-700 dark:text-white">Enflux AI</h2>

                            {/* <p className="mt-3 text-gray-500 dark:text-gray-300">Sign in to access your account</p> */}
                        </div>

                        <SignupForm />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup