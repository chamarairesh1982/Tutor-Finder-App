import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import { Booking, BookingRequest, BookingMessage, BookingStatus } from '../types';

export function useMyBookings() {
    return useQuery({
        queryKey: ['bookings'],
        queryFn: async () => {
            const response = await apiClient.get<Booking[]>('/bookings');
            return response.data;
        },
    });
}

export function useBooking(bookingId: string) {
    return useQuery({
        queryKey: ['bookings', bookingId],
        queryFn: async () => {
            const response = await apiClient.get<Booking>(`/bookings/${bookingId}`);
            return response.data;
        },
        enabled: !!bookingId,
    });
}

export function useCreateBooking() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: BookingRequest) => {
            const response = await apiClient.post<Booking>('/bookings', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
    });
}

interface RespondToBookingRequest {
    newStatus: BookingStatus;
    message?: string;
}

export function useRespondToBooking(bookingId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: RespondToBookingRequest) => {
            const response = await apiClient.post<Booking>(`/bookings/${bookingId}/respond`, data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            queryClient.invalidateQueries({ queryKey: ['bookings', bookingId] });
        },
    });
}

export function useSendMessage(bookingId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (content: string) => {
            const response = await apiClient.post<BookingMessage>(`/bookings/${bookingId}/messages`, { content });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings', bookingId] });
        },
    });
}
