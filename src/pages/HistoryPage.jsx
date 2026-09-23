import { useState } from 'react';
import Container from '../components/Container';
import HistoryToolbar from '../components/history/HistoryToolbar';
import SimulationTable from '../components/history/SimulationTable';
import SimulationCardList from '../components/history/SimulationCardList';
import ClearAllModal from '../components/history/ClearAllModal';
import ComparisonPanel from '../components/history/ComparisonPanel';
import ComparisonCardList from '../components/history/ComparisonCardList';
import { addDummyEntries, clearHistory, getHistory, removeCalculation } from '../utils/storage';
import { generateDummyEntries } from '../utils/dummyData';
import { useMediaQuery } from '../hooks/useMediaQuery';

export default function HistoryPage() {
  const [history, setHistory] = useState(() => getHistory());
  const [selectedIds, setSelectedIds] = useState([]);
  const [isClearAllOpen, setIsClearAllOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 640px)');

  const handleClearAllClick = () => setIsClearAllOpen(true);
  const handleCompareClick = () => setIsCompareOpen(true);

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

  const handleAddDummy = () => {
    const savedEntries = addDummyEntries(generateDummyEntries());
    setHistory((current) => [...savedEntries, ...current]);
  };

  const compareEntries = selectedIds
    .map((id) => history.find((entry) => entry.id === id))
    .filter(Boolean);

  return (
    <main className="flex-1">
      <Container className="py-6 sm:py-10">
        <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">Simulation History</h1>
        <p className="mt-2 text-xs text-gray-500 sm:text-base">
          Review, compare, and manage your saved mortgage simulations.
        </p>

        {history.length === 0 ? (
          <div className="mt-8 flex min-h-72 flex-col items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-8 text-center shadow-sm sm:px-10">
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
            <button
              type="button"
              onClick={handleAddDummy}
              className="mt-2 rounded-md border border-gray-200 px-3 py-1.5 text-sm font-normal text-gray-600 hover:bg-gray-50"
            >
              + Add 10 dummy entries
            </button>
          </div>
        ) : (
          <>
            <HistoryToolbar
              count={history.length}
              selectedCount={selectedIds.length}
              onClearAll={handleClearAllClick}
              onDeselect={handleDeselect}
              onCompare={handleCompareClick}
              onAddDummy={handleAddDummy}
            />
            {isCompareOpen && compareEntries.length > 1 && (
              isDesktop ? (
                <ComparisonPanel entries={compareEntries} onClose={() => setIsCompareOpen(false)} />
              ) : (
                <ComparisonCardList entries={compareEntries} onClose={() => setIsCompareOpen(false)} />
              )
            )}
            {isDesktop ? (
              <SimulationTable
                history={history}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onDelete={handleDelete}
              />
            ) : (
              <SimulationCardList
                history={history}
                selectedIds={selectedIds}
                onToggleSelect={handleToggleSelect}
                onDelete={handleDelete}
              />
            )}
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
