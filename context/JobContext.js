import { STEPS } from '@/components/JobWorkFlow/steps';
import { useFrappeGetDoc } from 'frappe-react-sdk';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { LayoutAnimation } from 'react-native';

const JobContext = createContext(null);

export const JobProvider = ({ jobId, children }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData]       = useState({});
  const [isLoaded, setIsLoaded]       = useState(false);

  const { data: jobDoc } = useFrappeGetDoc('Job Order', jobId);

  useEffect(() => {
    if (!jobDoc || isLoaded) return;

    let step = 0;
    const derived = {};

    for (const s of STEPS) {
      if (!s.completionField) break;
      const val = jobDoc[s.completionField];
      const isEmpty = !val || (Array.isArray(val) && val.length === 0);
      if (isEmpty) break;

      if (Array.isArray(val)) {
        derived[s.key] = { items: val.map(i => ({ item_code: i.item_code, qty: String(i.qty) })) };
      } else {
        derived[s.key] = { time: val };
      }
      step++;
    }

    setCurrentStep(step);
    setStepData(derived);
    setIsLoaded(true);
  }, [jobDoc]);

  const advanceStep = (stepKey, collected) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setStepData(prev => ({ ...prev, [stepKey]: collected }));
    setCurrentStep(prev => prev + 1);
  };

  const editStep = (stepKey, collected) => {
    setStepData(prev => ({ ...prev, [stepKey]: collected }));
  };

  return (
    <JobContext.Provider value={{ jobId, currentStep, stepData, advanceStep, editStep, isLoaded }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJob = () => useContext(JobContext);
