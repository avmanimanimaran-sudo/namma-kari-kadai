import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Send cookies when cross-domain requests
});

// Request interceptor to add access token
api.interceptors.request.use(
    (config) => {
        // We expect the access token to be in memory or localStorage? 
        // Plan said "store Refesh Token in HTTPOnly cookie". Access Token usually in memory.
        // For simplicity, we can store Access Token in localStorage or Context.
        // Let's assume we get it from localStorage for now, or Context injects it.
        // But interceptors don't have access to React Context.
        // So localStorage is easier for MVP.
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for refreshing token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const { data } = await api.post('/auth/refresh');
                if (typeof window !== 'undefined') {
                    localStorage.setItem('accessToken', data.accessToken);
                }
                api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh failed, redirect to login
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('user');
                    // user should be redirected to login page logic handles this
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
