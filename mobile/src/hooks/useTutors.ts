import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import { TutorSearchResult, TutorSearchRequest, TutorProfile, PagedResult } from '../types';

export function useSearchTutors(params: TutorSearchRequest) {
    return useQuery<PagedResult<TutorSearchResult>, Error>({
        queryKey: ['tutors', 'search', params],
        queryFn: async () => {
            const response = await apiClient.get<PagedResult<TutorSearchResult>>('/tutors/search', { params });
            return response.data;
        },
        enabled: true,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}


export function useTutorProfile(tutorId: string) {
    return useQuery({
        queryKey: ['tutors', tutorId],
        queryFn: async () => {
            const response = await apiClient.get<TutorProfile>(`/tutors/${tutorId}`);
            return response.data;
        },
        enabled: !!tutorId,
    });
}

export function useMyTutorProfile() {
    return useQuery({
        queryKey: ['tutors', 'me'],
        queryFn: async () => {
            const response = await apiClient.get<TutorProfile>('/tutors/me');
            return response.data;
        },
    });
}

export function useMyTutorStats() {
    return useQuery({
        queryKey: ['tutors', 'me', 'stats'],
        queryFn: async () => {
            const response = await apiClient.get<any>('/tutors/me/stats');
            return response.data;
        },
    });
}

interface TutorProfileUpdate {
    fullName: string;
    photoUrl?: string;
    bio: string;
    category: number;
    baseLatitude: number;
    baseLongitude: number;
    postcode: string;
    travelRadiusMiles: number;
    pricePerHour: number;
    teachingMode: number;
    hasDbs: boolean;
    hasCertification: boolean;
    subjects: string[];
    availability: { dayOfWeek: number; startTime: string; endTime: string }[];
}

export function useUpdateTutorProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: TutorProfileUpdate) => {
            const response = await apiClient.post<TutorProfile>('/tutors/profile', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tutors', 'me'] });
        },
    });
}
