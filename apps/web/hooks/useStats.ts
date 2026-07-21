import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '@/services/api.service';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const data = await reportsApi.getDashboard();
      return {
        revenue: data.revenueFormatted || `${((data.totalRevenue || 0) / 1_000_000).toFixed(1)}M FCFA`,
        companies: String(data.totalCompanies || '0'),
        agencies: String(data.totalCompanies || '0'), // backward compat
        users: data.totalUsers > 1000
          ? `${(data.totalUsers / 1000).toFixed(1)}k`
          : String(data.totalUsers),
        health: '99.98%',
        revenueTrend: '+12.5%',
        companiesTrend: `+${data.totalCompanies || 0} New`,
        agenciesTrend: `+${data.totalCompanies || 0} New`, // backward compat
        usersTrend: '-2.1%',
        // Raw values for charts
        totalReservations: data.totalReservations || 0,
        totalRevenue: data.totalRevenue || 0,
        activeTrips: data.activeTrips || 0,
        totalTickets: data.totalTickets || 0,
        totalCompanies: data.totalCompanies || 0,
        totalUsers: data.totalUsers || 0,
      };
    },
    staleTime: 30000, // 30s cache
  });
}

export function useRevenueData(period: string = '6months') {
  return useQuery({
    queryKey: ['revenue-data', period],
    queryFn: async () => {
      try {
        return await reportsApi.getRevenue(period);
      } catch {
        // Fallback if API not available
        return [
          { name: 'JAN', value: 18 },
          { name: 'FEB', value: 22 },
          { name: 'MAR', value: 20 },
          { name: 'APR', value: 28 },
          { name: 'MAY', value: 25 },
          { name: 'JUN', value: 27 },
        ];
      }
    },
    staleTime: 60000,
  });
}
