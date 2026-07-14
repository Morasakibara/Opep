import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockAgencies = [
  { id: '1', name: 'Agence Centrale', city: 'Yaoundé', phone: '691234567', isActive: true, createdAt: '2024-01-01' },
  { id: '2', name: 'Agence Express', city: 'Douala', phone: '692345678', isActive: true, createdAt: '2024-02-01' },
  { id: '3', name: 'Agence Nord', city: 'Garoua', phone: '693456789', isActive: false, createdAt: '2024-03-01' },
];

vi.mock('@/services/api.service', () => ({
  agenciesApi: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

import { agenciesApi } from '@/services/api.service';
import AgenciesPage from '@/app/(dashboard)/agencies/page';

describe('AgenciesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('affiche le titre et les stats', async () => {
    (agenciesApi.getAll as any).mockResolvedValue(mockAgencies);
    render(<AgenciesPage />);

    await waitFor(() => {
      expect(screen.getByText('Agences')).toBeDefined();
    });
    expect(screen.getByText('Total agences')).toBeDefined();
    expect(screen.getByText('Villes couvertes')).toBeDefined();
    expect(screen.getByText('Actives')).toBeDefined();
  });

  it('affiche la liste des agences après chargement', async () => {
    (agenciesApi.getAll as any).mockResolvedValue(mockAgencies);
    render(<AgenciesPage />);

    await waitFor(() => {
      expect(screen.getByText('Agence Centrale')).toBeDefined();
    });
    expect(screen.getByText('Agence Express')).toBeDefined();
    expect(screen.getByText('Agence Nord')).toBeDefined();
  });

  it('affiche l\'état vide quand aucune agence', async () => {
    (agenciesApi.getAll as any).mockResolvedValue([]);
    render(<AgenciesPage />);

    await waitFor(() => {
      expect(screen.getByText('Aucune agence')).toBeDefined();
    });
  });

  it('affiche l\'erreur et permet de réessayer', async () => {
    (agenciesApi.getAll as any).mockRejectedValue(new Error('Erreur serveur'));
    render(<AgenciesPage />);

    await waitFor(() => {
      expect(screen.getByText('Erreur serveur')).toBeDefined();
    });

    expect(screen.getByText('Réessayer')).toBeDefined();

    (agenciesApi.getAll as any).mockResolvedValue(mockAgencies);
    await userEvent.click(screen.getByText('Réessayer'));

    await waitFor(() => {
      expect(screen.getByText('Agence Centrale')).toBeDefined();
    });
  });

  it('filtre les agences par recherche', async () => {
    (agenciesApi.getAll as any).mockResolvedValue(mockAgencies);
    render(<AgenciesPage />);

    await waitFor(() => {
      expect(screen.getByText('Agence Centrale')).toBeDefined();
    });

    const searchInput = screen.getByPlaceholderText('Rechercher...');
    await userEvent.type(searchInput, 'Express');

    expect(screen.queryByText('Agence Centrale')).toBeNull();
    expect(screen.getByText('Agence Express')).toBeDefined();
  });

  it('ouvre la modale de création', async () => {
    (agenciesApi.getAll as any).mockResolvedValue(mockAgencies);
    render(<AgenciesPage />);

    await waitFor(() => {
      expect(screen.getByText('Agences')).toBeDefined();
    });

    await userEvent.click(screen.getByText('Ajouter'));
    expect(screen.getByText('Ajouter une agence')).toBeDefined();
  });

  it('crée une agence via la modale', async () => {
    (agenciesApi.getAll as any).mockResolvedValue(mockAgencies);
    (agenciesApi.create as any).mockResolvedValue({ id: '4', name: 'Nouvelle Agence' });

    render(<AgenciesPage />);
    await waitFor(() => expect(screen.getByText('Agences')).toBeDefined());

    await userEvent.click(screen.getByText('Ajouter'));
    await userEvent.type(screen.getByPlaceholderText("Nom de l'agence"), 'Nouvelle Agence');
    await userEvent.click(screen.getByText("Créer l'agence"));

    await waitFor(() => {
      expect(agenciesApi.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Nouvelle Agence' }),
      );
    });
  });
});
