import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

const mockNotifs = [
  { id: '1', title: 'Nouveau trajet créé', description: 'Douala → Yaoundé ajouté', type: 'success', isRead: false, createdAt: '2026-07-14' },
  { id: '2', title: 'Maintenance programmée', description: 'Bus LT-982 en maintenance', type: 'info', isRead: true, createdAt: '2026-07-13' },
];

vi.mock('@/services/api.service', () => ({
  notificationsApi: { getMyNotifications: vi.fn() },
}));

import { notificationsApi } from '@/services/api.service';
import NotificationsPage from '@/app/(dashboard)/notifications/page';

describe('NotificationsPage', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('affiche les notifications après chargement', async () => {
    (notificationsApi.getMyNotifications as any).mockResolvedValue(mockNotifs);
    render(<NotificationsPage />);
    await waitFor(() => expect(screen.getByText('Notifications')).toBeDefined());
    expect(screen.getByText('Nouveau trajet créé')).toBeDefined();
  });

  it('affiche état vide', async () => {
    (notificationsApi.getMyNotifications as any).mockResolvedValue([]);
    render(<NotificationsPage />);
    await waitFor(() => expect(screen.getByText(/Aucune notification/i)).toBeDefined());
  });

  it('affiche une erreur', async () => {
    (notificationsApi.getMyNotifications as any).mockRejectedValue(new Error('Erreur'));
    render(<NotificationsPage />);
    await waitFor(() => expect(screen.getByText('Erreur')).toBeDefined());
    expect(screen.getByText('Réessayer')).toBeDefined();
  });
});
