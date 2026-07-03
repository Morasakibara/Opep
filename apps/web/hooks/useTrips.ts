import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tripsApi } from '@/services/api.service';

export function useTrips() {
  return useQuery({
    queryKey: ['trips'],
    queryFn: tripsApi.getAll,
  });
}

export function useAvailableTrips() {
  return useQuery({
    queryKey: ['trips', 'available'],
    queryFn: tripsApi.getAvailable,
  });
}

export function useTripById(id: string) {
  return useQuery({
    queryKey: ['trips', id],
    queryFn: () => tripsApi.getById(id),
    enabled: !!id,
  });
}

export function useSearchTrips(criteria: { departureCity?: string; arrivalCity?: string; date?: string } | null) {
  return useQuery({
    queryKey: ['trips', 'search', criteria],
    queryFn: () => tripsApi.search(criteria!),
    enabled: !!criteria && (!!criteria.departureCity || !!criteria.arrivalCity),
  });
}

export function useCreateTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tripsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}

export function useUpdateTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => tripsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}

export function useDeleteTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: tripsApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });
}
