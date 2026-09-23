import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TypeBadge from './TypeBadge';

describe('TypeBadge', () => {
  it('renders the Fixed type with the blue style', () => {
    render(<TypeBadge type="Fixed" />);

    expect(screen.getByText('Fixed')).toHaveStyle({
      backgroundColor: '#EFF6FF',
      color: '#1D4ED8',
    });
  });

  it('renders the Variable type with the green style', () => {
    render(<TypeBadge type="Variable" />);

    expect(screen.getByText('Variable')).toHaveStyle({
      backgroundColor: '#F0FDF4',
      color: '#16A34A',
    });
  });
});
