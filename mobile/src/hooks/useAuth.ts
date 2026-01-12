import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import { useAuthStore } from '../store/authStore';
import { AuthResponse, UserRole } from '../types';

interface LoginRequest {
    email: string;
    password: string;
}

interface RegisterRequest {
    email: string;
    password: string;
    displayName: string;
    role: UserRole;
}

export function useLogin() {
    const { setAuth } = useAuthStore();

    return useMutation({
        mutationFn: async (data: LoginRequest) => {
            const response = await apiClient.post<AuthResponse>('/auth/login', data);
            return response.data;
        },
        onSuccess: async (data) => {
            await setAuth(
                { id: data.id, email: data.email, displayName: data.displayName, role: data.role },
                data.token,
                data.refreshToken
            );
        },
    });
}

export function useRegister() {
    const { setAuth } = useAuthStore();

    return useMutation({
        mutationFn: async (data: RegisterRequest) => {
            const response = await apiClient.post<AuthResponse>('/auth/register', data);
            return response.data;
        },
        onSuccess: async (data) => {
            await setAuth(
                { id: data.id, email: data.email, displayName: data.displayName, role: data.role },
                data.token,
                data.refreshToken
            );
        },
    });
}

export function useLogout() {
    const { clearAuth, refreshToken } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            if (refreshToken) {
                try {
                    await apiClient.post('/auth/logout', { refreshToken });
                } catch (e) {
                    console.warn('Logout on server failed', e);
                }
            }
            await clearAuth();
            queryClient.clear();
        },
    });
}
