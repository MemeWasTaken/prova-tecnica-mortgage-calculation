export const PAYMENT_FREQUENCIES = [
  { label: 'Monthly', value: 12 },
  { label: 'Quarterly', value: 4 },
  { label: 'Semi-annual', value: 2 },
  { label: 'Annual', value: 1 },
];

export const RATE_TYPES = [
  { label: 'Fixed', value: 'Fixed' },
  { label: 'Variable', value: 'Variable' },
];

export const LOAN_CONSTRAINTS = {
  amount: { min: 0 },
  rate: { min: 0, step: 0.01, placeholder: 3.75 },
  termYears: { min: 1, max: 40 },
};

export const LOAN_DEFAULTS = {
  termYears: 20,
  paymentsPerYear: 12,
  rateType: 'Fixed',
};
