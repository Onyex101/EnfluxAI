import React from 'react'
import { FileForm } from '../components'
import ExcelTemplate from '../data/excel_template.png'
import Xlx_Icon from '../data/xls-icon.png'

const Batch = () => {
  return (
    <div className="mt-8 lg:mx-24">
      <div className="flex flex-col">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-xl w-full p-8 pt-9 m-3">
          <div className="font-medium text-xl">
            Batch predictions
          </div>
        </div>

        <div className="flex flex-col md:flex-row bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-xl w-full lg:w-full p-4 m-3">
          <div className="flex-1">
            <img className="max-w-full h-auto" src={ExcelTemplate} alt="description" />
          </div>
          <div className="flex flex-col justify-center flex-1 lg:ml-3">
            <div className="mx-auto flex justify-center mb-4">
              <img src={Xlx_Icon} alt="Microsoft Office Mac Tilt Excel Icon" className="object-cover h-20 w-20" />
            </div>
            <FileForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Batch;
