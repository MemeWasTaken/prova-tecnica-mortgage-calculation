import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HistoryPage from './HistoryPage';
import { mockViewportWidth } from '../test/viewport';

const HISTORY_KEY = 'mortgage-history';

const entries = [
  {
    id: 'a',
    date: '2026-03-15T14:30:00',
    amount: 100000,
    rate: 3.5,
    duration: 20,
    payments: 12,
    type: 'Fixed',
    monthly: 592.89,
    total: 142293.6,
    interest: 42293.6,
  },
  {
    id: 'b',
    date: '2026-01-01T09:00:00',
    amount: 50000,
    rate: 4,
    duration: 10,
    payments: 4,
    type: 'Variable',
    monthly: 250,
    total: 12000,
    interest: 2000,
  },
];

const DESKTOP_WIDTH = 1280;
const MOBILE_WIDTH = 375;

let originalMatchMedia;

function seedHistory(list = entries) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
}

beforeEach(() => {
  originalMatchMedia = window.matchMedia;
  localStorage.clear();
});

afterEach(() => {
  window.matchMedia = originalMatchMedia;
});

describe('HistoryPage empty state', () => {
  it('shows the empty state when nothing is saved', () => {
    mockViewportWidth(DESKTOP_WIDTH);
    render(<HistoryPage />);

    expect(screen.getByText('No simulations yet')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('adds dummy entries from the empty state and persists them', async () => {
    mockViewportWidth(DESKTOP_WIDTH);
    const user = userEvent.setup();
    render(<HistoryPage />);

    await user.click(screen.getByRole('button', { name: /add 10 dummy entries/i }));

    expect(screen.getAllByRole('checkbox')).toHaveLength(10);
    expect(JSON.parse(localStorage.getItem(HISTORY_KEY))).toHaveLength(10);
  });
});

describe('HistoryPage responsive list', () => {
  it('renders the table, and no card-only hint markup, on desktop', () => {
    seedHistory();
    mockViewportWidth(DESKTOP_WIDTH);
    render(<HistoryPage />);

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
  });

  it('renders cards instead of a table on mobile, without duplicating entries', () => {
    seedHistory();
    mockViewportWidth(MOBILE_WIDTH);
    render(<HistoryPage />);

    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
    expect(screen.getByText('monthly')).toBeInTheDocument();
  });
});

describe('HistoryPage selection and comparison', () => {
  async function selectBoth(user) {
    await user.click(screen.getByLabelText(/select simulation 1 of 2/i));
    await user.click(screen.getByLabelText(/select simulation 2 of 2/i));
  }

  it('shows the comparison table on desktop after selecting two entries', async () => {
    seedHistory();
    mockViewportWidth(DESKTOP_WIDTH);
    const user = userEvent.setup();
    render(<HistoryPage />);

    await selectBoth(user);
    await user.click(screen.getByRole('button', { name: /compare 2/i }));

    expect(screen.getByText('Parameter')).toBeInTheDocument();
    expect(screen.getAllByRole('table')).toHaveLength(2);
  });

  it('shows the comparison card list on mobile after selecting two entries', async () => {
    seedHistory();
    mockViewportWidth(MOBILE_WIDTH);
    const user = userEvent.setup();
    render(<HistoryPage />);

    await selectBoth(user);
    await user.click(screen.getByRole('button', { name: /compare 2/i }));

    expect(screen.getByText('Comparison')).toBeInTheDocument();
    expect(screen.queryByText('Parameter')).not.toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.getAllByText('Sim #1').length).toBeGreaterThan(1);
  });

  it('closes the comparison when the close button is clicked', async () => {
    seedHistory();
    mockViewportWidth(MOBILE_WIDTH);
    const user = userEvent.setup();
    render(<HistoryPage />);

    await selectBoth(user);
    await user.click(screen.getByRole('button', { name: /compare 2/i }));
    await user.click(screen.getByRole('button', { name: /close comparison/i }));

    expect(screen.queryByText('Comparison')).not.toBeInTheDocument();
  });

  it('deselects everything with the Deselect button', async () => {
    seedHistory();
    mockViewportWidth(DESKTOP_WIDTH);
    const user = userEvent.setup();
    render(<HistoryPage />);

    await selectBoth(user);
    await user.click(screen.getByRole('button', { name: /deselect/i }));

    screen.getAllByRole('checkbox').forEach((checkbox) => expect(checkbox).not.toBeChecked());
  });
});

describe('HistoryPage deletion', () => {
  it('deletes a single entry, updating both the list and storage', async () => {
    seedHistory();
    mockViewportWidth(MOBILE_WIDTH);
    const user = userEvent.setup();
    render(<HistoryPage />);

    await user.click(screen.getByLabelText(/delete simulation 1 of 2/i));

    expect(screen.getAllByRole('checkbox')).toHaveLength(1);
    expect(JSON.parse(localStorage.getItem(HISTORY_KEY)).map((e) => e.id)).toEqual(['b']);
  });

  it('keeps the data when the clear-all confirmation is cancelled', async () => {
    seedHistory();
    mockViewportWidth(DESKTOP_WIDTH);
    const user = userEvent.setup();
    render(<HistoryPage />);

    await user.click(screen.getByRole('button', { name: 'Clear all' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
    expect(JSON.parse(localStorage.getItem(HISTORY_KEY))).toHaveLength(2);
  });

  it('clears everything once the confirmation is accepted', async () => {
    seedHistory();
    mockViewportWidth(DESKTOP_WIDTH);
    const user = userEvent.setup();
    render(<HistoryPage />);

    await user.click(screen.getByRole('button', { name: 'Clear all' }));
    const dialog = screen.getByRole('dialog', { name: /clear all simulations/i });
    await user.click(within(dialog).getByRole('button', { name: 'Clear all' }));

    expect(screen.getByText('No simulations yet')).toBeInTheDocument();
    expect(localStorage.getItem(HISTORY_KEY)).toBeNull();
  });
});
