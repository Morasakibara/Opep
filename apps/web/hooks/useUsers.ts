import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/services/api.service';

export function useStaff() {
  return useQuery({
    queryKey: ['staff'],
    queryFn: () => usersApi.getAll(),
  });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => usersApi.create(data),
    onSuccess: () => {
      // Invalidate and refetch staff list
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
  });
}
