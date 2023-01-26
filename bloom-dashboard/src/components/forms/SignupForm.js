import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { MdPersonOutline, MdMailOutline, MdOutlineLock } from "react-icons/md";
import { useNavigate } from "react-router-dom"

const SignupForm = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const onSubmit = (data) => {
    setLoading((prev) => !prev)
    // console.log(data)
    setTimeout(() => {
      setLoading((prev) => !prev)
      reset()
      navigate("/signup")
    }, 2500)
  }
  return (
    <div className="mt-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex -mx-3">
          <div className="w-1/2 px-3 mb-5">
            <label htmlFor="firstname" className="text-xs font-semibold px-1">First name</label>
            <div className="flex">
              <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center">
                <MdPersonOutline /></div>
              <input type="text" name='firstname' placeholder="John" className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-orange-500" {...register('firstname', { required: true })} />
            </div>
          </div>
          <div className="w-1/2 px-3 mb-5">
            <label htmlFor="lastname" className="text-xs font-semibold px-1">Last name</label>
            <div className="flex">
              <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><MdPersonOutline /></div>
              <input type="text" name='lastname' placeholder="Smith" className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-orange-500" {...register('lastname', { required: true })} />
            </div>
          </div>
        </div>
        <div className="flex -mx-3">
          <div className="w-full px-3 mb-5">
            <label htmlFor="email" className="text-xs font-semibold px-1">Email</label>
            <div className="flex">
              <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><MdMailOutline /></div>
              <input type="email" placeholder="example@example.com" name='email' className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-orange-500" {...register('email', { required: true })} />
            </div>
          </div>
        </div>
        <div className="flex -mx-3">
          <div className="w-full px-3 mb-12">
            <label htmlFor="password" className="text-xs font-semibold px-1">Password</label>
            <div className="flex">
              <div className="w-10 z-10 pl-1 text-center pointer-events-none flex items-center justify-center"><MdOutlineLock /></div>
              <input type="password" placeholder="********" name='password' className="w-full -ml-10 pl-10 pr-3 py-2 rounded-lg border-2 border-gray-200 outline-none focus:border-orange-500" {...register('password', { required: true })} />
            </div>
          </div>
        </div>
        <div className="flex -mx-3">
          <div className="w-full px-3 mb-5">
            <button className="block w-full max-w-xs mx-auto bg-orange-500 hover:bg-orange-700 focus:bg-orange-700 text-white rounded-lg px-3 py-3 font-semibold">
              {loading
                && <svg className="inline mr-2 w-6 h-6 text-gray-200 animate-spin dark:text-gray-100 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>}
              {!loading && 'Sign up'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SignupForm