import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../src/store/authStore';
import { useNotificationStore } from '../src/store/notificationStore';
import { ToastHost } from '../src/components/ToastHost';
import { colors, spacing, layout } from '../src/lib/theme';
import { View, Platform, StyleSheet } from 'react-native';

import { SafeStripeProvider } from '../src/components';

const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error, query) => {
            // Show toast for background refetch failures if data already exists
            if (query.state.data !== undefined) {
                useNotificationStore.getState().addToast({
                    type: 'error',
                    title: 'Sync failed',
                    message: error.message || 'Could not refresh some data.'
                });
            }
        },
    }),
    mutationCache: new MutationCache({
        onError: (error) => {
            useNotificationStore.getState().addToast({
                type: 'error',
                title: 'Action failed',
                message: error.message || 'Something went wrong. Please try again.'
            });
        },
    }),
    defaultOptions: {
        queries: {
            retry: 2,
            staleTime: 1000 * 60 * 5, // 5 minutes
        },
    },
});

function RootLayoutNav() {
    const { isLoading, loadStoredAuth, isAuthenticated } = useAuthStore();
    const { connectSignalR, disconnectSignalR } = useNotificationStore();

    useEffect(() => {
        loadStoredAuth();
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            connectSignalR();
        } else {
            disconnectSignalR();
        }
    }, [isAuthenticated]);

    if (isLoading) {
        return null; // Could show a splash screen here
    }

    return (
        <Stack
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.neutrals.background,
                },
                headerTintColor: colors.neutrals.textPrimary,
                headerTitleStyle: {
                    fontWeight: '600',
                },
                contentStyle: {
                    backgroundColor: colors.neutrals.background,
                },
            }}
        >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="tutor/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="search" options={{ headerShown: false }} />
            <Stack.Screen name="booking/[id]" options={{ title: 'Booking Details' }} />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeStripeProvider publishableKey="pk_test_replace_this_with_your_real_publishable_key">
                <SafeAreaProvider>
                    <QueryClientProvider client={queryClient}>
                        <StatusBar style="auto" />
                        <View style={styles.webContainer}>
                            <View style={styles.appWrapper}>
                                <RootLayoutNav />
                                <ToastHost />
                            </View>
                        </View>
                    </QueryClientProvider>
                </SafeAreaProvider>
            </SafeStripeProvider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    webContainer: {
        flex: 1,
        backgroundColor: Platform.OS === 'web' ? colors.neutrals.surfaceAlt : colors.neutrals.background,
        alignItems: 'center',
    },
    appWrapper: {
        flex: 1,
        width: '100%',
        maxWidth: Platform.OS === 'web' ? layout.wideContentMaxWidth : '100%',
        paddingHorizontal: Platform.OS === 'web' ? spacing.xl : 0,
        paddingVertical: Platform.OS === 'web' ? spacing.lg : 0,
        backgroundColor: colors.neutrals.background,
        alignSelf: 'center',
        // Subtle shadow on web to lift the app surface
        ...Platform.select({
            web: {
                boxShadow: '0 12px 40px rgba(15, 23, 42, 0.08)',
                borderRadius: 24,
            } as any,
        }),
    },
});
