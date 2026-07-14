/**
 * OPEP Web API Service
 * Canonical typed service layer covering all NestJS backend endpoints.
 */
import type {
  Trip, Route, Bus, User, Agency, Company, Centre,
  Reservation, Ticket, Payment, TripSearchCriteria, TripStatus,
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

// ============ Auth ============
export const authApi = {
  login: (identifier: string, password: string) =>
    fetchApi<{ access_token: string; refresh_token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    }),
  register: (data: any) =>
    fetchApi<{ access_token: string; refresh_token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  refresh: (refreshToken: string) =>
    fetchApi<{ access_token: string; refresh_token: string }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    }),
  sendOtp: (phone: string) =>
    fetchApi<{ message: string }>('/auth/otp/send', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    }),
  verifyOtp: (phone: string, otp: string) =>
    fetchApi<{ valid: boolean; message?: string }>('/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ phone, otp }),
    }),
  changePassword: (currentPassword: string, newPassword: string) =>
    fetchApi<{ message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
  resetPassword: (phone: string, newPassword: string) =>
    fetchApi<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ phone, newPassword }),
    }),
  getProfile: () => fetchApi<User>('/auth/me'),
  updateProfile: (data: any) => fetchApi<User>('/auth/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  logout: (refreshToken?: string) =>
    fetchApi<{ message: string }>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    }),
};

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
  getSeats: (id: string) => fetchApi<any[]>(`/trips/${id}/seats`),
  updateStatus: (id: string, status: TripStatus) =>
    fetchApi<Trip>(`/trips/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  create: (data: any) => fetchApi<Trip>('/trips', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchApi<Trip>(`/trips/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id: string) => fetchApi<{ message: string }>(`/trips/${id}`, { method: 'DELETE' }),
};

// ============ Routes ============
export const routesApi = {
  getAll: () => fetchApi<Route[]>('/routes'),
  getCities: () => fetchApi<string[]>('/routes/cities'),
  search: (query?: string) => fetchApi<Route[]>(`/routes/search${query ? `?q=${query}` : ''}`),
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
  activate: (id: string) => fetchApi<User>(`/users/${id}/activate`, { method: 'PATCH' }),
  remove: (id: string) => fetchApi<{ message: string }>(`/users/${id}`, { method: 'DELETE' }),
};

// ============ Agencies ============
export const agenciesApi = {
  getAll: () => fetchApi<Agency[]>('/agencies'),
  getById: (id: string) => fetchApi<Agency>(`/agencies/${id}`),
  getStats: (id: string) => fetchApi<any>(`/agencies/${id}/stats`),
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
  generateTickets: (reservationId: string) =>
    fetchApi<Ticket[]>(`/tickets/generate/${reservationId}`, { method: 'POST' }),
  validate: (data: { qrData: string; controllerId: string; latitude?: number; longitude?: number }) =>
    fetchApi<any>('/tickets/validate', { method: 'POST', body: JSON.stringify(data) }),
};

// ============ Payments ============
export const paymentsApi = {
  initiate: (data: any) => fetchApi<any>('/payments/initiate', { method: 'POST', body: JSON.stringify(data) }),
  process: (data: any) => fetchApi<Payment>('/payments/process', { method: 'POST', body: JSON.stringify(data) }),
  getByReservation: (id: string) => fetchApi<Payment>(`/payments/reservation/${id}`),
  deposit: (data: any) => fetchApi<any>('/payments/deposit', { method: 'POST', body: JSON.stringify(data) }),
  payBalance: (id: string, data?: any) =>
    fetchApi<any>(`/payments/${id}/pay-balance`, { method: 'POST', body: JSON.stringify(data || {}) }),
  refund: (paymentId: string, data?: { amount?: number; reason?: string }) =>
    fetchApi<Payment>(`/payments/${paymentId}/refund`, { method: 'POST', body: JSON.stringify(data || {}) }),
};

// ============ Reports / Analytics ============
export const reportsApi = {
  getDashboard: () => fetchApi<any>('/reports/dashboard'),
  getRevenue: (period?: string) =>
    fetchApi<{ name: string; value: number }[]>(`/reports/revenue${period ? `?period=${period}` : ''}`),
  getHealth: () => fetchApi<any>('/reports/health'),
};

// ============ GPS ============
export const gpsApi = {
  updateLocation: (tripId: string, data: { latitude: number; longitude: number }) =>
    fetchApi<any>(`/trips/${tripId}/location`, { method: 'POST', body: JSON.stringify(data) }),
};

// ============ Offline Scans ============
export const offlineScanApi = {
  getAll: () => fetchApi<any[]>('/offline-scans'),
  getUnsynced: () => fetchApi<any[]>('/offline-scans/unsynced'),
  getByDevice: (deviceId: string) => fetchApi<any[]>(`/offline-scans/device/${deviceId}`),
  getById: (id: string) => fetchApi<any>(`/offline-scans/${id}`),
  verify: (id: string) => fetchApi<any>(`/offline-scans/${id}/verify`, { method: 'POST' }),
  syncBatch: (data: any[]) => fetchApi<any>('/offline-scans/sync-batch', { method: 'POST', body: JSON.stringify(data) }),
  create: (data: any) => fetchApi<any>('/offline-scans', { method: 'POST', body: JSON.stringify(data) }),
};

