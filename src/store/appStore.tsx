// store/appContext.ts
import type { ReactNode } from 'react';
import { useState } from 'react';
import { AppContext } from './contexts';

// Tipado de operadores
export type Operator = {
  OperatorId: string;
  Name: string;
  Active: boolean;
};

// Tipado de title
export type Title = {
  text: string;
  onClick: VoidFunction;
  operators: Operator[];
  assignOperator: boolean;
  activeOperator: string | null;
  stationId: string;
};

// Tipado del contexto
export type AppContextType = {
  title: Title | null;
  setTitle: (title: Title) => void;
  showOperatorModal: boolean;
  setShowOperatorModal: (show: boolean) => void;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [title, setTitle] = useState<Title | null>(null);
  const [showOperatorModal, setShowOperatorModal] = useState(false);

  return (
    <AppContext.Provider value={{ title, setTitle, showOperatorModal, setShowOperatorModal }}>
      {children}
    </AppContext.Provider>
  );
};
