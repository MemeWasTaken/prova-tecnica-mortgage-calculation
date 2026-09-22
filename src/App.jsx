import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CalculatorPage from './pages/CalculatorPage';
import HistoryPage from './pages/HistoryPage';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<CalculatorPage />} />
        <Route path="/calculator" element={<Navigate to="/" replace />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
      <Footer />
    </div>
  );
}
