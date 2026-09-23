import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoanForm from './LoanForm';

function setup(props = {}) {
  const onCalculate = vi.fn();
  const onSave = vi.fn();
  const user = userEvent.setup();
  render(<LoanForm onCalculate={onCalculate} onSave={onSave} hasResult={false} {...props} />);
  return { onCalculate, onSave, user };
}

async function fillValid(user) {
  await user.type(screen.getByLabelText(/loan amount/i), '100000');
  await user.type(screen.getByLabelText(/annual interest rate/i), '3.5');
}

describe('LoanForm initial rendering', () => {
  it('renders the default term, payment frequency and rate type', () => {
    setup();

    expect(screen.getByRole('slider')).toHaveValue('20');
    expect(screen.getByRole('button', { name: 'Monthly' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Fixed' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('does not render the Save button when hasResult is false', () => {
    setup({ hasResult: false });

    expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument();
  });
});

describe('LoanForm validation on submit', () => {
  it('shows both errors and calls onCalculate(null) when submitted empty', async () => {
    const { onCalculate, user } = setup();

    await user.click(screen.getByRole('button', { name: /calculate/i }));

    expect(screen.getAllByRole('alert')).toHaveLength(2);
    expect(onCalculate).toHaveBeenCalledWith(null);
  });

  it('shows only the amount error when the amount is 0', async () => {
    const { user } = setup();

    await user.type(screen.getByLabelText(/loan amount/i), '0');
    await user.type(screen.getByLabelText(/annual interest rate/i), '3.5');
    await user.click(screen.getByRole('button', { name: /calculate/i }));

    expect(screen.getAllByRole('alert')).toHaveLength(1);
    expect(screen.getByText(/valid loan amount/i)).toBeInTheDocument();
  });

  it('shows only the rate error when the rate is negative', async () => {
    const { user } = setup();

    await user.type(screen.getByLabelText(/loan amount/i), '100000');
    await user.type(screen.getByLabelText(/annual interest rate/i), '-1');
    await user.click(screen.getByRole('button', { name: /calculate/i }));

    expect(screen.getAllByRole('alert')).toHaveLength(1);
    expect(screen.getByText(/valid interest rate/i)).toBeInTheDocument();
  });

  it('treats a rate of 0 as valid', async () => {
    const { onCalculate, user } = setup();

    await user.type(screen.getByLabelText(/loan amount/i), '100000');
    await user.type(screen.getByLabelText(/annual interest rate/i), '0');
    await user.click(screen.getByRole('button', { name: /calculate/i }));

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(onCalculate).toHaveBeenLastCalledWith(expect.objectContaining({ rate: 0 }));
  });

  it('calls onCalculate with the correct numeric payload on valid submit', async () => {
    const { onCalculate, user } = setup();

    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /calculate/i }));

    expect(onCalculate).toHaveBeenLastCalledWith({
      amount: 100000,
      rate: 3.5,
      termYears: 20,
      paymentsPerYear: 12,
      rateType: 'Fixed',
    });
  });
});

describe('LoanForm state reset on field change', () => {
  it('calls onCalculate(null) whenever a field changes', async () => {
    const { onCalculate, user } = setup();

    await user.type(screen.getByLabelText(/loan amount/i), '1');

    expect(onCalculate).toHaveBeenCalledWith(null);
  });

  it('reverts the Save button to "+ Save" after a field changes', async () => {
    const onSave = vi.fn();
    const onCalculate = vi.fn();
    const user = userEvent.setup();
    render(<LoanForm onCalculate={onCalculate} onSave={onSave} hasResult />);

    await user.click(screen.getByRole('button', { name: /save/i }));
    expect(screen.getByRole('button', { name: /saved/i })).toBeDisabled();

    await user.type(screen.getByLabelText(/loan amount/i), '1');

    const saveButton = screen.getByRole('button', { name: /save/i });
    expect(saveButton).not.toBeDisabled();
    expect(saveButton).toHaveTextContent('+ Save');
  });
});

describe('LoanForm toggle interactions', () => {
  it('updates the payment frequency and includes it in the submitted payload', async () => {
    const { onCalculate, user } = setup();

    await user.click(screen.getByRole('button', { name: 'Quarterly' }));
    expect(screen.getByRole('button', { name: 'Quarterly' })).toHaveAttribute('aria-pressed', 'true');

    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /calculate/i }));

    expect(onCalculate).toHaveBeenLastCalledWith(expect.objectContaining({ paymentsPerYear: 4 }));
  });

  it('updates the rate type and includes it in the submitted payload', async () => {
    const { onCalculate, user } = setup();

    await user.click(screen.getByRole('button', { name: 'Variable' }));
    expect(screen.getByRole('button', { name: 'Variable' })).toHaveAttribute('aria-pressed', 'true');

    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /calculate/i }));

    expect(onCalculate).toHaveBeenLastCalledWith(expect.objectContaining({ rateType: 'Variable' }));
  });
});

describe('LoanForm loan term clamping', () => {
  it('clamps a value above the max down to 40', () => {
    setup();

    const termInput = screen.getByLabelText('Loan term in years');
    fireEvent.change(termInput, { target: { value: '999' } });

    expect(screen.getByRole('slider')).toHaveValue('40');
  });

  it('clamps a value below the min up to 1', () => {
    setup();

    const termInput = screen.getByLabelText('Loan term in years');
    fireEvent.change(termInput, { target: { value: '0' } });

    expect(screen.getByRole('slider')).toHaveValue('1');
  });

  it('does not update the term when the number input is cleared', () => {
    setup();

    const termInput = screen.getByLabelText('Loan term in years');
    fireEvent.change(termInput, { target: { value: '' } });

    expect(screen.getByRole('slider')).toHaveValue('20');
  });
});

describe('LoanForm Save button', () => {
  it('calls onSave and switches to the saved state when clicked', async () => {
    const onSave = vi.fn();
    const onCalculate = vi.fn();
    const user = userEvent.setup();
    render(<LoanForm onCalculate={onCalculate} onSave={onSave} hasResult />);

    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: /saved/i })).toBeDisabled();
  });
});
