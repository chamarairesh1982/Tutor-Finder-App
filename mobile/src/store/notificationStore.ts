import { create } from 'zustand';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useAuthStore } from './authStore';
import { Platform } from 'react-native';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    createdAt: number;
}

interface NotificationState {
    toasts: Toast[];
    connection: HubConnection | null;
    isConnected: boolean;

    addToast: (toast: Omit<Toast, 'id' | 'createdAt'> & { durationMs?: number }) => void;
    removeToast: (id: string) => void;
    clear: () => void;

    // SignalR Actions
    connectSignalR: () => Promise<void>;
    disconnectSignalR: () => Promise<void>;
}

function generateId() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// Helper to get base URL correctly (dev vs prod vs simulator)
// In a real app, this should come from strict env vars
const getHubUrl = () => {
    // Assuming backend running on localhost:5204 (http)
    // Android Emulator needs 10.0.2.2
    if (__DEV__) {
        const host = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
        return `http://${host}:5204/hubs/notifications`;
    }
    return 'https://api.tutorfinder.com/hubs/notifications';
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
    toasts: [],
    connection: null,
    isConnected: false,

    addToast: ({ type, title, message, durationMs = 3500 }) => {
        const id = generateId();
        const createdAt = Date.now();

        set((state) => ({
            toasts: [{ id, type, title, message, createdAt }, ...state.toasts].slice(0, 3),
        }));

        setTimeout(() => {
            get().removeToast(id);
        }, durationMs);
    },
    removeToast: (id) => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    },
    clear: () => set({ toasts: [] }),

    connectSignalR: async () => {
        const { connection } = get();
        const token = useAuthStore.getState().token;

        if (connection || !token) return;

        try {
            const newConnection = new HubConnectionBuilder()
                .withUrl(getHubUrl(), {
                    accessTokenFactory: () => token
                })
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();

            newConnection.on("ReceiveNotification", (title: string, message: string) => {
                get().addToast({ type: 'info', title, message });
            });

            // Handlers for typing and read receipts - can be used by components via connection.on
            // but we add them here if we want global handling or triggering refetches
            newConnection.on("TypingStatus", (bookingId: string, isTyping: boolean) => {
                // This could update a global 'typing' state if we wanted
            });

            newConnection.on("MessagesRead", (bookingId: string) => {
                // This could trigger a query invalidation if we wanted
            });

            newConnection.onclose(() => set({ isConnected: false, connection: null }));

            await newConnection.start();
            set({ connection: newConnection, isConnected: true });
        } catch (err) {
            console.warn("SignalR Connection Failed:", err);
            // Don't toast error to avoid annoying user on intermittent failures
        }
    },

    disconnectSignalR: async () => {
        const { connection } = get();
        if (connection) {
            await connection.stop();
            set({ connection: null, isConnected: false });
        }
    }
}));
