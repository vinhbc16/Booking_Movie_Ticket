import api from '@/lib/axios';

export const dashboardService = {
    // Lấy thống kê dashboard với period
    getDashboardStats: async (period = 'month') => {
        return await api.get('/admin/dashboard/stats', { params: { period } });
    },

    // Lấy thống kê nhanh (tổng quan)
    getQuickStats: async () => {
        return await api.get('/admin/dashboard/quick-stats');
    }
};
