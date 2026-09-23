import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CalculatorPage from './pages/CalculatorPage';
import HistoryPage from './pages/HistoryPage';

/**
 * Root component: defines the global page layout and the client-side routes.
 *
 * Layout: a full-height column with the navbar on top, the routed page in the
 * middle and the footer at the bottom. On mobile (below the `sm` breakpoint)
 * the navigation is a fixed bar at the bottom of the screen, so the wrapper
 * adds `pb-14` (the bar's height) to prevent it from covering the content.
 *
 * Routes:
 *   - `/`           Calculator page (home).
 *   - `/calculator` Redirects to `/` (replacing the history entry) so the
 *                   calculator has a single canonical URL.
 *   - `/history`    History of saved simulations.
 *
 * The router itself (`BrowserRouter`) is provided in `index.jsx`.
 */
export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 pb-14 sm:pb-0">
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
