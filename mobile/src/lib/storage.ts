import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

/**
 * A storage wrapper that uses SecureStore on native platforms 
 * and fallback to localStorage on web.
 */
export const storage = {
    async setItem(key: string, value: string): Promise<void> {
        if (Platform.OS === 'web') {
            try {
                localStorage.setItem(key, value);
            } catch (e) {
                console.error('Local storage failed', e);
            }
            return;
        }
        await SecureStore.setItemAsync(key, value);
    },

    async getItem(key: string): Promise<string | null> {
        if (Platform.OS === 'web') {
            try {
                return localStorage.getItem(key);
            } catch (e) {
                console.error('Local storage failed', e);
                return null;
            }
        }
        return await SecureStore.getItemAsync(key);
    },

    async deleteItem(key: string): Promise<void> {
        if (Platform.OS === 'web') {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.error('Local storage failed', e);
            }
            return;
        }
        await SecureStore.deleteItemAsync(key);
    }
};
