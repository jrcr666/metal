// store/appContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

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
type AppContextType = {
  title: Title | null;
  setTitle: (title: Title) => void;
  showOperatorModal: boolean;
  setShowOperatorModal: (show: boolean) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [title, setTitle] = useState<Title | null>(null);
  const [showOperatorModal, setShowOperatorModal] = useState(false);

  return (
    <AppContext.Provider value={{ title, setTitle, showOperatorModal, setShowOperatorModal }}>
      {children}
    </AppContext.Provider>
  );
};

// Hook para usar el contexto
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext debe usarse dentro de AppProvider');
  return context;
};