// ============ Schedules ============
export const schedulesApi = {
  getAll: () => fetchApi<any[]>('/schedules'),
  getCities: () => fetchApi<string[]>('/schedules/cities'),
  getByRoute: (routeId: string) => fetchApi<any[]>(`/schedules/route/${routeId}`),
  getById: (id: string) => fetchApi<any>(`/schedules/${id}`),
  create: (data: any) => fetchApi<any>('/schedules', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchApi<any>(`/schedules/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id: string) => fetchApi<{ message: string }>(`/schedules/${id}`, { method: 'DELETE' }),
};

// ============ Seats ============
export const seatsApi = {
  getByTrip: (tripId: string) => fetchApi<any[]>(`/seats/trip/${tripId}`),
  getAvailable: (tripId: string) => fetchApi<any[]>(`/seats/trip/${tripId}/available`),
  create: (data: any) => fetchApi<any>('/seats', { method: 'POST', body: JSON.stringify(data) }),
  bulkCreate: (tripId: string, data: any[]) =>
    fetchApi<any[]>(`/seats/bulk/${tripId}`, { method: 'POST', body: JSON.stringify(data) }),
  lock: (data: { seatId: string; tripId: string; userId: string }) =>
    fetchApi<any>('/seats/lock', { method: 'POST', body: JSON.stringify(data) }),
  unlock: (data: { seatId: string; tripId: string }) =>
    fetchApi<any>('/seats/unlock', { method: 'POST', body: JSON.stringify(data) }),
  remove: (id: string) => fetchApi<{ message: string }>(`/seats/${id}`, { method: 'DELETE' }),
};

// ============ Billings / Invoices ============
export const billingsApi = {
  getAll: () => fetchApi<any[]>('/invoices'),
  getByCompany: (companyId: string) => fetchApi<any[]>(`/invoices/company/${companyId}`),
  markPaid: (id: string) => fetchApi<any>(`/invoices/${id}/mark-paid`, { method: 'PATCH' }),
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

// ============ Companies ============
export const companiesApi = {
  getAll: () => fetchApi<Company[]>('/companies'),
  getById: (id: string) => fetchApi<Company>(`/companies/${id}`),
  create: (data: any) => fetchApi<Company>('/companies', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchApi<Company>(`/companies/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id: string) => fetchApi<{ message: string }>(`/companies/${id}`, { method: 'DELETE' }),
  getStats: (id: string) => fetchApi<any>(`/companies/${id}/stats`),
};

// ============ Centres ============
export const centresApi = {
  getAll: () => fetchApi<Centre[]>('/centres'),
  getById: (id: string) => fetchApi<Centre>(`/centres/${id}`),
  create: (data: any) => fetchApi<Centre>('/centres', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => fetchApi<Centre>(`/centres/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  remove: (id: string) => fetchApi<{ message: string }>(`/centres/${id}`, { method: 'DELETE' }),
  getRanking: () => fetchApi<Centre[]>('/centres/ranking'),
};

// ============ Subscriptions ============
export const subscriptionsApi = {
  getPackages: () => fetchApi<any[]>('/subscriptions/packages'),
  subscribe: (data: { companyId: string; planId: string }) => fetchApi<any>('/subscriptions/subscribe', { method: 'POST', body: JSON.stringify(data) }),
  getStatus: (companyId: string) => fetchApi<any>(`/subscriptions/status?companyId=${companyId}`),
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

// ============ Reviews ============
export const reviewsApi = {
  getByAgency: (agencyId: string) => fetchApi<any[]>(`/reviews/agency/${agencyId}`),
  getAgencyStats: (agencyId: string) => fetchApi<any>(`/reviews/agency/${agencyId}/stats`),
  create: (data: any) => fetchApi<any>('/reviews', { method: 'POST', body: JSON.stringify(data) }),
};

// ============ Complaints ============
export const complaintsApi = {
  getMy: () => fetchApi<any[]>('/complaints/my'),
  getByCentre: (centreId: string) => fetchApi<any[]>(`/complaints/centre/${centreId}`),
  getByCompany: (companyId: string) => fetchApi<any[]>(`/complaints/company/${companyId}`),
  getById: (id: string) => fetchApi<any>(`/complaints/${id}`),
  create: (data: any) => fetchApi<any>('/complaints', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id: string, status: string) =>
    fetchApi<any>(`/complaints/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};

// ============ Health / Config ============
export const configApi = {
  healthCheck: () => fetchApi<{ status: string }>('/health'),
  getPublicKey: () => fetchApi<{ publicKey: string; configured: boolean }>('/public-key'),
};


