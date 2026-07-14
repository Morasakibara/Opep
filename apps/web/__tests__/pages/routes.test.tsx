import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockRoutes = [
  { id: '1', departureCity: 'Yaoundé', arrivalCity: 'Douala', distance: 250, price: 5000, isActive: true, createdAt: '2024-01-01' },
  { id: '2', departureCity: 'Douala', arrivalCity: 'Bafoussam', distance: 180, price: 3500, isActive: true, createdAt: '2024-02-01' },
  { id: '3', departureCity: 'Yaoundé', arrivalCity: 'Garoua', distance: 680, price: 12000, isActive: false, createdAt: '2024-03-01' },
];

vi.mock('@/services/api.service', () => ({
  routesApi: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

import { routesApi } from '@/services/api.service';
import RoutesPage from '@/app/(dashboard)/routes/page';

describe('RoutesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('affiche le titre et les stats', async () => {
    (routesApi.getAll as any).mockResolvedValue(mockRoutes);
    render(<RoutesPage />);

    await waitFor(() => {
      expect(screen.getByText('Routes')).toBeDefined();
    });
    expect(screen.getByText('Total routes')).toBeDefined();
    expect(screen.getByText('Villes desservies')).toBeDefined();
    expect(screen.getByText('Actives')).toBeDefined();
  });

  it('affiche la liste des routes après chargement', async () => {
    (routesApi.getAll as any).mockResolvedValue(mockRoutes);
    render(<RoutesPage />);

    await waitFor(() => {
      expect(screen.getByText('Yaoundé')).toBeDefined();
    });
    expect(screen.getByText('Douala')).toBeDefined();
    expect(screen.getByText('Bafoussam')).toBeDefined();
  });

  it('affiche l\'état vide quand aucune route', async () => {
    (routesApi.getAll as any).mockResolvedValue([]);
    render(<RoutesPage />);

    await waitFor(() => {
      expect(screen.getByText('Aucune route')).toBeDefined();
    });
  });

  it('affiche l\'erreur et permet de réessayer', async () => {
    (routesApi.getAll as any).mockRejectedValue(new Error('Erreur serveur'));
    render(<RoutesPage />);

    await waitFor(() => {
      expect(screen.getByText('Erreur serveur')).toBeDefined();
    });

    expect(screen.getByText('Réessayer')).toBeDefined();

    (routesApi.getAll as any).mockResolvedValue(mockRoutes);
    await userEvent.click(screen.getByText('Réessayer'));

    await waitFor(() => {
      expect(screen.getByText('Yaoundé')).toBeDefined();
    });
  });

  it('filtre les routes par recherche', async () => {
    (routesApi.getAll as any).mockResolvedValue(mockRoutes);
    render(<RoutesPage />);

    await waitFor(() => {
      expect(screen.getByText('Yaoundé')).toBeDefined();
    });

    const searchInput = screen.getByPlaceholderText('Rechercher une ville...');
    await userEvent.type(searchInput, 'Douala');

    expect(screen.getByText('Douala')).toBeDefined();
    expect(screen.queryByText('Garoua')).toBeNull();
  });

  it('ouvre la modale de création', async () => {
    (routesApi.getAll as any).mockResolvedValue(mockRoutes);
    render(<RoutesPage />);

    await waitFor(() => {
      expect(screen.getByText('Routes')).toBeDefined();
    });

    await userEvent.click(screen.getByText('Ajouter'));
    expect(screen.getByText('Ajouter une route')).toBeDefined();
  });

  it('crée une route via la modale', async () => {
    (routesApi.getAll as any).mockResolvedValue(mockRoutes);
    (routesApi.create as any).mockResolvedValue({ id: '4' });

    render(<RoutesPage />);
    await waitFor(() => expect(screen.getByText('Routes')).toBeDefined());

    await userEvent.click(screen.getByText('Ajouter'));
    await userEvent.type(screen.getByPlaceholderText('Yaoundé'), 'Bertoua');
    await userEvent.type(screen.getByPlaceholderText('Douala'), 'Ngaoundéré');
    await userEvent.click(screen.getByText('Créer la route'));

    await waitFor(() => {
      expect(routesApi.create).toHaveBeenCalledWith(
        expect.objectContaining({ departureCity: 'Bertoua', arrivalCity: 'Ngaoundéré' }),
      );
    });
  });
});
