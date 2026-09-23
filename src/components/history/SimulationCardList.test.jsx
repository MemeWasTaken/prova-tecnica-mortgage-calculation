import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SimulationCardList from './SimulationCardList';

const entry1 = {
  id: 'a1',
  date: '2026-03-15',
  amount: 100000,
  rate: 3.5,
  duration: 20,
  payments: 12,
  type: 'Fixed',
  monthly: 592.89,
};

const entry2 = {
  id: 'a2',
  date: '2026-01-01',
  amount: 50000,
  rate: 4,
  duration: 10,
  payments: 4,
  type: 'Variable',
  monthly: 250,
};

function setup({ history = [entry1, entry2], selectedIds = [] } = {}) {
  const onToggleSelect = vi.fn();
  const onDelete = vi.fn();
  const user = userEvent.setup();
  render(
    <SimulationCardList
      history={history}
      selectedIds={selectedIds}
      onToggleSelect={onToggleSelect}
      onDelete={onDelete}
    />,
  );
  return { onToggleSelect, onDelete, user };
}

describe('SimulationCardList rendering', () => {
  it('renders no cards when history is empty', () => {
    setup({ history: [] });

    expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
  });

  it('renders one card per history entry with formatted values', () => {
    setup();

    const card1 = screen.getByText('15 Mar 2026').closest('div.rounded-lg');
    expect(within(card1).getByText('€ 100.000,00')).toBeInTheDocument();
    expect(within(card1).getByText('3.5%')).toBeInTheDocument();
    expect(within(card1).getByText('20 yr')).toBeInTheDocument();
    expect(within(card1).getByText('monthly')).toBeInTheDocument();
    expect(within(card1).getByText('Fixed')).toBeInTheDocument();
    expect(within(card1).getByText('€ 592,89')).toBeInTheDocument();

    const card2 = screen.getByText('1 Jan 2026').closest('div.rounded-lg');
    expect(within(card2).getByText('€ 50.000,00')).toBeInTheDocument();
    expect(within(card2).getByText('quarterly')).toBeInTheDocument();
    expect(within(card2).getByText('Variable')).toBeInTheDocument();
  });
});

describe('SimulationCardList selection', () => {
  it('leaves the checkbox unchecked when the entry id is not selected', () => {
    setup({ selectedIds: [] });

    expect(screen.getByLabelText('Select simulation 1 of 2 from 15 Mar 2026')).not.toBeChecked();
  });

  it('checks the checkbox when the entry id is selected', () => {
    setup({ selectedIds: ['a1'] });

    expect(screen.getByLabelText('Select simulation 1 of 2 from 15 Mar 2026')).toBeChecked();
  });

  it('calls onToggleSelect with the entry id when the card is clicked', async () => {
    const { onToggleSelect, user } = setup();

    await user.click(screen.getByText('€ 100.000,00'));

    expect(onToggleSelect).toHaveBeenCalledWith('a1');
  });

  it('calls onToggleSelect exactly once when the checkbox itself is clicked', async () => {
    const { onToggleSelect, user } = setup();

    await user.click(screen.getByLabelText('Select simulation 1 of 2 from 15 Mar 2026'));

    expect(onToggleSelect).toHaveBeenCalledTimes(1);
    expect(onToggleSelect).toHaveBeenCalledWith('a1');
  });
});

describe('SimulationCardList deletion', () => {
  it('calls onDelete with the entry id when the delete button is clicked', async () => {
    const { onDelete, user } = setup();

    await user.click(screen.getByLabelText('Delete simulation 1 of 2 from 15 Mar 2026'));

    expect(onDelete).toHaveBeenCalledWith('a1');
  });

  it('does not call onToggleSelect when the delete button is clicked', async () => {
    const { onToggleSelect, user } = setup();

    await user.click(screen.getByLabelText('Delete simulation 1 of 2 from 15 Mar 2026'));

    expect(onToggleSelect).not.toHaveBeenCalled();
  });
});

describe('SimulationCardList comparison hint', () => {
  it('does not show the hint when no entry is selected', () => {
    setup({ selectedIds: [] });

    expect(screen.queryByText(/select one more/i)).not.toBeInTheDocument();
  });

  it('does not show the hint when two entries are selected', () => {
    setup({ selectedIds: ['a1', 'a2'] });

    expect(screen.queryByText(/select one more/i)).not.toBeInTheDocument();
  });

  it('shows the hint when exactly one entry is selected', () => {
    setup({ selectedIds: ['a1'] });

    expect(screen.getByText(/select one more/i)).toBeInTheDocument();
  });
});
