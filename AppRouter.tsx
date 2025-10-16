import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppContent } from './AppContent';
import { AnotherPage } from './AnotherPage'; // tu otra ruta

export const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/another" element={<AnotherPage />} />
        {/* Ruta por defecto si no coincide */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};
