import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.svg';
import Container from './Container';

const TABS = [
  {
    label: 'Calculator',
    path: '/',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path strokeLinecap="round" d="M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01" />
      </svg>
    ),
  },
  {
    label: 'History',
    path: '/history',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <>
      <header className="border-b border-gray-200 bg-white">
        <Container className="flex h-[55px] items-center justify-between sm:h-16">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <img src={logo} alt="FinCalc logo" className="h-6 w-6 sm:h-7 sm:w-7" />
              <span className="text-sm font-bold text-gray-900 sm:text-base">FinCalc</span>
            </div>

            <nav className="hidden items-center gap-1 sm:flex">
              {TABS.map((tab) => (
                <Link
                  key={tab.path}
                  to={tab.path}
                  aria-current={pathname === tab.path ? 'page' : undefined}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    pathname === tab.path
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </Link>
              ))}
            </nav>
          </div>

          <span className="hidden text-sm text-gray-500 sm:inline">Mortgage Simulator</span>
        </Container>
      </header>

      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-20 flex border-t border-gray-200 bg-white sm:hidden"
      >
        {TABS.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            aria-current={pathname === tab.path ? 'page' : undefined}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium ${
              pathname === tab.path ? 'text-indigo-600' : 'text-gray-500'
            }`}
          >
            {tab.icon}
            {tab.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
