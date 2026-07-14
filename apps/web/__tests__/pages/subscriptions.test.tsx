import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

const mockPackages = [
  { id: '1', name: 'Starter', description: 'Pour petites agences', price: 50000, isActive: true, period: 'MONTHLY' },
  { id: '2', name: 'Pro', description: 'Pour agences en croissance', price: 150000, isActive: false, period: 'YEARLY' },
];

vi.mock('@/services/api.service', () => ({
  subscriptionsApi: { getPackages: vi.fn() },
}));

import { subscriptionsApi } from '@/services/api.service';
import SubscriptionsPage from '@/app/(dashboard)/subscriptions/page';

describe('SubscriptionsPage', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('affiche les forfaits après chargement', async () => {
    (subscriptionsApi.getPackages as any).mockResolvedValue(mockPackages);
    render(<SubscriptionsPage />);
    await waitFor(() => expect(screen.getByText('Abonnements')).toBeDefined());
    expect(screen.getByText('Starter')).toBeDefined();
    expect(screen.getByText('Pro')).toBeDefined();
  });

  it('affiche état vide', async () => {
    (subscriptionsApi.getPackages as any).mockResolvedValue([]);
    render(<SubscriptionsPage />);
    await waitFor(() => expect(screen.getByText(/Aucun forfait disponible/i)).toBeDefined());
  });

  it('affiche une erreur', async () => {
    (subscriptionsApi.getPackages as any).mockRejectedValue(new Error('Erreur de chargement'));
    render(<SubscriptionsPage />);
    await waitFor(() => expect(screen.getByText('Erreur de chargement')).toBeDefined());
    expect(screen.getByText('Réessayer')).toBeDefined();
  });
});
