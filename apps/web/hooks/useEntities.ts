import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { routesApi, busesApi, agenciesApi, driversApi, incidentsApi, subscriptionsApi, reservationsApi } from '@/services/api.service';

// ============ Routes ============
export function useRoutes() {
  return useQuery({ queryKey: ['routes'], queryFn: routesApi.getAll });
}
export function useRouteById(id: string) {
  return useQuery({ queryKey: ['routes', id], queryFn: () => routesApi.getById(id), enabled: !!id });
}
export function useCreateRoute() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: routesApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['routes'] }) });
}

// ============ Buses ============
export function useBuses() {
  return useQuery({ queryKey: ['buses'], queryFn: busesApi.getAll });
}
export function useBusById(id: string) {
  return useQuery({ queryKey: ['buses', id], queryFn: () => busesApi.getById(id), enabled: !!id });
}
export function useCreateBus() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: busesApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['buses'] }) });
}

// ============ Agencies ============
export function useAgencies() {
  return useQuery({ queryKey: ['agencies'], queryFn: agenciesApi.getAll });
}
export function useAgencyById(id: string) {
  return useQuery({ queryKey: ['agencies', id], queryFn: () => agenciesApi.getById(id), enabled: !!id });
}

// ============ Drivers ============
export function useDrivers() {
  return useQuery({ queryKey: ['drivers'], queryFn: driversApi.getAll });
}
export function useDriverPerformance(id: string) {
  return useQuery({ queryKey: ['drivers', id, 'performance'], queryFn: () => driversApi.getPerformance(id), enabled: !!id });
}

// ============ Incidents ============
export function useIncidents() {
  return useQuery({ queryKey: ['incidents'], queryFn: incidentsApi.getAll });
}
export function useCreateIncident() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: incidentsApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['incidents'] }) });
}
export function useResolveIncident() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: incidentsApi.resolve, onSuccess: () => qc.invalidateQueries({ queryKey: ['incidents'] }) });
}

// ============ Subscriptions ============
export function useSubscriptionPackages() {
  return useQuery({ queryKey: ['subscriptions', 'packages'], queryFn: subscriptionsApi.getPackages });
}
export function useSubscriptionStatus() {
  return useQuery({ queryKey: ['subscriptions', 'status'], queryFn: subscriptionsApi.getStatus });
}

// ============ Reservations ============
export function useReservations() {
  return useQuery({ queryKey: ['reservations'], queryFn: reservationsApi.getAll });
}
export function useMyReservations() {
  return useQuery({ queryKey: ['reservations', 'my'], queryFn: reservationsApi.getMyReservations });
}
