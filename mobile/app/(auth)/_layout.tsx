import { Stack } from 'expo-router';
import React from 'react';
import { colors } from '../../src/lib/theme';

export default function AuthLayout() {
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
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen name="login" options={{ title: 'Welcome Back' }} />
            <Stack.Screen name="register" options={{ title: 'Create Account' }} />
        </Stack>
    );
}
