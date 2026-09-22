import { useState } from 'react';
import Container from '../components/Container';
import HistoryToolbar from '../components/history/HistoryToolbar';
import SimulationTable from '../components/history/SimulationTable';
import ClearAllModal from '../components/history/ClearAllModal';
import { clearHistory, getHistory, removeCalculation } from '../utils/storage';

export default function HistoryPage() {
  const [history, setHistory] = useState(() => getHistory());
  const [selectedIds, setSelectedIds] = useState([]);
  const [isClearAllOpen, setIsClearAllOpen] = useState(false);

  const handleClearAllClick = () => setIsClearAllOpen(true);

  const handleConfirmClearAll = () => {
    clearHistory();
    setHistory([]);
    setSelectedIds([]);
    setIsClearAllOpen(false);
  };

  const handleDelete = (id) => {
    removeCalculation(id);
    setHistory((current) => current.filter((entry) => entry.id !== id));
    setSelectedIds((current) => current.filter((selectedId) => selectedId !== id));
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id],
    );
  };

  const handleDeselect = () => setSelectedIds([]);

  return (
    <main className="flex-1">
      <Container className="py-10">
        <h1 className="text-3xl font-bold text-gray-900">Simulation History</h1>
        <p className="mt-2 text-gray-500">
          Review, compare, and manage your saved mortgage simulations.
        </p>

        {history.length === 0 ? (
          <div className="mt-8 flex min-h-72 flex-col items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white text-center shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-900">No simulations yet</p>
            <p className="text-sm text-gray-500">
              Run a calculation and save it to start building your history.
            </p>
          </div>
        ) : (
          <>
            <HistoryToolbar
              count={history.length}
              selectedCount={selectedIds.length}
              onClearAll={handleClearAllClick}
              onDeselect={handleDeselect}
            />
            <SimulationTable
              history={history}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onDelete={handleDelete}
            />
          </>
        )}
      </Container>

      <ClearAllModal
        isOpen={isClearAllOpen}
        onClose={() => setIsClearAllOpen(false)}
        onConfirm={handleConfirmClearAll}
      />
    </main>
  );
}
