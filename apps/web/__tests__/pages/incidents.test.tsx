import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

const mockIncidents = [
  { id: '1', title: 'Panne de bus', description: 'Bus en panne sur la route', severity: 'HIGH', status: 'OPEN', createdAt: '2026-07-13' },
  { id: '2', title: 'Retard massif', description: 'Embouteillage à Douala', severity: 'MEDIUM', status: 'RESOLVED', createdAt: '2026-07-12', resolvedAt: '2026-07-13' },
];

vi.mock('@/services/api.service', () => ({
  incidentsApi: {
    getAll: vi.fn(),
  },
}));

import { incidentsApi } from '@/services/api.service';
import IncidentsPage from '@/app/(dashboard)/incidents/page';

describe('IncidentsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('affiche les incidents après chargement', async () => {
    (incidentsApi.getAll as any).mockResolvedValue(mockIncidents);
    render(<IncidentsPage />);

    await waitFor(() => {
      expect(screen.getByText('Incidents')).toBeDefined();
    });

    expect(screen.getByText('Panne de bus')).toBeDefined();
    expect(screen.getByText('Retard massif')).toBeDefined();
  });

  it('affiche état vide quand aucun incident', async () => {
    (incidentsApi.getAll as any).mockResolvedValue([]);
    render(<IncidentsPage />);

    await waitFor(() => {
      expect(screen.getByText('Aucun incident signalé')).toBeDefined();
    });
  });

  it('affiche une erreur avec bouton réessayer', async () => {
    (incidentsApi.getAll as any).mockRejectedValue(new Error('Erreur serveur'));
    render(<IncidentsPage />);

    await waitFor(() => {
      expect(screen.getByText('Erreur serveur')).toBeDefined();
    });

    expect(screen.getByText('Réessayer')).toBeDefined();
  });
});
