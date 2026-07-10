import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AppShell } from './AppShell';

// Mock tanstack router hooks
vi.mock('@tanstack/react-router', () => ({
  useRouterState: vi.fn((opts?: any) => {
    if (opts && opts.select) {
      return opts.select({ location: { pathname: '/admin' } });
    }
    return { location: { pathname: '/admin' } };
  }),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
}));

// Mock AIAssistant to avoid complex dependencies
vi.mock('./AIAssistant', () => ({
  AIAssistant: () => <div data-testid="ai-assistant" />
}));

vi.mock('@/lib/security', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    getStoredRole: vi.fn(() => 'admin'),
    canAccessRoute: vi.fn(() => true),
  };
});

describe('AppShell Component', () => {
  it('renders children and title', () => {
    render(
      <AppShell title="Test Title" subtitle="Test Subtitle">
        <div data-testid="child-content">Content</div>
      </AppShell>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('renders the AI Assistant on non-assistant routes', () => {
    render(
      <AppShell title="Test" subtitle="Test">
        <div>Content</div>
      </AppShell>
    );
    expect(screen.getByTestId('ai-assistant')).toBeInTheDocument();
  });
});
