import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CalculatorPage from './CalculatorPage';
import { mockViewportWidth } from '../test/viewport';

const HISTORY_KEY = 'mortgage-history';
const DESKTOP_WIDTH = 1280;
const TABLET_WIDTH = 800;
const MOBILE_WIDTH = 375;

let originalMatchMedia;
let scrollIntoView;

async function fillAndCalculate(user, { amount = '100000', rate = '3.5' } = {}) {
  await user.type(screen.getByLabelText(/loan amount/i), amount);
  await user.type(screen.getByLabelText(/annual interest rate/i), rate);
  await user.click(screen.getByRole('button', { name: 'Calculate' }));
}

beforeEach(() => {
  originalMatchMedia = window.matchMedia;
  scrollIntoView = vi.fn();
  Element.prototype.scrollIntoView = scrollIntoView;
  localStorage.clear();
});

afterEach(() => {
  window.matchMedia = originalMatchMedia;
  delete Element.prototype.scrollIntoView;
});

describe('CalculatorPage result', () => {
  it('shows the placeholder before any calculation', () => {
    mockViewportWidth(DESKTOP_WIDTH);
    render(<CalculatorPage />);

    expect(screen.getByText('No result yet')).toBeInTheDocument();
  });

  it('shows the estimated installment after a valid calculation', async () => {
    mockViewportWidth(DESKTOP_WIDTH);
    const user = userEvent.setup();
    render(<CalculatorPage />);

    await fillAndCalculate(user);

    expect(screen.getByText('€ 579,96')).toBeInTheDocument();
  });

  it('clears the result when a field is edited after calculating', async () => {
    mockViewportWidth(DESKTOP_WIDTH);
    const user = userEvent.setup();
    render(<CalculatorPage />);

    await fillAndCalculate(user);
    await user.type(screen.getByLabelText(/loan amount/i), '1');

    expect(screen.queryByText('Estimated installment')).not.toBeInTheDocument();
  });
});

describe('CalculatorPage auto-scroll to result', () => {
  it('scrolls the result into view on a mobile viewport', async () => {
    mockViewportWidth(MOBILE_WIDTH);
    const user = userEvent.setup();
    render(<CalculatorPage />);

    await fillAndCalculate(user);

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
  });

  it('still scrolls on a tablet viewport where the layout is stacked', async () => {
    mockViewportWidth(TABLET_WIDTH);
    const user = userEvent.setup();
    render(<CalculatorPage />);

    await fillAndCalculate(user);

    expect(scrollIntoView).toHaveBeenCalledTimes(1);
  });

  it('does not scroll on desktop where form and result are side by side', async () => {
    mockViewportWidth(DESKTOP_WIDTH);
    const user = userEvent.setup();
    render(<CalculatorPage />);

    await fillAndCalculate(user);

    expect(screen.getByText('€ 579,96')).toBeInTheDocument();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('does not scroll when validation fails and there is no result', async () => {
    mockViewportWidth(MOBILE_WIDTH);
    const user = userEvent.setup();
    render(<CalculatorPage />);

    await user.click(screen.getByRole('button', { name: 'Calculate' }));

    expect(screen.getAllByRole('alert')).toHaveLength(2);
    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});

describe('CalculatorPage saving', () => {
  it('persists the calculated simulation to storage when Save is clicked', async () => {
    mockViewportWidth(DESKTOP_WIDTH);
    const user = userEvent.setup();
    render(<CalculatorPage />);

    await fillAndCalculate(user);
    await user.click(screen.getByRole('button', { name: /save/i }));

    const [saved, ...rest] = JSON.parse(localStorage.getItem(HISTORY_KEY));
    expect(rest).toHaveLength(0);
    expect(saved).toMatchObject({
      amount: 100000,
      rate: 3.5,
      duration: 20,
      payments: 12,
      type: 'Fixed',
    });
    expect(saved.monthly).toBeCloseTo(579.96, 2);
  });
});
