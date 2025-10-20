import './App.css';
import { AppContent } from './components/AppContent/AppContent';
import { AppProvider } from './store/appStore';

export const App = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);
