const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const error = new Error(body.message || body.error || `HTTP ${res.status}`);
    (error as any).status = res.status;
    throw error;
  }
  return res.json();
}

export const apiClient = {
  // Auth
  async login(phone: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: phone, password }),
    });
    return handleResponse<{ access_token: string; refresh_token: string; user: any }>(res);
  },

  async register(data: { firstName: string; lastName: string; phone: string; email?: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{ access_token: string; user: any }>(res);
  },

  async verifyOtp(identifier: string, code: string) {
    const res = await fetch(`${API_BASE}/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, code }),
    });
    return handleResponse<{ valid: boolean }>(res);
  },

  // Trips / Search
  async searchTrips(from?: string, to?: string, date?: string) {
    const params = new URLSearchParams();
    if (from) params.set('departureCity', from);
    if (to) params.set('arrivalCity', to);
    if (date) params.set('date', date);
    const url = `${API_BASE}/trips/search${params.toString() ? '?' + params : ''}`;
    const res = await fetch(url);
    return handleResponse<any[]>(res);
  },

  async getAvailableTrips() {
    const res = await fetch(`${API_BASE}/trips/available`);
    return handleResponse<any[]>(res);
  },

  async getTrip(id: string) {
    const res = await fetch(`${API_BASE}/trips/${id}`, { headers: getAuthHeaders() });
    return handleResponse<any>(res);
  },

  // Reservations
  async createReservation(data: {
    tripId: string;
    passengers: { firstName: string; lastName: string; seatNumber: string }[];
  }) {
    const res = await fetch(`${API_BASE}/reservations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  // Payment
  async processPayment(data: { reservationId: string; method: string; phone?: string }) {
    const res = await fetch(`${API_BASE}/payments/process`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  // Tickets
  async getTicket(id: string) {
    const res = await fetch(`${API_BASE}/tickets/${id}`, { headers: getAuthHeaders() });
    return handleResponse<any>(res);
  },

  async getTicketsByReservation(reservationId: string) {
    const res = await fetch(`${API_BASE}/tickets/reservation/${reservationId}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<any[]>(res);
  },

  // Profile
  async getProfile() {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    if (user?.id) {
      const res = await fetch(`${API_BASE}/users/${user.id}`, { headers: getAuthHeaders() });
      return handleResponse<any>(res);
    }
    throw new Error('Utilisateur non connecté');
  },

  async updateProfile(data: any) {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    if (user?.id) {
      const res = await fetch(`${API_BASE}/users/${user.id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse<any>(res);
    }
    throw new Error('Utilisateur non connecté');
  },

  // Health
  async healthCheck() {
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
      return res.ok;
    } catch {
      return false;
    }
  },
};
