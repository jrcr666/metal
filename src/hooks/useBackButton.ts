import { useEffect } from 'react';
import { useDevice } from '../store/deviceStore';

export const useBackButton = () => {
  const { state } = useDevice();

  useEffect(() => {
    const handleBack = (e: Event) => {
      e.preventDefault();
      // tu lógica original de onBackKeyDown usando state.ButtonsTime
    };

    document.addEventListener('backbutton', handleBack, false);

    return () => document.removeEventListener('backbutton', handleBack);
  }, [state]);
};
