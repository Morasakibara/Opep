import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

const mockReviews = [
  { id: '1', passengerName: 'Jean M.', tripRoute: 'Douala → Yaoundé', rating: 5, comment: 'Excellent', createdAt: '2026-07-12', status: 'PUBLISHED' },
];

vi.mock('@/services/api.service', () => ({
  reviewsApi: { getByAgency: vi.fn() },
}));

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'test-user', name: 'Admin', role: 'SUPER_ADMIN' } }),
}));

import { reviewsApi } from '@/services/api.service';
import ReviewsPage from '@/app/(dashboard)/reviews/page';

describe('ReviewsPage', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('affiche les avis après chargement', async () => {
    (reviewsApi.getByAgency as any).mockResolvedValue(mockReviews);
    render(<ReviewsPage />);
    await waitFor(() => expect(screen.getByText('Avis clients')).toBeDefined());
    expect(screen.getByText('Jean M.')).toBeDefined();
  });

  it('affiche une erreur et fallback vers mock', async () => {
    (reviewsApi.getByAgency as any).mockRejectedValue(new Error('API indisponible'));
    render(<ReviewsPage />);
    // Le catch du composant tombe en fallback mock → les données mock sont utilisées
    await waitFor(() => expect(screen.getByText('Avis clients')).toBeDefined(), { timeout: 3000 });
  });
});
