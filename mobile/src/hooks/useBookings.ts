import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import { Booking, BookingRequest, BookingMessage, BookingStatus } from '../types';

export function useMyBookings() {
    return useQuery<Booking[]>({
        queryKey: ['bookings'],
        queryFn: async () => {
            const response = await apiClient.get<Booking[]>('/bookings');
            return response.data;
        },
        staleTime: 1000 * 30,
        refetchOnWindowFocus: false,
        initialData: [],
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
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            queryClient.invalidateQueries({ queryKey: ['bookings', 'count'] });
            queryClient.setQueryData(['bookings', data.id], data);
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
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            queryClient.invalidateQueries({ queryKey: ['bookings', 'count'] });
            queryClient.setQueryData(['bookings', bookingId], data);
        },
    });
}

export function useCancelBooking(bookingId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (message?: string) => {
            const response = await apiClient.post<Booking>(`/bookings/${bookingId}/cancel`, { message });
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            queryClient.invalidateQueries({ queryKey: ['bookings', 'count'] });
            queryClient.setQueryData(['bookings', bookingId], data);
        },
    });
}

export function useCompleteBooking(bookingId: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (message?: string) => {
            const response = await apiClient.post<Booking>(`/bookings/${bookingId}/complete`, { message });
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            queryClient.invalidateQueries({ queryKey: ['bookings', 'count'] });
            queryClient.setQueryData(['bookings', bookingId], data);
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
        onSuccess: (message) => {
            queryClient.setQueryData<Booking | undefined>(['bookings', bookingId], (prev) => {
                if (!prev) return prev;
                const nextMessages = [...(prev.messages ?? []), message];
                return { ...prev, messages: nextMessages } as Booking;
            });
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            queryClient.invalidateQueries({ queryKey: ['bookings', 'count'] });
        },
    });
}
