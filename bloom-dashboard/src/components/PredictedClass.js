import React from 'react'
import { useStateContext } from '../contexts/ContextProvider'

const PredictedClass = () => {
    const { prediction } = useStateContext()
    return (
        <div className="flex justify-center lg:pl-8 mb-4">
            <ul className="w-full flex flex-col divide-y divide-gray-200 dark:divide-gray-700">
                <li className="inline-flex items-center gap-x-2 py-3 font-medium text-gray-800 dark:text-white">
                    <div className="flex justify-between w-full font-bold text-sm">
                        TAG
                        <span className="inline-flex items-center text-l">CONFIDENCE</span>
                    </div>
                </li>
                <li className="inline-flex items-center gap-x-2 py-3 font-medium text-gray-800 dark:text-white">
                    <div className="flex justify-between w-full text-sm">
                        {prediction.prediction}
                        <span className="inline-flex items-center font-medium text-green-500">{prediction.proba}</span>
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default PredictedClass