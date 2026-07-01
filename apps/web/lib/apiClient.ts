const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
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
  async login(identifier: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });
    return handleResponse<{ access_token: string; refresh_token: string; user: any }>(res);
  },

  async register(data: { firstName: string; lastName: string; phone: string; password: string; role?: string; email?: string }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{ access_token: string; user: any }>(res);
  },

  async sendOtp(phone: string) {
    const res = await fetch(`${API_BASE}/auth/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    return handleResponse<{ message: string }>(res);
  },

  async verifyOtp(phone: string, otp: string) {
    const res = await fetch(`${API_BASE}/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp }),
    });
    return handleResponse<{ valid: boolean; message?: string }>(res);
  },

  // Tickets
  async validateTicket(qrString: string) {
    const res = await fetch(`${API_BASE}/tickets/validate`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify({ qrString }),
    });
    return handleResponse<{
      valid: boolean;
      ticketId?: string;
      passengerName?: string;
      seatNumber?: string;
      tripRoute?: string;
      departureTime?: string;
      reason?: string;
    }>(res);
  },

  async getTicket(id: string) {
    const res = await fetch(`${API_BASE}/tickets/${id}`, {
      headers: await getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Users
  async getProfile() {
    // Get user ID from stored user info
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const user = userStr ? JSON.parse(userStr) : null;
    if (user?.id) {
      const res = await fetch(`${API_BASE}/users/${user.id}`, {
        headers: await getAuthHeaders(),
      });
      return handleResponse(res);
    }
    throw new Error('Utilisateur non connecté');
  },

  async updateProfile(data: any) {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const user = userStr ? JSON.parse(userStr) : null;
    if (user?.id) {
      const res = await fetch(`${API_BASE}/users/${user.id}`, {
        method: 'PATCH',
        headers: await getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse(res);
    }
    throw new Error('Utilisateur non connecté');
  },

  // Agencies
  async getAgency(agencyId: string) {
    const res = await fetch(`${API_BASE}/agencies/${agencyId}`, {
      headers: await getAuthHeaders(),
    });
    return handleResponse(res);
  },

  async updateAgency(agencyId: string, data: any) {
    const res = await fetch(`${API_BASE}/agencies/${agencyId}`, {
      method: 'PATCH',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteAgency(agencyId: string) {
    const res = await fetch(`${API_BASE}/agencies/${agencyId}`, {
      method: 'DELETE',
      headers: await getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Users (employees)
  async getUsers() {
    const res = await fetch(`${API_BASE}/users`, {
      headers: await getAuthHeaders(),
    });
    return handleResponse<any[]>(res);
  },

  async createUser(data: { firstName: string; lastName: string; email: string; phone: string; password: string; role?: string }) {
    const res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async updateUser(userId: string, data: any) {
    const res = await fetch(`${API_BASE}/users/${userId}`, {
      method: 'PATCH',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async deleteUser(userId: string) {
    const res = await fetch(`${API_BASE}/users/${userId}`, {
      method: 'DELETE',
      headers: await getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Buses
  async getBuses() {
    const res = await fetch(`${API_BASE}/buses`, { headers: await getAuthHeaders() });
    return handleResponse<any[]>(res);
  },

  async createBus(data: any) {
    const res = await fetch(`${API_BASE}/buses`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Trips / Routes
  async getTrips() {
    const res = await fetch(`${API_BASE}/trips`, { headers: await getAuthHeaders() });
    return handleResponse<any[]>(res);
  },

  async getRoutes() {
    const res = await fetch(`${API_BASE}/routes`, { headers: await getAuthHeaders() });
    return handleResponse<any[]>(res);
  },

  // Reservations
  async getReservations() {
    const res = await fetch(`${API_BASE}/reservations`, { headers: await getAuthHeaders() });
    return handleResponse<any[]>(res);
  },

  // Reports
  async getReports(period?: string) {
    const params = period ? `?period=${period}` : '';
    const res = await fetch(`${API_BASE}/reports${params}`, { headers: await getAuthHeaders() });
    return handleResponse(res);
  },

  // Security
  async changePassword(currentPassword: string, newPassword: string) {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return handleResponse<{ message: string }>(res);
  },

  // Health & config
  async healthCheck() {
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Public key for offline validation
  async getPublicKey(): Promise<string | null> {
    try {
      const res = await fetch(`${API_BASE}/public-key`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        const data = await res.json();
        return data.publicKey;
      }
      return null;
    } catch {
      return null;
    }
  },
};
