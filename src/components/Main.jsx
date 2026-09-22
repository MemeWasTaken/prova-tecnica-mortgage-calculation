import Container from './Container';

export default function Main() {
  return (
    <main className="flex-1">
      <Container className="py-10">
        <h1 className="text-3xl font-bold text-gray-900">Mortgage Calculator</h1>
        <p className="mt-2 text-gray-500">
          Enter your loan parameters below to estimate your repayment schedule.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="flex min-h-64 items-center justify-center rounded-lg border border-dashed border-gray-300 text-sm text-gray-400">
            Form placeholder
          </div>
          <div className="flex min-h-64 items-center justify-center rounded-lg border border-dashed border-gray-300 text-sm text-gray-400">
            Result placeholder
          </div>
        </div>
      </Container>
    </main>
  );
}
