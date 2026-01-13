import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '../../src/lib/theme';
import { useMyTutorStats } from '../../src/hooks/useTutors';
import { TutorStats } from '../../src/types';

export default function TutorDashboard() {
    const router = useRouter();
    const { data: stats, isLoading, isError, refetch } = useMyTutorStats();

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (isError || !stats) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>Failed to load stats.</Text>
                <TouchableOpacity onPress={() => refetch()} style={styles.retryBtn}>
                    <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
            <Stack.Screen options={{
                title: 'Tutor Dashboard',
                headerShadowVisible: false,
                headerStyle: { backgroundColor: colors.neutrals.background },
            }} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.welcomeText}>Your Performance</Text>
                    <Text style={styles.subText}>Insights and activity for your tutoring business.</Text>
                </View>

                {/* Main Stats Grid */}
                <View style={styles.statsGrid}>
                    <StatCard
                        title="Profile Views"
                        value={stats.totalViews.toString()}
                        icon="eye"
                        color="#6366f1"
                    />
                    <StatCard
                        title="Completed"
                        value={stats.completedBookings.toString()}
                        icon="checkmark-done-circle"
                        color="#10b981"
                    />
                    <StatCard
                        title="Total Earnings"
                        value={`£${stats.totalEarnings}`}
                        icon="cash"
                        color="#f59e0b"
                        isFullWidth
                    />
                </View>

                {/* Booking Status Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Booking Status</Text>
                </View>

                <View style={styles.statusRow}>
                    <StatusItem label="Pending" count={stats.pendingBookings} color={colors.statusPending} />
                    <StatusItem label="Active" count={stats.activeBookings} color={colors.statusAccepted} />
                    <StatusItem label="Response Rate" count={`${Math.round(stats.responseRate)}%`} color={colors.primary} />
                </View>

                {/* Quick Actions */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                </View>

                <View style={styles.actionsContainer}>
                    <ActionButton
                        label="Manage Bookings"
                        icon="calendar"
                        onPress={() => router.push('/(tabs)/bookings')}
                    />
                    <ActionButton
                        label="Edit Profile"
                        icon="create"
                        onPress={() => router.push('/profile/tutor-settings')}
                    />
                    <ActionButton
                        label="View Public Profile"
                        icon="person"
                        onPress={() => router.push('/profile/tutor-settings')} // Placeholder, might need ID
                    />
                </View>

                <View style={styles.tipCard}>
                    <Ionicons name="bulb" size={24} color={colors.primary} />
                    <View style={styles.tipContent}>
                        <Text style={styles.tipTitle}>Pro Tip</Text>
                        <Text style={styles.tipText}>Tutors with complete profiles and clear availability get 3x more bookings!</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function StatCard({ title, value, icon, color, isFullWidth }: { title: string, value: string, icon: any, color: string, isFullWidth?: boolean }) {
    return (
        <View style={[styles.statCard, isFullWidth && styles.statCardFull]}>
            <View style={[styles.statIconContainer, { backgroundColor: `${color}15` }]}>
                <Ionicons name={icon} size={24} color={color} />
            </View>
            <View>
                <Text style={styles.statValue}>{value}</Text>
                <Text style={styles.statTitle}>{title}</Text>
            </View>
        </View>
    );
}

function StatusItem({ label, count, color }: { label: string, count: number | string, color: string }) {
    return (
        <View style={styles.statusItem}>
            <Text style={[styles.statusCount, { color }]}>{count}</Text>
            <Text style={styles.statusLabel}>{label}</Text>
        </View>
    );
}

function ActionButton({ label, icon, onPress }: { label: string, icon: any, onPress: () => void }) {
    return (
        <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
            <View style={styles.actionIcon}>
                <Ionicons name={icon} size={22} color={colors.neutrals.textPrimary} />
            </View>
            <Text style={styles.actionLabel}>{label}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.neutrals.textMuted} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.neutrals.background,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        padding: spacing.lg,
        paddingBottom: spacing['4xl'],
    },
    header: {
        marginBottom: spacing.xl,
    },
    welcomeText: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
    },
    subText: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textSecondary,
        marginTop: 4,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
        marginBottom: spacing.xl,
    },
    statCard: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: colors.neutrals.surface,
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
        ...shadows.sm,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    statCardFull: {
        minWidth: '100%',
    },
    statIconContainer: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statValue: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
    },
    statTitle: {
        fontSize: typography.fontSize.xs,
        color: colors.neutrals.textMuted,
        fontWeight: typography.fontWeight.medium,
    },
    sectionHeader: {
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: colors.neutrals.surface,
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
        marginBottom: spacing.xl,
    },
    statusItem: {
        alignItems: 'center',
        flex: 1,
    },
    statusCount: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
    },
    statusLabel: {
        fontSize: typography.fontSize.xs,
        color: colors.neutrals.textMuted,
        marginTop: 4,
    },
    actionsContainer: {
        gap: spacing.sm,
        marginBottom: spacing.xl,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.neutrals.surface,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
    },
    actionIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.neutrals.surfaceAlt,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    actionLabel: {
        flex: 1,
        fontSize: typography.fontSize.base,
        fontWeight: typography.fontWeight.medium,
        color: colors.neutrals.textPrimary,
    },
    tipCard: {
        flexDirection: 'row',
        backgroundColor: colors.primarySoft,
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.primaryLight,
        gap: spacing.md,
    },
    tipContent: {
        flex: 1,
    },
    tipTitle: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.bold,
        color: colors.primaryDark,
        marginBottom: 2,
    },
    tipText: {
        fontSize: typography.fontSize.xs,
        color: colors.primaryDark,
        lineHeight: 18,
    },
    errorText: {
        color: colors.error,
        marginBottom: spacing.md,
    },
    retryBtn: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        backgroundColor: colors.primary,
        borderRadius: borderRadius.full,
    },
    retryText: {
        color: '#fff',
        fontWeight: typography.fontWeight.bold,
    }
});
