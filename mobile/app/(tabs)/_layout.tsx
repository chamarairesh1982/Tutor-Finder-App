import { Tabs } from 'expo-router';
import React from 'react';
import { Text, Platform, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '../../src/lib/theme';
import { useMyBookings } from '../../src/hooks/useBookings';
import { useAuthStore } from '../../src/store/authStore';

function BookingBadge() {
    const { isAuthenticated } = useAuthStore();
    const { data } = useMyBookings(isAuthenticated);

    const list = Array.isArray(data) ? data : [];
    const pending = list.filter((b) => b.status === 0).length;
    if (!pending) return null;

    return (
        <View style={{
            position: 'absolute',
            top: -5,
            right: -10,
            minWidth: 16,
            height: 16,
            paddingHorizontal: 4,
            backgroundColor: colors.error,
            borderRadius: borderRadius.full,
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Text style={{
                color: colors.neutrals.background,
                fontSize: 10,
                fontWeight: 'bold',
                lineHeight: 12
            }}>
                {pending}
            </Text>
        </View>
    );
}

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.neutrals.textMuted,
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                    paddingBottom: Platform.OS === 'ios' ? 0 : 4,
                },
                tabBarStyle: {
                    backgroundColor: colors.neutrals.surface,
                    borderTopWidth: 1,
                    borderTopColor: colors.neutrals.border,
                    height: Platform.OS === 'ios' ? 88 : 64,
                    paddingBottom: Platform.OS === 'ios' ? 32 : 12,
                    paddingTop: 8,
                    ...Platform.select({
                        web: {
                            height: 70,
                            paddingBottom: 12,
                            ...shadows.lg,
                        } as any,
                        default: shadows.md,
                    }),
                },
                headerShown: false,
                headerStyle: {
                    backgroundColor: colors.neutrals.surface,
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.neutrals.border,
                },
                headerTitleStyle: {
                    fontSize: 18,
                    fontWeight: '800',
                    color: colors.neutrals.textPrimary,
                },
                headerTintColor: colors.neutrals.textPrimary,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Discover',
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "search" : "search-outline"} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="favorites"
                options={{
                    title: 'Favorites',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "heart" : "heart-outline"} size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="bookings"
                options={{
                    title: 'Bookings',
                    tabBarIcon: ({ color, focused }) => (
                        <View>
                            <Ionicons name={focused ? "calendar" : "calendar-outline"} size={24} color={color} />
                            <BookingBadge />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}

