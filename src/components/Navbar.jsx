import { useState } from 'react';
import logo from '../assets/logo.svg';
import Container from './Container';

const TABS = ['Calculator', 'History'];

export default function Navbar() {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <header className="border-b border-gray-200 bg-white">
      <Container className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <img src={logo} alt="FinCalc logo" className="h-7 w-7" />
            <span className="font-bold text-gray-900">FinCalc</span>
          </div>

          <nav className="flex items-center gap-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <span className="text-sm text-gray-500">Mortgage Simulator</span>
      </Container>
    </header>
  );
}
