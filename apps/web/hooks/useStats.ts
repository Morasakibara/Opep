import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api.service';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      // In a real app, this would fetch from multiple endpoints or a summary endpoint
      // For now, we simulate the delay and return the data
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        revenue: '142 850 000',
        agencies: '48',
        users: '24.5k',
        health: '99.98%',
        revenueTrend: '+12.5%',
        agenciesTrend: '+4 New',
        usersTrend: '-2.1%',
      };
    },
  });
}

export function useRevenueData() {
  return useQuery({
    queryKey: ['revenue-data'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return [
        { name: 'JAN', value: 18 },
        { name: 'FEB', value: 22 },
        { name: 'MAR', value: 20 },
        { name: 'APR', value: 28 },
        { name: 'MAY', value: 25 },
        { name: 'JUN', value: 27 },
      ];
    },
  });
}
