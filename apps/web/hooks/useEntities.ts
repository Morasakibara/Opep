import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { routesApi, busesApi, companiesApi, centresApi, driversApi, incidentsApi, subscriptionsApi, reservationsApi } from '@/services/api.service';

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

// ============ Companies ============
export function useCompanies() {
  return useQuery({ queryKey: ['companies'], queryFn: companiesApi.getAll, retry: 1 });
}
export function useCompanyById(id: string) {
  return useQuery({ queryKey: ['companies', id], queryFn: () => companiesApi.getById(id), enabled: !!id });
}
export function useCreateCompany() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: companiesApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['companies'] }) });
}
export function useCompanyStats(id: string) {
  return useQuery({ queryKey: ['companies', id, 'stats'], queryFn: () => companiesApi.getStats(id), enabled: !!id });
}

// ============ Centres ============
export function useCentres() {
  return useQuery({ queryKey: ['centres'], queryFn: centresApi.getAll, retry: 1 });
}
export function useCentreById(id: string) {
  return useQuery({ queryKey: ['centres', id], queryFn: () => centresApi.getById(id), enabled: !!id });
}
export function useCreateCentre() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: centresApi.create, onSuccess: () => qc.invalidateQueries({ queryKey: ['centres'] }) });
}
export function useCentreRanking() {
  return useQuery({ queryKey: ['centres', 'ranking'], queryFn: centresApi.getRanking, retry: 1 });
}

// ============ Subscriptions ============
export function useSubscriptionPackages() {
  return useQuery({ queryKey: ['subscriptions', 'packages'], queryFn: subscriptionsApi.getPackages });
}
export function useSubscriptionStatus(companyId?: string) {
  return useQuery({
    queryKey: ['subscriptions', 'status', companyId],
    queryFn: () => subscriptionsApi.getStatus(companyId!),
    enabled: !!companyId,
  });
}
export function useSubscribe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: subscriptionsApi.subscribe,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['subscriptions'] }),
  });
}

// ============ Reservations ============
export function useReservations() {
  return useQuery({ queryKey: ['reservations'], queryFn: reservationsApi.getAll });
}
export function useMyReservations() {
  return useQuery({ queryKey: ['reservations', 'my'], queryFn: reservationsApi.getMyReservations });
}
