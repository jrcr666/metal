import './App.css';
import { AppContent } from './components/AppContent/AppContent';
import { DeviceProvider } from './store/deviceStore';
import { AppProvider } from './store/appStore';
import { UserProvider } from './store/userStore';

export const App = () => (
  <UserProvider>
    <DeviceProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </DeviceProvider>
  </UserProvider>
);
