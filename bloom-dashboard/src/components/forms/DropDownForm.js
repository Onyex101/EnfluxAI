import React from 'react'
import { useStateContext } from '../../contexts/ContextProvider';

const DropDownForm = () => {
    const {setModel,model} = useStateContext()

    const handleChange = (event) => {
        setModel(event.target.value)
    };

    const options = [
        { key: 0, label: "Bloom's", value: 'blooms' },
        { key: 1, label: 'PANCE med', value: 'pance_med' }
    ];

    return (
        <>
            <div className="relative inline-block text-left">
                <div>
                    <select className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 dark:text-gray-200 dark:bg-secondary-dark-bg" role="none" value={model} onChange={handleChange}>
                        {/* Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700"  */}
                        {options.map((option) => (
                            <option key={option.key} className="text-gray-700 block px-4 py-2 text-sm" value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
            </div>
        </>
    )
}

export default DropDownForm