/**
 * OPEP Web API Service
 * Typed service layer covering all NestJS backend endpoints
 */
import type {
  Trip, Route, Bus, User, Agency, Reservation, Ticket,
  Payment, TripSearchCriteria, TripStatus,
} from '@opep/shared-types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

async function getToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('opep_token');
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============ Trips ============
export const tripsApi = {
  getAll: () => fetchApi<Trip[]>('/trips'),
  getAvailable: () => fetchApi<Trip[]>('/trips/available'),
  search: (criteria: Partial<TripSearchCriteria>) => {
    const params = new URLSearchParams();
    if (criteria.departureCity) params.set('departureCity', criteria.departureCity);
    if (criteria.arrivalCity) params.set('arrivalCity', criteria.arrivalCity);
    if (criteria.date) params.set('date', criteria.date);
    return fetchApi<Trip[]>(`/trips/search?${params}`);
  },
  getById: (id: string) => fetchApi<Trip>(`/trips/${id}`),
  create: (data: any) => fetchApi<Trip>('/trips', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchApi<Trip>(`/trips/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id: string) => fetchApi<{ message: string }>(`/trips/${id}`, { method: 'DELETE' }),
};

// ============ Routes ============
export const routesApi = {
  getAll: () => fetchApi<Route[]>('/routes'),
  getById: (id: string) => fetchApi<Route>(`/routes/${id}`),
  create: (data: any) => fetchApi<Route>('/routes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchApi<Route>(`/routes/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id: string) => fetchApi<{ message: string }>(`/routes/${id}`, { method: 'DELETE' }),
};

// ============ Buses ============
export const busesApi = {
  getAll: () => fetchApi<Bus[]>('/buses'),
  getById: (id: string) => fetchApi<Bus>(`/buses/${id}`),
  create: (data: any) => fetchApi<Bus>('/buses', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchApi<Bus>(`/buses/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id: string) => fetchApi<{ message: string }>(`/buses/${id}`, { method: 'DELETE' }),
};

// ============ Users ============
export const usersApi = {
  getAll: (role?: string) => fetchApi<User[]>(`/users${role ? `?role=${role}` : ''}`),
  getById: (id: string) => fetchApi<User>(`/users/${id}`),
  create: (data: any) => fetchApi<User>('/users', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchApi<User>(`/users/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id: string) => fetchApi<{ message: string }>(`/users/${id}`, { method: 'DELETE' }),
};

// ============ Agencies ============
export const agenciesApi = {
  getAll: () => fetchApi<Agency[]>('/agencies'),
  getById: (id: string) => fetchApi<Agency>(`/agencies/${id}`),
  create: (data: any) => fetchApi<Agency>('/agencies', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchApi<Agency>(`/agencies/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id: string) => fetchApi<{ message: string }>(`/agencies/${id}`, { method: 'DELETE' }),
};

// ============ Reservations ============
export const reservationsApi = {
  getAll: () => fetchApi<Reservation[]>('/reservations'),
  getMyReservations: () => fetchApi<Reservation[]>('/reservations/my'),
  getById: (id: string) => fetchApi<Reservation>(`/reservations/${id}`),
  create: (data: any) => fetchApi<Reservation>('/reservations', { method: 'POST', body: JSON.stringify(data) }),
};

// ============ Tickets ============
export const ticketsApi = {
  getMyTickets: () => fetchApi<Ticket[]>('/tickets/my'),
  getById: (id: string) => fetchApi<Ticket>(`/tickets/${id}`),
  getByReservation: (reservationId: string) => fetchApi<Ticket[]>(`/tickets/reservation/${reservationId}`),
  generateTickets: (reservationId: string) => fetchApi<Ticket[]>(`/tickets/generate/${reservationId}`, { method: 'POST' }),
  validate: (data: { qrData: string; controllerId: string; latitude?: number; longitude?: number }) =>
    fetchApi<any>('/tickets/validate', { method: 'POST', body: JSON.stringify(data) }),
};

// ============ Payments ============
export const paymentsApi = {
  process: (data: any) => fetchApi<Payment>('/payments/process', { method: 'POST', body: JSON.stringify(data) }),
  getByReservation: (id: string) => fetchApi<Payment>(`/payments/reservation/${id}`),
};

// ============ Drivers ============
export const driversApi = {
  getAll: () => fetchApi<any[]>('/drivers'),
  getById: (id: string) => fetchApi<any>(`/drivers/${id}`),
  getPerformance: (id: string) => fetchApi<any>(`/drivers/${id}/performance`),
  rateDriver: (id: string, rating: number) =>
    fetchApi<any>(`/drivers/${id}/rating`, { method: 'POST', body: JSON.stringify({ rating }) }),
};

// ============ Incidents ============
export const incidentsApi = {
  getAll: () => fetchApi<any[]>('/incidents'),
  getById: (id: string) => fetchApi<any>(`/incidents/${id}`),
  create: (data: any) => fetchApi<any>('/incidents', { method: 'POST', body: JSON.stringify(data) }),
  resolve: (id: string) => fetchApi<any>(`/incidents/${id}/resolve`, { method: 'PATCH' }),
};

// ============ Subscriptions ============
export const subscriptionsApi = {
  getPackages: () => fetchApi<any[]>('/subscriptions/packages'),
  subscribe: (data: any) => fetchApi<any>('/subscriptions/subscribe', { method: 'POST', body: JSON.stringify(data) }),
  getStatus: () => fetchApi<any>('/subscriptions/status'),
};

// ============ Messages ============
export const messagesApi = {
  getAll: () => fetchApi<any[]>('/messages'),
  send: (data: any) => fetchApi<any>('/messages', { method: 'POST', body: JSON.stringify(data) }),
};

// ============ Notifications ============
export const notificationsApi = {
  getMyNotifications: () => fetchApi<any[]>('/notifications/my'),
};

// Legacy compatibility
export const apiService = {
  getTrips: tripsApi.getAll,
  getTripById: tripsApi.getById,
  createTrip: tripsApi.create,
  getUsers: usersApi.getAll,
  createUser: usersApi.create,
  updateUser: usersApi.update,
  getAgencies: agenciesApi.getAll,
  getRevenueStats: () => fetchApi<any>('/analytics/revenue?period=6months'),
  getSystemHealth: () => fetchApi<any>('/analytics/health'),
};
