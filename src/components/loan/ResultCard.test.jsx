import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ResultCard from './ResultCard';

const baseResult = {
  amount: 100000,
  rate: 3.5,
  termYears: 20,
  paymentsPerYear: 12,
  rateType: 'Fixed',
  installment: 592.89,
  totalPayment: 142293.6,
  totalInterest: 42293.6,
};

describe('ResultCard empty state', () => {
  it('shows the placeholder and no result data when result is null', () => {
    render(<ResultCard result={null} />);

    expect(screen.getByText('No result yet')).toBeInTheDocument();
    expect(screen.queryByText('Estimated installment')).not.toBeInTheDocument();
  });
});

describe('ResultCard result rendering', () => {
  it('formats the installment with formatCurrency', () => {
    render(<ResultCard result={baseResult} />);

    expect(screen.getByText('€ 592,89')).toBeInTheDocument();
  });

  it('formats the principal, total payment and total interest with formatCurrency', () => {
    render(<ResultCard result={baseResult} />);

    expect(screen.getByText('€ 100.000,00')).toBeInTheDocument();
    expect(screen.getByText('€ 142.293,60')).toBeInTheDocument();
    expect(screen.getByText('€ 42.293,60')).toBeInTheDocument();
  });

  it('shows the raw rate as a percentage, not currency-formatted', () => {
    render(<ResultCard result={baseResult} />);

    expect(screen.getByText('3.5%')).toBeInTheDocument();
  });

  it('shows the term in years and the payments per year', () => {
    render(<ResultCard result={baseResult} />);

    expect(screen.getByText('20 years')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('shows the rate type badge', () => {
    render(<ResultCard result={baseResult} />);

    expect(screen.getByText('Fixed')).toBeInTheDocument();
  });
});

describe('ResultCard variable rate banner', () => {
  it('does not show the variable rate warning for a Fixed rate', () => {
    render(<ResultCard result={{ ...baseResult, rateType: 'Fixed' }} />);

    expect(screen.queryByText(/indicative only/i)).not.toBeInTheDocument();
  });

  it('shows the variable rate warning for a Variable rate', () => {
    render(<ResultCard result={{ ...baseResult, rateType: 'Variable' }} />);

    expect(screen.getByText(/indicative only/i)).toBeInTheDocument();
  });
});
