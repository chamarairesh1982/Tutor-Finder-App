import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import { TutorSearchResult, TutorSearchRequest, TutorProfile } from '../types';

export function useSearchTutors(params: TutorSearchRequest) {
    return useQuery({
        queryKey: ['tutors', 'search', params],
        queryFn: async () => {
            const response = await apiClient.get<TutorSearchResult[]>('/tutors/search', { params });
            return response.data;
        },
        enabled: (params.lat != null && params.lng != null) || !!params.postcode,
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

interface TutorProfileUpdate {
    fullName: string;
    bio: string;
    category: number;
    baseLatitude: number;
    baseLongitude: number;
    postcode: string;
    travelRadiusMiles: number;
    pricePerHour: number;
    teachingMode: number;
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
