import Container from '../components/Container';

export default function HistoryPage() {
  return (
    <main className="flex-1">
      <Container className="py-10">
        <h1 className="text-3xl font-bold text-gray-900">History</h1>
        <p className="mt-2 text-gray-500">Review your previously saved mortgage calculations.</p>

        <div className="mt-8 flex min-h-72 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 text-center">
          <p className="text-sm font-medium text-gray-500">No saved calculations yet</p>
          <p className="text-xs text-gray-400">
            Calculations you save from the Calculator page will show up here.
          </p>
        </div>
      </Container>
    </main>
  );
}
