import { createContext } from 'react';
import type { AppContextType } from './appStore';

export const AppContext = createContext<AppContextType | undefined>(undefined);
