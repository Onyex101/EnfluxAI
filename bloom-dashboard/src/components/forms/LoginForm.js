import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from "react-router-dom"
import { useAuth } from '../../contexts/AuthProvider'

const LoginForm = () => {
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const [error, setError] = useState('')
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const onSubmit = (data) => {
    setLoading((prev) => !prev)
    // console.log(data)
    setTimeout(() => {
      setLoading((prev) => !prev)
      reset()
      login(data)
    }, 2500)
  }
  return (
    <div className="mt-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* errors will return when field validation fails  */}
        {error
          && <div className="flex p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
            <svg aria-hidden="true" className="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
            <span className="sr-only">Info</span>
            <div>
              <span className="font-medium">Invalid email or password.</span> {error}
            </div>
          </div>}

        <div>
          <label htmlFor="email" className="block mb-2 text-sm text-gray-600 dark:text-gray-200">Email Address</label>
          <input type="email" name="email" id="email" placeholder="example@example.com" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-orange-400 dark:focus:border-orange-400 focus:ring-orange-400 focus:outline-none focus:ring focus:ring-opacity-40" {...register('email', { required: true })} />
        </div>

        <div className="mt-6">
          <div className="flex justify-between mb-2">
            <label htmlFor="password" className="text-sm text-gray-600 dark:text-gray-200">Password</label>
            <Link to='#' className="text-sm text-gray-400 focus:text-orange-500 hover:text-orange-500 hover:underline">Forgot password?</Link>
          </div>

          <input type="password" name="password" id="password" {...register('password', { required: true })} placeholder="Your Password" className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-400 bg-white border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 focus:border-orange-400 dark:focus:border-orange-400 focus:ring-orange-400 focus:outline-none focus:ring focus:ring-opacity-40" />
        </div>

        <div className="mt-6">
          <button
            className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-orange-800 rounded-md hover:bg-orange-600 focus:outline-none focus:bg-orange-600 focus:ring focus:ring-orange-500 focus:ring-opacity-50">
            {loading
              && <svg className="inline mr-2 w-6 h-6 text-gray-200 animate-spin dark:text-gray-100 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>}
            {!loading && 'Sign in'}
          </button>
        </div>
      </form>

      <p className="mt-6 text-sm text-center text-gray-400">Don&#x27;t have an account yet?
        <Link to="/signup" className="text-orange-800 focus:outline-none focus:underline hover:underline"> Sign up.
        </Link></p>
    </div>
  )
}

export default LoginForm