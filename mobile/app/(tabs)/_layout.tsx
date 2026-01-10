import { Tabs } from 'expo-router';
import React from 'react';
import { Text, Platform, View } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../src/lib/theme';
import { useMyBookings } from '../../src/hooks/useBookings';

function BookingBadge() {
    const { data } = useMyBookings();

    const list = Array.isArray(data) ? data : [];
    const pending = list.filter((b) => b.status === 0).length;
    if (!pending) return null;

    return (
        <View style={{
            minWidth: 20,
            paddingHorizontal: spacing.xs,
            paddingVertical: 2,
            backgroundColor: colors.error,
            borderRadius: borderRadius.full,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 6,
        }}>
            <Text style={{ color: colors.neutrals.background, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold }}>{pending}</Text>
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
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>🔍</Text>,
                }}
            />
            <Tabs.Screen
                name="bookings"
                options={{
                    title: 'Bookings',
                    tabBarIcon: ({ color }) => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 24, color }}>📅</Text>
                            <BookingBadge />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>👤</Text>,
                }}
            />
        </Tabs>
    );
}

