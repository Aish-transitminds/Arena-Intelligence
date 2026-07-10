import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Admin from './admin';

// Mock recharts to avoid complex SVG/DOM rendering issues in jsdom
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  LineChart: () => <div data-testid="line-chart" />,
  BarChart: () => <div data-testid="bar-chart" />,
  PieChart: () => <div data-testid="pie-chart" />,
  AreaChart: () => <div data-testid="area-chart" />,
  Line: () => null,
  Bar: () => null,
  Pie: () => null,
  Area: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Cell: () => null,
}));

// Mock framer-motion
vi.mock('framer-motion', () => {
  const motionMock = new Proxy({}, {
    get: () => ({ children, ...props }: any) => {
      const safeProps = { ...props };
      delete safeProps.whileHover;
      delete safeProps.animate;
      delete safeProps.initial;
      delete safeProps.transition;
      return <div {...safeProps}>{children}</div>;
    }
  });
  return {
    motion: motionMock,
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

vi.mock('@/lib/security', async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    getStoredRole: vi.fn(() => 'admin'),
    canAccessRoute: vi.fn(() => true),
  };
});

// Mock tanstack router hooks that might be used by AppShell which Admin wraps
vi.mock('@tanstack/react-router', () => ({
  useRouterState: vi.fn((opts?: any) => {
    if (opts && opts.select) {
      return opts.select({ location: { pathname: '/admin' } });
    }
    return { location: { pathname: '/admin' } };
  }),
  Link: ({ children, to }: any) => <a href={to}>{children}</a>,
  createFileRoute: vi.fn(() => vi.fn((config: any) => ({
    options: { component: config.component || (() => <div />) }
  }))),
}));

// Note: admin.tsx default exports the route config usually in TanStack router, 
// but wait, let's just test that we can render the component.
// We'll mock the module to get the component if needed, or if Admin is not default export.
// In Arena Intelligence, admin.tsx exports a `Route` object which contains `component`.
import { Route } from './admin';

describe('Admin Route', () => {
  it('renders the Operations Console', () => {
    // Render the component from the Route
    const Component = Route.options.component as React.ElementType;
    render(<Component />);
    
    // Assert title is rendered via AppShell
    // Assert Heatmap renders
    expect(screen.getByText('Live Crowd Heatmap')).toBeInTheDocument();
  });
});
