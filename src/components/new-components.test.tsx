import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LiveAttendanceRing } from './LiveAttendanceRing';
import { StaffShiftPanel } from './StaffShiftPanel';
import { RevenueTracker } from './RevenueTracker';
import { EnvironmentPanel } from './EnvironmentPanel';

describe('New Industry Components', () => {
  describe('LiveAttendanceRing', () => {
    it('renders with basic props', () => {
      render(<LiveAttendanceRing attendance={50000} capacity={54000} />);
      expect(screen.getByText('50,000')).toBeInTheDocument();
      expect(screen.getByText(/92.6%/)).toBeInTheDocument();
      expect(screen.getByText('Capacity: 54,000')).toBeInTheDocument();
    });

    it('displays Critical status when >= 95% capacity', () => {
      render(<LiveAttendanceRing attendance={52000} capacity={54000} />);
      expect(screen.getByText('Critical')).toBeInTheDocument();
    });
  });

  describe('StaffShiftPanel', () => {
    it('renders staff panel with correct header', () => {
      render(<StaffShiftPanel />);
      expect(screen.getByText('Staff Deployment')).toBeInTheDocument();
      expect(screen.getByText('Live')).toBeInTheDocument();
    });

    it('renders staff roles', () => {
      render(<StaffShiftPanel />);
      expect(screen.getByText('Security')).toBeInTheDocument();
      expect(screen.getByText('Medical')).toBeInTheDocument();
      expect(screen.getByText('Cleaning')).toBeInTheDocument();
      expect(screen.getByText('Usher')).toBeInTheDocument();
    });
  });

  describe('RevenueTracker', () => {
    it('renders revenue intelligence header', () => {
      render(<RevenueTracker attendance={50000} />);
      expect(screen.getByText('Revenue Intelligence')).toBeInTheDocument();
    });

    it('renders categories', () => {
      render(<RevenueTracker attendance={50000} />);
      expect(screen.getByText('F&B')).toBeInTheDocument();
      expect(screen.getByText('Merchandise')).toBeInTheDocument();
      expect(screen.getByText('Parking')).toBeInTheDocument();
      expect(screen.getByText('Premium')).toBeInTheDocument();
    });
  });

  describe('EnvironmentPanel', () => {
    it('renders environmental intelligence header', () => {
      render(<EnvironmentPanel />);
      expect(screen.getByText('Environmental Intelligence')).toBeInTheDocument();
    });

    it('renders metrics', () => {
      render(<EnvironmentPanel />);
      expect(screen.getByText('Temperature')).toBeInTheDocument();
      expect(screen.getByText('Noise Level')).toBeInTheDocument();
      expect(screen.getByText('Air Quality')).toBeInTheDocument();
      expect(screen.getByText('Power Draw')).toBeInTheDocument();
    });
  });
});
