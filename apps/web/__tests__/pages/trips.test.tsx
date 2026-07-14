import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

const mockRoutes = [
  { id: 'r1', departureCity: 'Douala', arrivalCity: 'Yaoundé', estimatedDurationMinutes: 240, distanceKm: 250 },
];

const mockTrips = [
  {
    id: 't1',
    route: { departureCity: 'Douala', arrivalCity: 'Yaoundé' },
    departureDateTime: '2026-07-14T06:00:00',
    arrivalDateTime: '2026-07-14T08:00:00',
    basePrice: 5000,
    bus: { plateNumber: 'LT-123', totalSeats: 48 },
    filledSeats: 20,
    status: 'SCHEDULED',
  },
];

vi.mock('@/services/api.service', () => ({
  tripsApi: { getAll: vi.fn() },
  routesApi: { getAll: vi.fn() },
}));

import { tripsApi, routesApi } from '@/services/api.service';
import TripsPage from '@/app/(dashboard)/trips/page';

describe('TripsPage', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('affiche les trajets et lignes après chargement', async () => {
    (routesApi.getAll as any).mockResolvedValue(mockRoutes);
    (tripsApi.getAll as any).mockResolvedValue(mockTrips);
    render(<TripsPage />);
    await waitFor(() => expect(screen.getByText('Lignes & Trajets')).toBeDefined());
    // Vérifie que les données s'affichent dans le tableau
    expect(screen.getByText(/Douala.*Yaoundé/)).toBeDefined();
  });

  it('affiche état vide quand aucun trajet', async () => {
    (routesApi.getAll as any).mockResolvedValue([]);
    (tripsApi.getAll as any).mockResolvedValue([]);
    render(<TripsPage />);
    await waitFor(() => {
      // Le tableau affiche "Aucun trajet trouvé" quand filteredTrips est vide
      const emptyCells = screen.queryAllByText('Aucun trajet trouvé');
      expect(emptyCells.length).toBeGreaterThan(0);
    });
  });

  it('affiche une erreur avec bouton réessayer', async () => {
    (routesApi.getAll as any).mockRejectedValue(new Error('Erreur API'));
    (tripsApi.getAll as any).mockResolvedValue([]);
    render(<TripsPage />);
    await waitFor(() => expect(screen.getByText('Erreur API')).toBeDefined());
    expect(screen.getByText('Réessayer')).toBeDefined();
  });
});
