import { API_BASE_URL } from '../api/client';

export function getFriendlyApiError(error: any) {
    const baseUrl = API_BASE_URL;

    if (!error) {
        return { title: 'Something went wrong', message: 'Please try again.' };
    }

    // Axios network error: no response means the server is unreachable.
    if (!error.response) {
        return {
            title: 'API unavailable',
            message: `Cannot reach the API at ${baseUrl}. Start the backend or set EXPO_PUBLIC_API_URL.`,
        };
    }

    const detail = error.response?.data?.detail;
    const title = error.response?.data?.title;

    if (typeof detail === 'string' && detail.trim()) {
        return { title: title || 'Request failed', message: detail };
    }

    return { title: 'Request failed', message: 'Please try again.' };
}
