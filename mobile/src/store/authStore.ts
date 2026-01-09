import { create } from 'zustand';
import { storage } from '../lib/storage';
import { User, UserRole } from '../types';

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;

    setAuth: (user: User, token: string) => Promise<void>;
    clearAuth: () => Promise<void>;
    loadStoredAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isLoading: true,
    isAuthenticated: false,

    setAuth: async (user: User, token: string) => {
        await storage.setItem('auth_token', token);
        await storage.setItem('user', JSON.stringify(user));
        set({ user, token, isAuthenticated: true, isLoading: false });
    },

    clearAuth: async () => {
        await storage.deleteItem('auth_token');
        await storage.deleteItem('user');
        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    },

    loadStoredAuth: async () => {
        try {
            const token = await storage.getItem('auth_token');
            const userJson = await storage.getItem('user');

            if (token && userJson) {
                const user = JSON.parse(userJson) as User;
                set({ user, token, isAuthenticated: true, isLoading: false });
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            console.error('Failed to load auth:', error);
            set({ isLoading: false });
        }
    },
}));
