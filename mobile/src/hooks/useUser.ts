import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import { useAuthStore } from '../store/authStore';
import { AuthResponse } from '../types';

interface UpdateProfileRequest {
    displayName: string;
    email: string;
}

interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export function useUpdateProfile() {
    const { setAuth } = useAuthStore();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: UpdateProfileRequest) => {
            const response = await apiClient.put<AuthResponse>('/users/me', data);
            return response.data;
        },
        onSuccess: async (data) => {
            await setAuth(
                { id: data.id, email: data.email, displayName: data.displayName, role: data.role },
                data.token
            );
            queryClient.invalidateQueries({ queryKey: ['me'] });
        },
    });
}

export function useChangePassword() {
    return useMutation({
        mutationFn: async (data: ChangePasswordRequest) => {
            const response = await apiClient.put<void>('/users/me/password', data);
            return response.data;
        },
    });
}
