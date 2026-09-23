import Container from './Container';

/**
 * Page footer with the legal disclaimer stating that results are only
 * illustrative estimates.
 *
 * Hidden below the `sm` breakpoint: on mobile the bottom of the screen is
 * occupied by the fixed navigation bar (see `Navbar`).
 */
export default function Footer() {
  return (
    <footer className="hidden border-t border-gray-200 bg-white sm:block">
      <Container className="py-4">
        <p className="mb-5 text-center text-sm text-gray-500">
          Results are illustrative estimates only and do not constitute a loan offer. Consult a
          financial advisor for personalised advice.
        </p>
      </Container>
    </footer>
  );
}
