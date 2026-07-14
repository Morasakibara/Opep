import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockDrivers = [
  { id: '1', firstName: 'Jean', lastName: 'M.', phone: '691234567', email: 'jean@test.com', rating: 4.5, tripsCount: 42, status: 'AVAILABLE', licenseNumber: 'LT-001', experienceYears: 5 },
  { id: '2', firstName: 'Alice', lastName: 'K.', phone: '692345678', email: 'alice@test.com', rating: 4.8, tripsCount: 78, status: 'ON_TRIP', licenseNumber: 'LT-002', experienceYears: 8 },
];

vi.mock('@/services/api.service', () => ({
  driversApi: {
    getAll: vi.fn(),
  },
}));

import { driversApi } from '@/services/api.service';
import DriversPage from '@/app/(dashboard)/drivers/page';

describe('DriversPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('affiche la liste des conducteurs après chargement', async () => {
    (driversApi.getAll as any).mockResolvedValue(mockDrivers);
    render(<DriversPage />);

    await waitFor(() => {
      expect(screen.getByText('Conducteurs')).toBeDefined();
    });

    expect(screen.getByText('Jean M.')).toBeDefined();
    expect(screen.getByText('Alice K.')).toBeDefined();
  });

  it('affiche l\'état vide quand aucun conducteur', async () => {
    (driversApi.getAll as any).mockResolvedValue([]);
    render(<DriversPage />);

    await waitFor(() => {
      expect(screen.getByText('Aucun conducteur enregistré')).toBeDefined();
    });
  });

  it('affiche une erreur et permet de réessayer', async () => {
    (driversApi.getAll as any).mockRejectedValue(new Error('Erreur réseau'));
    render(<DriversPage />);

    await waitFor(() => {
      expect(screen.getByText('Erreur réseau')).toBeDefined();
    });

    expect(screen.getByText('Réessayer')).toBeDefined();

    (driversApi.getAll as any).mockResolvedValue(mockDrivers);
    const retryButton = screen.getByText('Réessayer');
    await userEvent.click(retryButton);

    await waitFor(() => {
      expect(screen.getByText('Jean M.')).toBeDefined();
    });
  });

  it('filtre les conducteurs par recherche', async () => {
    (driversApi.getAll as any).mockResolvedValue(mockDrivers);
    render(<DriversPage />);

    await waitFor(() => {
      expect(screen.getByText('Jean M.')).toBeDefined();
    });

    const searchInput = screen.getByPlaceholderText('Rechercher un conducteur...');
    await userEvent.type(searchInput, 'Alice');

    await waitFor(() => {
      expect(screen.queryByText('Jean M.')).toBeNull();
      expect(screen.getByText('Alice K.')).toBeDefined();
    });
  });
});
