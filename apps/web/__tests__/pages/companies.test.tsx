import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockCompanies = [
  { id: '1', name: 'Compagnie Centrale', city: 'Yaoundé', phone: '691234567', isActive: true, createdAt: '2024-01-01' },
  { id: '2', name: 'Compagnie Express', city: 'Douala', phone: '692345678', isActive: true, createdAt: '2024-02-01' },
  { id: '3', name: 'Compagnie Nord', city: 'Garoua', phone: '693456789', isActive: false, createdAt: '2024-03-01' },
];

vi.mock('@/services/api.service', () => ({
  companiesApi: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}));

import { companiesApi } from '@/services/api.service';
import CompaniesPage from '@/app/(dashboard)/companies/page';

describe('CompaniesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('affiche le titre et les stats', async () => {
    (companiesApi.getAll as any).mockResolvedValue(mockCompanies);
    render(<CompaniesPage />);

    await waitFor(() => {
      expect(screen.getByText('Compagnies')).toBeDefined();
    });
    expect(screen.getByText('Total compagnies')).toBeDefined();
    expect(screen.getByText('Villes couvertes')).toBeDefined();
    expect(screen.getByText('Actives')).toBeDefined();
  });

  it('affiche la liste des compagnies après chargement', async () => {
    (companiesApi.getAll as any).mockResolvedValue(mockCompanies);
    render(<CompaniesPage />);

    await waitFor(() => {
      expect(screen.getByText('Compagnie Centrale')).toBeDefined();
    });
    expect(screen.getByText('Compagnie Express')).toBeDefined();
    expect(screen.getByText('Compagnie Nord')).toBeDefined();
  });

  it("affiche l'état vide quand aucune compagnie", async () => {
    (companiesApi.getAll as any).mockResolvedValue([]);
    render(<CompaniesPage />);

    await waitFor(() => {
      expect(screen.getByText('Aucune compagnie')).toBeDefined();
    });
  });

  it("affiche l'erreur et permet de réessayer", async () => {
    (companiesApi.getAll as any).mockRejectedValue(new Error('Erreur serveur'));
    render(<CompaniesPage />);

    await waitFor(() => {
      expect(screen.getByText('Erreur serveur')).toBeDefined();
    });

    expect(screen.getByText('Réessayer')).toBeDefined();

    (companiesApi.getAll as any).mockResolvedValue(mockCompanies);
    await userEvent.click(screen.getByText('Réessayer'));

    await waitFor(() => {
      expect(screen.getByText('Compagnie Centrale')).toBeDefined();
    });
  });

  it('filtre les compagnies par recherche', async () => {
    (companiesApi.getAll as any).mockResolvedValue(mockCompanies);
    render(<CompaniesPage />);

    await waitFor(() => {
      expect(screen.getByText('Compagnie Centrale')).toBeDefined();
    });

    const searchInput = screen.getByPlaceholderText('Rechercher...');
    await userEvent.type(searchInput, 'Express');

    expect(screen.queryByText('Compagnie Centrale')).toBeNull();
    expect(screen.getByText('Compagnie Express')).toBeDefined();
  });

  it('ouvre la modale de création', async () => {
    (companiesApi.getAll as any).mockResolvedValue(mockCompanies);
    render(<CompaniesPage />);

    await waitFor(() => {
      expect(screen.getByText('Compagnies')).toBeDefined();
    });

    await userEvent.click(screen.getByText('Ajouter'));
    expect(screen.getByText('Ajouter une compagnie')).toBeDefined();
  });

  it('crée une compagnie via la modale', async () => {
    (companiesApi.getAll as any).mockResolvedValue(mockCompanies);
    (companiesApi.create as any).mockResolvedValue({ id: '4', name: 'Nouvelle Compagnie' });

    render(<CompaniesPage />);
    await waitFor(() => expect(screen.getByText('Compagnies')).toBeDefined());

    await userEvent.click(screen.getByText('Ajouter'));
    await userEvent.type(screen.getByPlaceholderText('Nom de la compagnie'), 'Nouvelle Compagnie');
    await userEvent.click(screen.getByText('Créer la compagnie'));

    await waitFor(() => {
      expect(companiesApi.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Nouvelle Compagnie' }),
      );
    });
  });
});
