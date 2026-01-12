import { create } from 'zustand';
import { storage } from '../lib/storage';
import { User, UserRole } from '../types';

interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;

    setAuth: (user: User, token: string, refreshToken?: string) => Promise<void>;
    updateToken: (token: string) => Promise<void>;
    updateRefreshToken: (refreshToken: string) => Promise<void>;
    clearAuth: () => Promise<void>;
    loadStoredAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    refreshToken: null,
    isLoading: true,
    isAuthenticated: false,

    setAuth: async (user: User, token: string, refreshToken?: string) => {
        await storage.setItem('auth_token', token);
        if (refreshToken) await storage.setItem('refresh_token', refreshToken);
        await storage.setItem('user', JSON.stringify(user));
        set({ user, token, refreshToken: refreshToken || null, isAuthenticated: true, isLoading: false });
    },

    updateToken: async (token: string) => {
        await storage.setItem('auth_token', token);
        set({ token });
    },

    updateRefreshToken: async (refreshToken: string) => {
        await storage.setItem('refresh_token', refreshToken);
        set({ refreshToken });
    },

    clearAuth: async () => {
        await storage.deleteItem('auth_token');
        await storage.deleteItem('refresh_token');
        await storage.deleteItem('user');
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false, isLoading: false });
    },

    loadStoredAuth: async () => {
        try {
            const token = await storage.getItem('auth_token');
            const refreshToken = await storage.getItem('refresh_token');
            const userJson = await storage.getItem('user');

            if (token && userJson) {
                const user = JSON.parse(userJson) as User;
                set({ user, token, refreshToken, isAuthenticated: true, isLoading: false });
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            console.error('Failed to load auth:', error);
            set({ isLoading: false });
        }
    },
}));
