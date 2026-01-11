import { create } from 'zustand';

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
    addToast: (toast: Omit<Toast, 'id' | 'createdAt'> & { durationMs?: number }) => void;
    removeToast: (id: string) => void;
    clear: () => void;
}

function generateId() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    toasts: [],
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
}));
