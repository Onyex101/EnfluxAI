import React from 'react';
import { LimeFrame, Feedback, PredictedClass, QuestionForm } from '../components';

const Demo = () => {
  return (
    <div className="mt-8 lg:mx-24">
      <div className="flex flex-col">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-xl w-full p-8 pt-9 m-3">
          <div className="font-medium text-xl">
            Bloom Classifier
          </div>
        </div>

        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-xl w-full lg:w-full p-8 pt-9 m-3 flex flex-col lg:flex-row">
          <div className="flex-1 lg:pr-8">
            <QuestionForm />
          </div>
          <div className="flex-1 lg:border-l-2 border-gray-300 min-h-[48px]">
            <div className="w-full h-full flex flex-col justify-between">
              <PredictedClass />
              <Feedback />
            </div>
          </div>
        </div>

        <div className="flex m-3 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-xl w-full lg:w-full p-8 pt-9">
          <LimeFrame />
        </div>
      </div>
    </div>
  );
};

export default Demo;
