import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

const mockBuses = [
  { id: '1', registrationNumber: 'LT-982-AZ', currentRoute: 'Douala → Yaoundé' },
  { id: '2', registrationNumber: 'LT-451-BX' },
];

vi.mock('@/services/api.service', () => ({
  busesApi: { getAll: vi.fn() },
}));

import { busesApi } from '@/services/api.service';
import TrackingPage from '@/app/(dashboard)/tracking/page';

describe('TrackingPage', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('affiche le suivi avec les bus réels', async () => {
    (busesApi.getAll as any).mockResolvedValue(mockBuses);
    render(<TrackingPage />);
    await waitFor(() => expect(screen.getByText('Suivi GPS')).toBeDefined());
    expect(screen.getByText('LT-982-AZ')).toBeDefined();
    expect(screen.getByText('LT-451-BX')).toBeDefined();
  });

  it('affiche des données mock si API échoue', async () => {
    (busesApi.getAll as any).mockRejectedValue(new Error('Erreur'));
    render(<TrackingPage />);
    await waitFor(() => expect(screen.getByText('Suivi GPS')).toBeDefined(), { timeout: 3000 });
    // Fallback mock data should render bus numbers
    const busElements = screen.getAllByText(/LT-/);
    expect(busElements.length).toBeGreaterThanOrEqual(1);
  });
});
