import { describe, it, expect } from 'vitest';
import { calculateMortgage } from './mortgage';

describe('calculateMortgage', () => {
  it('computes installment, totalPayment and totalInterest for a standard monthly loan', () => {
    const result = calculateMortgage({
      amount: 100000,
      rate: 3.75,
      termYears: 20,
      paymentsPerYear: 12,
    });

    expect(result.installment).toBeCloseTo(592.89, 2);
    expect(result.totalPayment).toBeCloseTo(result.installment * 240, 8);
    expect(result.totalInterest).toBeCloseTo(result.totalPayment - 100000, 8);
  });

  it('splits the principal evenly with no interest when rate is 0', () => {
    const result = calculateMortgage({
      amount: 12000,
      rate: 0,
      termYears: 10,
      paymentsPerYear: 12,
    });

    expect(result.installment).toBeCloseTo(100, 8);
    expect(result.totalPayment).toBeCloseTo(12000, 8);
    expect(result.totalInterest).toBeCloseTo(0, 8);
  });

  it('produces a larger installment for less frequent payments at the same rate', () => {
    const monthly = calculateMortgage({
      amount: 50000,
      rate: 5,
      termYears: 15,
      paymentsPerYear: 12,
    });
    const annual = calculateMortgage({
      amount: 50000,
      rate: 5,
      termYears: 15,
      paymentsPerYear: 1,
    });

    expect(annual.installment).toBeGreaterThan(monthly.installment);
  });

  it('returns 0 for every field when the loan amount is 0', () => {
    const result = calculateMortgage({
      amount: 0,
      rate: 4,
      termYears: 20,
      paymentsPerYear: 12,
    });

    expect(result.installment).toBeCloseTo(0, 8);
    expect(result.totalPayment).toBeCloseTo(0, 8);
    expect(result.totalInterest).toBeCloseTo(0, 8);
  });

  it('charges exactly one period of interest when there is a single payment', () => {
    const result = calculateMortgage({
      amount: 10000,
      rate: 6,
      termYears: 1,
      paymentsPerYear: 1,
    });

    expect(result.installment).toBeCloseTo(10000 * 1.06, 8);
    expect(result.totalPayment).toBeCloseTo(result.installment, 8);
    expect(result.totalInterest).toBeCloseTo(600, 8);
  });

  it('produces a larger installment for a higher rate at the same amount and term', () => {
    const lowRate = calculateMortgage({
      amount: 50000,
      rate: 3,
      termYears: 15,
      paymentsPerYear: 12,
    });
    const highRate = calculateMortgage({
      amount: 50000,
      rate: 7,
      termYears: 15,
      paymentsPerYear: 12,
    });

    expect(highRate.installment).toBeGreaterThan(lowRate.installment);
  });

  it('scales installment and totalPayment linearly with the loan amount', () => {
    const base = calculateMortgage({
      amount: 20000,
      rate: 4.5,
      termYears: 10,
      paymentsPerYear: 12,
    });
    const doubled = calculateMortgage({
      amount: 40000,
      rate: 4.5,
      termYears: 10,
      paymentsPerYear: 12,
    });

    expect(doubled.installment).toBeCloseTo(base.installment * 2, 8);
    expect(doubled.totalPayment).toBeCloseTo(base.totalPayment * 2, 8);
  });

  it('does not validate negative inputs and simply propagates them through the formula', () => {
    const result = calculateMortgage({
      amount: -10000,
      rate: 5,
      termYears: 10,
      paymentsPerYear: 12,
    });

    expect(result.installment).toBeLessThan(0);
    expect(result.totalPayment).toBeCloseTo(result.installment * 120, 8);
    expect(result.totalInterest).toBeCloseTo(result.totalPayment + 10000, 8);
  });
});
