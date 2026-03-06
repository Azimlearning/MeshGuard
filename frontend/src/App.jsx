import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MobileApp from './pages/MobileApp';
import 'leaflet/dist/leaflet.css';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mobile" element={<MobileApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
