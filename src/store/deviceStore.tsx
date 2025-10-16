// store/deviceStore.ts
import { createContext, useContext, useState } from 'react';

interface DeviceState {
  IamDevice: boolean;
  IamEmulator: boolean;
  devicePlatform: string;
  ButtonsTime: number[];
}

const defaultState: DeviceState = {
  IamDevice: false,
  IamEmulator: false,
  devicePlatform: '',
  ButtonsTime: [],
};

const DeviceContext = createContext<{
  state: DeviceState;
  setState: React.Dispatch<React.SetStateAction<DeviceState>>;
}>({ state: defaultState, setState: () => {} });

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState(defaultState);
  return <DeviceContext.Provider value={{ state, setState }}>{children}</DeviceContext.Provider>;
};

export const useDevice = () => useContext(DeviceContext);
