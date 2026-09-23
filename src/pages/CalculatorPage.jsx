import { useEffect, useEffectEvent, useRef, useState } from 'react';
import Container from '../components/Container';
import LoanForm from '../components/loan/LoanForm';
import ResultCard from '../components/loan/ResultCard';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { calculateMortgage } from '../utils/mortgage';
import { saveCalculation } from '../utils/storage';

export default function CalculatorPage() {
  const [result, setResult] = useState(null);
  const resultRef = useRef(null);
  const isSideBySide = useMediaQuery('(min-width: 1024px)');

  const scrollToResult = useEffectEvent(() => {
    if (isSideBySide) return;
    resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  useEffect(() => {
    if (result) scrollToResult();
  }, [result]);

  const handleCalculate = (formValues) => {
    if (!formValues) {
      setResult(null);
      return;
    }

    const { installment, totalPayment, totalInterest } = calculateMortgage(formValues);
    setResult({ ...formValues, installment, totalPayment, totalInterest });
  };

  const handleSave = () => {
    if (!result) return;

    saveCalculation({
      date: new Date().toISOString(),
      amount: result.amount,
      rate: result.rate,
      duration: result.termYears,
      payments: result.paymentsPerYear,
      type: result.rateType,
      monthly: result.installment,
      total: result.totalPayment,
      interest: result.totalInterest,
    });
  };

  return (
    <main className="flex-1">
      <Container className="py-6 sm:py-10">
        <h1 className="text-xl font-bold text-gray-900 sm:text-3xl">Mortgage Calculator</h1>
        <p className="mt-2 text-xs text-gray-500 sm:text-base">
          <span className="sm:hidden">Estimate your monthly repayment.</span>
          <span className="hidden sm:inline">
            Enter your loan parameters below to estimate your repayment schedule.
          </span>
        </p>

        <div className="mt-6 grid items-start gap-6 sm:mt-8 lg:grid-cols-2">
          <LoanForm onCalculate={handleCalculate} onSave={handleSave} hasResult={Boolean(result)} />
          <div ref={resultRef}>
            <ResultCard result={result} />
          </div>
        </div>
      </Container>
    </main>
  );
}
