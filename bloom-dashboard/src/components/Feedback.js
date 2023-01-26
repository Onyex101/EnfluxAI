import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useStateContext } from '../contexts/ContextProvider'
import { FcCheckmark } from "react-icons/fc";

const url = process.env.REACT_APP_API_URL

const Feedback = () => {
    const [loading, setLoading] = useState(false)
    const [checkmark, setCheckmark] = useState(false)
    const { currentColor, questionID } = useStateContext()
    const { register, handleSubmit, reset } = useForm()

    useEffect(() => {
        const timer = setTimeout(() => setCheckmark(false), 3000);
        return () => clearTimeout(timer);
    }, [checkmark]);

    const onSubmit = (data) => {
        // console.log(questionID)
        if (questionID) {
            setLoading(prev => !prev)
            fetch(`${url}/predict/${questionID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    return Promise.reject(response);
                })
                .then(res => {
                    // console.log('Success:', res)
                    setLoading(prev => !prev)
                    setCheckmark(prev => !prev)
                    reset()
                })
                .catch(e => {
                    // console.log('Error:', e)
                    setLoading(prev => !prev)
                    reset()
                })
        }
    }

    return (
        <div className="w-full lg:pl-8">
            <div className="w-full md:w-5/6 flex flex-col float-right">
                <div className="flex flex-row">
                    Feedback
                    {checkmark && <span className='ml-1'><FcCheckmark /></span>}
                </div>
                <div className="">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-row">
                            <div className="flex-1">
                                <textarea rows="1" type="text" id="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" {...register('feedback', { required: true })} disabled={loading} />
                            </div>
                            <div className="lg:pl-3">
                                <button type="submit" className="text-white font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center disabled:opacity-50" style={{ backgroundColor: currentColor, color: 'white' }} disabled={loading}>
                                    {loading
                                        && <svg className="inline mr-2 w-6 h-6 text-gray-200 animate-spin dark:text-gray-100 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                        </svg>}
                                    {!loading && 'Submit'}
                                </button>
                            </div>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default Feedback