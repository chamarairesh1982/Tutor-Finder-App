import axios from 'axios';
import { storage } from '../lib/storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const envUrl = process.env.EXPO_PUBLIC_API_URL || Constants.expoConfig?.extra?.apiUrl;

function resolveBaseUrl() {
    if (envUrl) {
        return envUrl.replace(/\/$/, '');
    }

    // Web: fall back to same-origin proxy if configured
    if (typeof window !== 'undefined' && window.location?.origin) {
        return `${window.location.origin}/api/v1`;
    }

    // Emulators
    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:5270/api/v1';
    }

    // iOS simulator + default
    return 'http://localhost:5270/api/v1';
}

const API_BASE_URL = resolveBaseUrl();

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});


// Request interceptor - Add auth token
apiClient.interceptors.request.use(
    async (config) => {
        const token = await storage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - clear and redirect
            await storage.deleteItem('auth_token');
            // Navigation to login will be handled by the auth state listener
        }
        return Promise.reject(error);
    }
);

export default apiClient;
