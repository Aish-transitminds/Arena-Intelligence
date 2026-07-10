import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Logo } from './Logo';

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, className }: any) => <div className={className}>{children}</div>,
}));

describe('Logo Component', () => {
  it('renders the Arena Intelligence text', () => {
    render(<Logo />);
    
    // Check if the logo text renders
    expect(screen.getByText('Arena')).toBeInTheDocument();
    expect(screen.getByText('Intelligence')).toBeInTheDocument();
  });

  it('applies the medium size class by default', () => {
    const { container } = render(<Logo />);
    // Verify the outer container has the flex layout
    expect(container.firstChild).toHaveClass('inline-flex', 'rounded-md');
    
    // Check the icon sizing for "md"
    const iconContainer = container.querySelector('div.inline-flex > div > div');
    expect(iconContainer).toHaveClass('size-9', 'rounded-xl');
  });

  it('renders the small size correctly', () => {
    const { container } = render(<Logo size="sm" />);
    
    const iconContainer = container.querySelector('div.inline-flex > div > div');
    expect(iconContainer).toHaveClass('size-7', 'rounded-xl');
  });
});
