import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';

export function useStaff() {
  return useQuery({
    queryKey: ['staff'],
    queryFn: () => apiService.getUsers(),
  });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => apiService.createUser(data),
    onSuccess: () => {
      // Invalidate and refetch staff list
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
}
