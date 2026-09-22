import Container from './Container';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <Container className="py-4">
        <p className="mb-5 text-center text-sm text-gray-500">
          Results are illustrative estimates only and do not constitute a loan offer. Consult a
          financial advisor for personalised advice.
        </p>
      </Container>
    </footer>
  );
}
