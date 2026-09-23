import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ComparisonPanel from './ComparisonPanel';

const entryA = {
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
};

const entryB = {
  id: 'b',
  date: '2026-01-01T00:00:00',
  amount: 50000,
  rate: 4,
  duration: 10,
  payments: 4,
  type: 'Variable',
  monthly: 250,
  total: 12000,
  interest: 2000,
};

const entryC = {
  id: 'c',
  date: '2026-06-10T09:00:00',
  amount: 75000,
  rate: 2.9,
  duration: 15,
  payments: 1,
  type: 'Fixed',
  monthly: 480,
  total: 86400,
  interest: 11400,
};

function rowValues(label) {
  const row = screen.getByText(label).closest('tr');
  return within(row)
    .getAllByRole('cell')
    .slice(1)
    .map((cell) => cell.textContent);
}

describe('ComparisonPanel guard condition', () => {
  it('renders nothing when fewer than 2 entries are provided', () => {
    const { container } = render(<ComparisonPanel entries={[entryA]} onClose={vi.fn()} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing when no entries are provided', () => {
    const { container } = render(<ComparisonPanel entries={[]} onClose={vi.fn()} />);

    expect(container).toBeEmptyDOMElement();
  });
});

describe('ComparisonPanel rendering with 2 entries', () => {
  it('renders one column header per entry in order', () => {
    render(<ComparisonPanel entries={[entryA, entryB]} onClose={vi.fn()} />);

    expect(screen.getByText('Sim #1')).toBeInTheDocument();
    expect(screen.getByText('Sim #2')).toBeInTheDocument();
  });

  it('formats the Date row with formatDateTime for each entry', () => {
    render(<ComparisonPanel entries={[entryA, entryB]} onClose={vi.fn()} />);

    expect(rowValues('Date')).toEqual(['15 Mar 2026 - 14:30', '1 Jan 2026 - 00:00']);
  });

  it('formats the Amount, Installment, Total and Interest rows as currency', () => {
    render(<ComparisonPanel entries={[entryA, entryB]} onClose={vi.fn()} />);

    expect(rowValues('Amount')).toEqual(['€ 100.000,00', '€ 50.000,00']);
    expect(rowValues('Installment')).toEqual(['€ 592,89', '€ 250,00']);
    expect(rowValues('Total')).toEqual(['€ 142.293,60', '€ 12.000,00']);
    expect(rowValues('Interest')).toEqual(['€ 42.293,60', '€ 2.000,00']);
  });

  it('shows the raw Rate, Duration and Payments/yr values, not currency-formatted', () => {
    render(<ComparisonPanel entries={[entryA, entryB]} onClose={vi.fn()} />);

    expect(rowValues('Rate')).toEqual(['3.5%', '4%']);
    expect(rowValues('Duration')).toEqual(['20 yr', '10 yr']);
    expect(rowValues('Payments/yr')).toEqual(['12', '4']);
  });

  it('shows the Type row in lowercase', () => {
    render(<ComparisonPanel entries={[entryA, entryB]} onClose={vi.fn()} />);

    expect(rowValues('Type')).toEqual(['fixed', 'variable']);
  });
});

describe('ComparisonPanel rendering with 3 entries', () => {
  it('renders one column per entry and the correct values for each', () => {
    render(<ComparisonPanel entries={[entryA, entryB, entryC]} onClose={vi.fn()} />);

    expect(screen.getByText('Sim #1')).toBeInTheDocument();
    expect(screen.getByText('Sim #2')).toBeInTheDocument();
    expect(screen.getByText('Sim #3')).toBeInTheDocument();
    expect(rowValues('Amount')).toEqual(['€ 100.000,00', '€ 50.000,00', '€ 75.000,00']);
  });
});

describe('ComparisonPanel interaction', () => {
  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<ComparisonPanel entries={[entryA, entryB]} onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: /close comparison/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
