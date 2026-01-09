import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../src/store/authStore';
import { colors } from '../src/lib/theme';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2,
            staleTime: 1000 * 60 * 5, // 5 minutes
        },
    },
});

function RootLayoutNav() {
    const { isLoading, loadStoredAuth } = useAuthStore();

    useEffect(() => {
        loadStoredAuth();
    }, []);

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
            <Stack.Screen name="tutor/[id]" options={{ title: 'Tutor Profile' }} />
            <Stack.Screen name="booking/[id]" options={{ title: 'Booking Details' }} />
        </Stack>
    );
}

import { View, Platform, StyleSheet } from 'react-native';

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <QueryClientProvider client={queryClient}>
                    <StatusBar style="auto" />
                    <View style={styles.webContainer}>
                        <View style={styles.appWrapper}>
                            <RootLayoutNav />
                        </View>
                    </View>
                </QueryClientProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    webContainer: {
        flex: 1,
        backgroundColor: Platform.OS === 'web' ? '#f0f2f5' : colors.neutrals.background,
        alignItems: 'center',
    },
    appWrapper: {
        flex: 1,
        width: '100%',
        maxWidth: Platform.OS === 'web' ? 480 : '100%',
        backgroundColor: colors.neutrals.background,
        // Add shadow on web for "app" feel
        ...Platform.select({
            web: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 5,
            },
        }),
    },
});
