import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const mockTickets = [
  {
    id: 'ticket-1',
    passengerName: 'Jean Dupont',
    seatNumber: 'A12',
    status: 'VALID',
    issuedAt: '2024-01-01T08:00:00Z',
    validUntil: '2024-01-01T12:00:00Z',
    trip: { departureCity: 'Yaoundé', arrivalCity: 'Douala' },
  },
  {
    id: 'ticket-2',
    passengerName: 'Marie K.',
    seatNumber: 'B4',
    status: 'USED',
    issuedAt: '2024-01-02T08:00:00Z',
    validUntil: '2024-01-02T12:00:00Z',
    scannedAt: '2024-01-02T10:00:00Z',
    trip: { departureCity: 'Douala', arrivalCity: 'Bafoussam' },
  },
  {
    id: 'ticket-3',
    passengerName: 'Paul N.',
    seatNumber: 'C7',
    status: 'EXPIRED',
    issuedAt: '2024-01-03T08:00:00Z',
    validUntil: '2024-01-03T10:00:00Z',
    trip: { departureCity: 'Garoua', arrivalCity: 'Yaoundé' },
  },
];

vi.mock('@/services/api.service', () => ({
  ticketsApi: {
    getMyTickets: vi.fn(),
  },
}));

import { ticketsApi } from '@/services/api.service';
import TicketsPage from '@/app/(dashboard)/tickets/page';

describe('TicketsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('affiche le titre et les stats', async () => {
    (ticketsApi.getMyTickets as any).mockResolvedValue(mockTickets);
    render(<TicketsPage />);

    await waitFor(() => {
      expect(screen.getByText('Mes Tickets')).toBeDefined();
    });
    expect(screen.getByText('Total')).toBeDefined();
    expect(screen.getAllByText('Valides').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Utilisés')).toBeDefined();
    expect(screen.getByText('Expirés')).toBeDefined();
  });

  it('affiche la liste des tickets après chargement', async () => {
    (ticketsApi.getMyTickets as any).mockResolvedValue(mockTickets);
    render(<TicketsPage />);

    await waitFor(() => {
      expect(screen.getByText('Jean Dupont')).toBeDefined();
    });
    expect(screen.getByText('Marie K.')).toBeDefined();
    expect(screen.getByText('Paul N.')).toBeDefined();
  });

  it('affiche l\'état vide quand aucun ticket', async () => {
    (ticketsApi.getMyTickets as any).mockResolvedValue([]);
    render(<TicketsPage />);

    await waitFor(() => {
      expect(screen.getByText('Aucun ticket')).toBeDefined();
    });
  });

  it('affiche une erreur et permet de réessayer', async () => {
    (ticketsApi.getMyTickets as any).mockRejectedValue(new Error('Erreur de chargement'));
    render(<TicketsPage />);

    await waitFor(() => {
      expect(screen.getAllByText('Erreur de chargement').length).toBeGreaterThan(0);
    });

    expect(screen.getByText('Réessayer')).toBeDefined();

    (ticketsApi.getMyTickets as any).mockResolvedValue(mockTickets);
    await userEvent.click(screen.getByText('Réessayer'));

    await waitFor(() => {
      expect(screen.getByText('Jean Dupont')).toBeDefined();
    });
  });

  it('filtre les tickets par statut "Valides"', async () => {
    (ticketsApi.getMyTickets as any).mockResolvedValue(mockTickets);
    render(<TicketsPage />);

    await waitFor(() => {
      expect(screen.getByText('Jean Dupont')).toBeDefined();
    });

    const filterButtons = screen.getAllByText('Valides');
    // Click on the filter button (second occurrence - the toggle)
    await userEvent.click(filterButtons[1]);

    expect(screen.getByText('Jean Dupont')).toBeDefined();
    expect(screen.queryByText('Marie K.')).toBeNull();
    expect(screen.queryByText('Paul N.')).toBeNull();
  });

  it('affiche les bons statuts pour chaque ticket', async () => {
    (ticketsApi.getMyTickets as any).mockResolvedValue(mockTickets);
    render(<TicketsPage />);

    await waitFor(() => {
      expect(screen.getByText('Valide')).toBeDefined();
      expect(screen.getByText('Utilisé')).toBeDefined();
      expect(screen.getByText('Expiré')).toBeDefined();
    });
  });
});
