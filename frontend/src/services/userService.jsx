import api from '@/lib/axios';

export const userService = {
    // --- CUSTOMER ---
    // Cập nhật profile (Cần truyền id vào)
    updateProfile: async (id, data) => {
        return await api.put(`/customer/users/${id}`, data);
    },
    
    getProfile: async (id) => {
        return await api.get(`/customer/users/${id}`);
    },

    // --- ADMIN  ---
    getAllUsers: async (params) => {
        // params: { search, page, limit, status }
        return await api.get('/admin/users', { params });
    },

    deleteUser: async (id) => {
        return await api.delete(`/admin/users/${id}`);
    },
    adminGetUser: async (id) => {
        return await api.get(`/admin/users/${id}`);
    },
    // Admin update user
    adminUpdateUser: async (id, data) => {
        return await api.put(`/admin/users/${id}`, data);
    }
};