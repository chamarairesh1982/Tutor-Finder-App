import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import { Favorite } from '../types';
import { useAuthStore } from '../store/authStore';

export function useFavorites() {
    const { isAuthenticated } = useAuthStore();
    return useQuery<Favorite[], Error>({
        queryKey: ['favorites'],
        queryFn: async () => {
            const response = await apiClient.get<Favorite[]>('/favorites');
            return response.data;
        },
        enabled: isAuthenticated,
    });
}

export function useIsFavorite(tutorId: string) {
    const { isAuthenticated } = useAuthStore();
    return useQuery<{ isFavorite: boolean }, Error>({
        queryKey: ['favorites', 'check', tutorId],
        queryFn: async () => {
            const response = await apiClient.get<{ isFavorite: boolean }>(`/favorites/${tutorId}/check`);
            return response.data;
        },
        enabled: !!tutorId && isAuthenticated,
    });
}

export function useAddFavorite() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (tutorProfileId: string) => {
            const response = await apiClient.post<Favorite>('/favorites', { tutorProfileId });
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
            queryClient.setQueryData(['favorites', 'check', data.tutorProfileId], { isFavorite: true });
        },
    });
}

export function useRemoveFavorite() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (tutorProfileId: string) => {
            await apiClient.delete(`/favorites/${tutorProfileId}`);
            return tutorProfileId;
        },
        onSuccess: (tutorProfileId) => {
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
            queryClient.setQueryData(['favorites', 'check', tutorProfileId], { isFavorite: false });
        },
    });
}
