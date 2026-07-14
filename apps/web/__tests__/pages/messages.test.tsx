import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

const mockMessages = [
  { id: '1', subject: 'Problème réservation', senderName: 'Jean M.', preview: 'Bonjour, j\'ai un souci avec...', isRead: false, isUrgent: true, createdAt: '2026-07-14' },
  { id: '2', subject: 'Demande info', senderName: 'Alice K.', preview: 'Merci de me contacter...', isRead: true, isUrgent: false, createdAt: '2026-07-13' },
];

vi.mock('@/services/api.service', () => ({
  messagesApi: { getAll: vi.fn() },
}));

import { messagesApi } from '@/services/api.service';
import MessagesPage from '@/app/(dashboard)/messages/page';

describe('MessagesPage', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('affiche les messages après chargement', async () => {
    (messagesApi.getAll as any).mockResolvedValue(mockMessages);
    render(<MessagesPage />);
    await waitFor(() => expect(screen.getByText('Messages')).toBeDefined());
    expect(screen.getByText('Problème réservation')).toBeDefined();
    expect(screen.getByText('Demande info')).toBeDefined();
  });

  it('affiche état vide', async () => {
    (messagesApi.getAll as any).mockResolvedValue([]);
    render(<MessagesPage />);
    await waitFor(() => expect(screen.getByText(/Aucun message/i)).toBeDefined());
  });

  it('affiche une erreur', async () => {
    (messagesApi.getAll as any).mockRejectedValue(new Error('Erreur réseau'));
    render(<MessagesPage />);
    await waitFor(() => expect(screen.getByText('Erreur réseau')).toBeDefined());
    expect(screen.getByText('Réessayer')).toBeDefined();
  });
});
