import { useState } from 'react';
import Container from '../components/Container';
import LoanForm from '../components/loan/LoanForm';
import ResultCard from '../components/loan/ResultCard';

export default function CalculatorPage() {
  const [result, setResult] = useState(null);

  return (
    <main className="flex-1">
      <Container className="py-10">
        <h1 className="text-3xl font-bold text-gray-900">Mortgage Calculator</h1>
        <p className="mt-2 text-gray-500">
          Enter your loan parameters below to estimate your repayment schedule.
        </p>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-2">
          <LoanForm onCalculate={setResult} hasResult={Boolean(result)} />
          <ResultCard result={result} />
        </div>
      </Container>
    </main>
  );
}
