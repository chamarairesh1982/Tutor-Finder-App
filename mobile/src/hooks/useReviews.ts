import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import { Review } from '../types';

export interface CreateReviewRequest {
    bookingRequestId: string;
    rating: number;
    comment: string;
}

export function useCreateReview() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateReviewRequest) => {
            const response = await apiClient.post<Review>('/reviews', data);
            return response.data;
        },
        onSuccess: (review) => {
            // Re-fetch tutor + bookings so UI updates
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            queryClient.invalidateQueries({ queryKey: ['tutors', review.tutorProfileId] });
        },
    });
}
