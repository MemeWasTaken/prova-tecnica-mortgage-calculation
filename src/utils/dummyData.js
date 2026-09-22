import { calculateMortgage } from './mortgage';

const AMOUNT_RANGE = { min: 50000, max: 520000 };
const RATE_RANGE = { min: 1.99, max: 5 };
const DURATION_RANGE = { min: 5, max: 40 };
const PAYMENT_FREQUENCIES = [12, 4, 2, 1];
const RATE_TYPES = ['Fixed', 'Variable'];
const MAX_DAYS_BACK = 45;
const ENTRIES_COUNT = 10;

function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

function randomIntInRange(min, max) {
  return Math.floor(randomInRange(min, max + 1));
}

function randomFromArray(options) {
  return options[Math.floor(Math.random() * options.length)];
}

export function generateDummyEntries() {
  return Array.from({ length: ENTRIES_COUNT }, () => {
    const amount = randomIntInRange(AMOUNT_RANGE.min, AMOUNT_RANGE.max);
    const rate = Number(randomInRange(RATE_RANGE.min, RATE_RANGE.max).toFixed(2));
    const duration = randomIntInRange(DURATION_RANGE.min, DURATION_RANGE.max);
    const payments = randomFromArray(PAYMENT_FREQUENCIES);
    const type = randomFromArray(RATE_TYPES);

    const { installment, totalPayment, totalInterest } = calculateMortgage({
      amount,
      rate,
      termYears: duration,
      paymentsPerYear: payments,
    });

    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * MAX_DAYS_BACK));

    return {
      date: date.toISOString(),
      amount,
      rate,
      duration,
      payments,
      type,
      monthly: installment,
      total: totalPayment,
      interest: totalInterest,
    };
  });
}
