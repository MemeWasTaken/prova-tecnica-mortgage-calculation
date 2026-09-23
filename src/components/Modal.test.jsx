import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';

function TestModal({ isOpen = true, onClose = vi.fn() }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} labelledBy="test-title">
      <h2 id="test-title">Confirm action</h2>
      <button type="button">First</button>
      <button type="button">Last</button>
    </Modal>
  );
}

describe('Modal rendering and semantics', () => {
  it('renders nothing when closed', () => {
    render(<TestModal isOpen={false} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('exposes a modal dialog named by the referenced heading', () => {
    render(<TestModal />);

    const dialog = screen.getByRole('dialog', { name: 'Confirm action' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });
});

describe('Modal closing', () => {
  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<TestModal onClose={onClose} />);

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the backdrop is clicked but not when the content is', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<TestModal onClose={onClose} />);

    await user.click(screen.getByText('Confirm action'));
    expect(onClose).not.toHaveBeenCalled();

    await user.click(screen.getByRole('dialog').parentElement);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not listen for Escape while closed', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<TestModal isOpen={false} onClose={onClose} />);

    await user.keyboard('{Escape}');

    expect(onClose).not.toHaveBeenCalled();
  });
});

describe('Modal focus management', () => {
  it('moves focus into the dialog when it opens', () => {
    render(<TestModal />);

    expect(screen.getByRole('dialog')).toHaveFocus();
  });

  it('restores focus to the previously focused element when it closes', () => {
    function Harness({ open }) {
      return (
        <>
          <button type="button">Opener</button>
          <TestModal isOpen={open} />
        </>
      );
    }
    const { rerender } = render(<Harness open={false} />);
    screen.getByRole('button', { name: 'Opener' }).focus();

    rerender(<Harness open />);
    expect(screen.getByRole('dialog')).toHaveFocus();

    rerender(<Harness open={false} />);
    expect(screen.getByRole('button', { name: 'Opener' })).toHaveFocus();
  });

  it('keeps focus inside the dialog when tabbing forward past the last control', async () => {
    const user = userEvent.setup();
    render(<TestModal />);

    await user.tab();
    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Last' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();
  });

  it('keeps focus inside the dialog when tabbing backward past the first control', async () => {
    const user = userEvent.setup();
    render(<TestModal />);

    await user.tab({ shift: true });

    expect(screen.getByRole('button', { name: 'Last' })).toHaveFocus();
  });

  it('does not steal focus when the parent re-renders with a new onClose', () => {
    const { rerender } = render(<TestModal onClose={() => {}} />);
    screen.getByRole('button', { name: 'Last' }).focus();

    rerender(<TestModal onClose={() => {}} />);

    expect(screen.getByRole('button', { name: 'Last' })).toHaveFocus();
  });
});
