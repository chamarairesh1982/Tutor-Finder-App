import { Tabs } from 'expo-router';
import React from 'react';
import { Text, Platform, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../src/lib/theme';
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
                    fontSize: 11,
                    fontWeight: '600',
                    marginBottom: 4,
                },
                tabBarStyle: {
                    backgroundColor: colors.neutrals.background,
                    borderTopWidth: 1,
                    borderTopColor: colors.neutrals.surfaceAlt,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                    ...Platform.select({
                        web: {
                            boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.05)',
                        } as any,
                        default: {
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: -2 },
                            shadowOpacity: 0.05,
                            shadowRadius: 4,
                            elevation: 5,
                        },
                    }),
                },
                headerShown: false,
                headerStyle: {
                    backgroundColor: colors.neutrals.background,
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.neutrals.surfaceAlt,
                },
                headerTitleStyle: {
                    fontSize: 18,
                    fontWeight: '700',
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

