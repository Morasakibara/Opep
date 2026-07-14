import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

const mockBuses = [
  { id: '1', plateNumber: 'LT-982-AZ', model: 'Mercedes', totalSeats: 40, isActive: true, updatedAt: '2026-07-14' },
  { id: '2', plateNumber: 'LT-451-BX', model: 'Toyota Hiace', totalSeats: 32, isActive: false, updatedAt: '2026-07-10' },
];

vi.mock('@/services/api.service', () => ({
  busesApi: { getAll: vi.fn() },
}));

import { busesApi } from '@/services/api.service';
import BusesPage from '@/app/(dashboard)/buses/page';

describe('BusesPage', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('affiche les bus après chargement', async () => {
    (busesApi.getAll as any).mockResolvedValue(mockBuses);
    render(<BusesPage />);
    await waitFor(() => expect(screen.getByText('Gestion des Bus')).toBeDefined());
    // Le id du bus utilise plateNumber en priorité
    expect(screen.getByText('LT-982-AZ')).toBeDefined();
    expect(screen.getByText('LT-451-BX')).toBeDefined();
  });

  it('affiche une erreur avec bouton réessayer', async () => {
    (busesApi.getAll as any).mockRejectedValue(new Error('Erreur de chargement'));
    render(<BusesPage />);
    await waitFor(() => expect(screen.getByText('Erreur de chargement')).toBeDefined());
    expect(screen.getByText('Réessayer')).toBeDefined();
  });
});
