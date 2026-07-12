import { ApiTrip, ApiTicket, ApiUser, Company, Centre, Reservation, Payment, Route, Bus } from './apiTypes';

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

// ============ Auth ============
export const authApi = {
  async login(phone: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: phone, password }),
    });
    return handleResponse<{ access_token: string; refresh_token: string; user: ApiUser }>(res);
  },

  async register(data: { firstName: string; lastName: string; phone: string; email?: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{ access_token: string; user: ApiUser }>(res);
  },

  async verifyOtp(identifier: string, code: string) {
    const res = await fetch(`${API_BASE}/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, code }),
    });
    return handleResponse<{ valid: boolean }>(res);
  },

  async refreshToken(token: string) {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: token }),
    });
    return handleResponse<{ access_token: string }>(res);
  },
};

// ============ Trips ============
export const tripsApi = {
  async getAvailable() {
    const res = await fetch(`${API_BASE}/trips/available`);
    return handleResponse<ApiTrip[]>(res);
  },

  async search(from?: string, to?: string, date?: string) {
    const params = new URLSearchParams();
    if (from) params.set('departureCity', from);
    if (to) params.set('arrivalCity', to);
    if (date) params.set('date', date);
    const url = `${API_BASE}/trips/search${params.toString() ? '?' + params : ''}`;
    const res = await fetch(url);
    return handleResponse<ApiTrip[]>(res);
  },

  async getById(id: string) {
    const res = await fetch(`${API_BASE}/trips/${id}`, { headers: getAuthHeaders() });
    return handleResponse<ApiTrip>(res);
  },

  async getAll() {
    const res = await fetch(`${API_BASE}/trips`, { headers: getAuthHeaders() });
    return handleResponse<ApiTrip[]>(res);
  },
};

// ============ Reservations ============
export const reservationsApi = {
  async create(data: {
    tripId: string;
    passengers: { firstName: string; lastName: string; seatNumber: string }[];
  }) {
    const res = await fetch(`${API_BASE}/reservations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Reservation>(res);
  },

  async getMyReservations() {
    const res = await fetch(`${API_BASE}/reservations/my`, { headers: getAuthHeaders() });
    return handleResponse<Reservation[]>(res);
  },

  async getById(id: string) {
    const res = await fetch(`${API_BASE}/reservations/${id}`, { headers: getAuthHeaders() });
    return handleResponse<Reservation>(res);
  },
};

// ============ Tickets ============
export const ticketsApi = {
  async getMyTickets() {
    const res = await fetch(`${API_BASE}/tickets/my`, { headers: getAuthHeaders() });
    return handleResponse<ApiTicket[]>(res);
  },

  async getById(id: string) {
    const res = await fetch(`${API_BASE}/tickets/${id}`, { headers: getAuthHeaders() });
    return handleResponse<ApiTicket>(res);
  },

  async validate(data: { qrData: string; controllerId: string }) {
    const res = await fetch(`${API_BASE}/tickets/validate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },
};

// ============ Payments ============
export const paymentsApi = {
  async process(data: { reservationId: string; method: string; phone?: string }) {
    const res = await fetch(`${API_BASE}/payments/process`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<Payment>(res);
  },
};

// ============ Users / Profile ============
export const usersApi = {
  async getProfile() {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    if (user?.id) {
      const res = await fetch(`${API_BASE}/users/${user.id}`, { headers: getAuthHeaders() });
      return handleResponse<ApiUser>(res);
    }
    throw new Error('Utilisateur non connecté');
  },

  async updateProfile(data: Partial<ApiUser>) {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    if (user?.id) {
      const res = await fetch(`${API_BASE}/users/${user.id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return handleResponse<ApiUser>(res);
    }
    throw new Error('Utilisateur non connecté');
  },
};

// ============ Routes ============
export const routesApi = {
  async getAll() {
    const res = await fetch(`${API_BASE}/routes`, { headers: getAuthHeaders() });
    return handleResponse<Route[]>(res);
  },
};

// ============ Companies ============
export const companiesApi = {
  async getAll() {
    const res = await fetch(`${API_BASE}/companies`, { headers: getAuthHeaders() });
    return handleResponse<Company[]>(res);
  },
  async getById(id: string) {
    const res = await fetch(`${API_BASE}/companies/${id}`, { headers: getAuthHeaders() });
    return handleResponse<Company>(res);
  },
};

// ============ Centres ============
export const centresApi = {
  async getAll() {
    const res = await fetch(`${API_BASE}/centres`, { headers: getAuthHeaders() });
    return handleResponse<Centre[]>(res);
  },
  async getById(id: string) {
    const res = await fetch(`${API_BASE}/centres/${id}`, { headers: getAuthHeaders() });
    return handleResponse<Centre>(res);
  },
  async getRanking() {
    const res = await fetch(`${API_BASE}/centres/ranking`, { headers: getAuthHeaders() });
    return handleResponse<Centre[]>(res);
  },
};

// ============ Buses ============
export const busesApi = {
  async getAll() {
    const res = await fetch(`${API_BASE}/buses`, { headers: getAuthHeaders() });
    return handleResponse<Bus[]>(res);
  },
};

// ============ Health ============
export const healthApi = {
  async check() {
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
      return res.ok;
    } catch {
      return false;
    }
  },
};

// Legacy compatibility
export const apiClient = {
  login: authApi.login,
  register: authApi.register,
  verifyOtp: authApi.verifyOtp,
  searchTrips: tripsApi.search,
  getAvailableTrips: tripsApi.getAvailable,
  getTrip: tripsApi.getById,
  createReservation: reservationsApi.create,
  processPayment: paymentsApi.process,
  getTicket: ticketsApi.getById,
  getTicketsByReservation: ticketsApi.getById,
  getProfile: usersApi.getProfile,
  updateProfile: usersApi.updateProfile,
  healthCheck: healthApi.check,
};
