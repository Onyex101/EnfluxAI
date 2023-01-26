import React from 'react'
import { useStateContext } from '../contexts/ContextProvider'

const ToggleSwitch = () => {
    const { feedbackToggle, setFeedbackToggle } = useStateContext()
    return (
        <div className="relative flex flex-col items-center justify-center overflow-hidden ml-4">
            <div className="flex">
                <label className="inline-flex relative items-center mr-5 cursor-pointer">
                    <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={feedbackToggle}
                        readOnly
                    />
                    <div
                        onClick={() => {
                            setFeedbackToggle(prev => !prev);
                        }}
                        className="w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-orange-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"
                    ></div>
                </label>
            </div>
        </div>
    )
}

export default ToggleSwitch