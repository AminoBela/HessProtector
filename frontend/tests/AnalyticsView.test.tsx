import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AnalyticsView } from '@/components/hess/features/analytics/AnalyticsView';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';

// Mock Hooks
vi.mock('@/hooks/useAuth', () => ({
    useAuth: () => ({ token: 'mock-token' })
}));

vi.mock('@/context/PrivacyContext', () => ({
    usePrivacy: () => ({ isBlurred: false })
}));

// Mock Recharts (Chart libraries often fail in JSDOM without mocking or polyfills)
// For simplicity, we can just let them render or shallow mock if needed.
// But Vitest + JSDOM usually handles it if ResizeObserver is polyfilled.
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

describe('AnalyticsView', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = vi.fn();
    });

    it('renders loading state initially', () => {
        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ stats: { income: 0, expense: 0, net: 0, savings_rate: 0 } })
        });

        render(<AnalyticsView language="en" theme="dark" />);
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('renders stats after fetch', async () => {
        const mockData = {
            stats: { income: 5000, expense: 2000, net: 3000, savings_rate: 60 },
            daily_data: [],
            category_data: [],
            top_expenses: []
        };

        (global.fetch as any).mockResolvedValueOnce({
            ok: true,
            json: async () => mockData
        });

        render(<AnalyticsView language="en" theme="dark" />);

        await waitFor(() => {
            expect(screen.getByText('5000.00€')).toBeInTheDocument();
            expect(screen.getByText('2000.00€')).toBeInTheDocument();
        });
    });
});
