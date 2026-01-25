import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius, shadows } from '../../src/lib/theme';
import { useMyTutorStats, useMyTutorProfile } from '../../src/hooks/useTutors';
import { useNotificationStore } from '../../src/store/notificationStore';
import { Text, Card, Section, Button } from '../../src/components';

export default function TutorDashboard() {
    const router = useRouter();
    const { data: stats, isLoading, isError, refetch } = useMyTutorStats();
    const { data: profile } = useMyTutorProfile();
    const isConnected = useNotificationStore(s => s.isConnected);

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
                    <View style={styles.headerTitleRow}>
                        <View style={{ flex: 1 }}>
                            <Text variant="h1" weight="heavy">Performance</Text>
                            <Text variant="body" color={colors.neutrals.textSecondary}>Insights for your tutoring business</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: isConnected ? colors.success + '10' : colors.warning + '10' }]}>
                            <View style={[styles.statusDot, { backgroundColor: isConnected ? colors.success : colors.warning }]} />
                            <Text variant="caption" weight="bold" color={isConnected ? colors.success : colors.warning}>
                                {isConnected ? 'LIVE' : 'OFFLINE'}
                            </Text>
                        </View>
                    </View>
                </View>

                {(!profile?.bio || profile.subjects.length === 0) && (
                    <Card variant="elevated" style={styles.setupCard}>
                        <View style={styles.setupHeader}>
                            <View style={styles.setupIcon}>
                                <Ionicons name="rocket-outline" size={24} color={colors.primary} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text variant="bodyLarge" weight="heavy">Level Up Your Profile</Text>
                                <Text variant="caption" color={colors.neutrals.textMuted}>Complete your setup to appear in search results.</Text>
                            </View>
                        </View>
                        <View style={styles.progressRow}>
                            <View style={styles.progressTrack}>
                                <View style={[styles.progressFill, { width: `${(profile?.bio ? 50 : 20) + (profile?.subjects ? (profile.subjects.length > 0 ? 50 : 0) : 0)}%` as any }]} />
                            </View>
                            <Text variant="caption" weight="bold" color={colors.primary}>
                                {Math.round((profile?.bio ? 50 : 20) + (profile?.subjects?.length ? 50 : 0))}%
                            </Text>
                        </View>
                        <Button
                            title="Continue Setup"
                            size="sm"
                            onPress={() => router.push('/profile/onboarding')}
                        />
                    </Card>
                )}

                {/* Main Stats Grid */}
                <View style={styles.statsGrid}>
                    <StatCard
                        title="Profile Views"
                        value={stats.totalViews.toLocaleString()}
                        icon="eye-outline"
                        color="#6366f1"
                    />
                    <StatCard
                        title="Completed"
                        value={stats.completedBookings.toString()}
                        icon="checkmark-done-circle-outline"
                        color={colors.success}
                    />
                    <StatCard
                        title="Total Earnings"
                        value={`£${stats.totalEarnings.toLocaleString()}`}
                        icon="cash-outline"
                        color="#f59e0b"
                        isFullWidth
                    />
                </View>



                {/* Score & Health Section */}
                <Section paddingVertical="md">
                    <Text variant="h3" weight="heavy" style={{ marginBottom: spacing.md }}>Service Score</Text>
                    <View style={styles.healthCard}>
                        <View style={styles.healthItem}>
                            <Text variant="h2" weight="heavy" color={colors.primary}>
                                {Math.round(stats.responseRate)}%
                            </Text>
                            <Text variant="caption" color={colors.neutrals.textMuted} weight="bold">RESPONSE RATE</Text>
                        </View>
                        <View style={styles.healthDivider} />
                        <View style={styles.healthItem}>
                            <Text variant="h2" weight="heavy" color={colors.success}>
                                {stats.activeBookings}
                            </Text>
                            <Text variant="caption" color={colors.neutrals.textMuted} weight="bold">ACTIVE SESSIONS</Text>
                        </View>
                        <View style={styles.healthDivider} />
                        <View style={styles.healthItem}>
                            <Text variant="h2" weight="heavy" color="#f59e0b">
                                {stats.pendingBookings}
                            </Text>
                            <Text variant="caption" color={colors.neutrals.textMuted} weight="bold">PENDING</Text>
                        </View>
                    </View>
                </Section>

                {/* Quick Actions */}
                <Section paddingVertical="md">
                    <Text variant="h3" weight="heavy" style={{ marginBottom: spacing.md }}>Operations</Text>
                    <View style={styles.actionsContainer}>
                        <ActionButton
                            label="Manage Bookings"
                            icon="calendar-outline"
                            onPress={() => router.push('/(tabs)/bookings')}
                        />
                        <ActionButton
                            label="Tutor Settings"
                            icon="options-outline"
                            onPress={() => router.push('/profile/tutor-settings')}
                        />
                        <ActionButton
                            label="Public Preview"
                            icon="share-outline"
                            onPress={() => {
                                if (profile?.id) {
                                    router.push(`/tutor/${profile.id}`);
                                }
                            }}
                        />
                    </View>
                </Section>

                <View style={styles.tipCard}>
                    <View style={[styles.statIconContainer, { backgroundColor: colors.primarySoft }]}>
                        <Ionicons name="bulb-outline" size={24} color={colors.primary} />
                    </View>
                    <View style={styles.tipContent}>
                        <Text variant="bodySmall" weight="heavy" color={colors.primaryDark}>Pro Tip</Text>
                        <Text variant="caption" color={colors.primaryDark} style={{ lineHeight: 18 }}>
                            Tutors who update their availability weekly receive 3x more booking requests.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// Sub-components with Design System alignment
function StatCard({ title, value, icon, color, isFullWidth }: { title: string, value: string, icon: any, color: string, isFullWidth?: boolean }) {
    return (
        <Card style={[styles.statCard, isFullWidth && styles.statCardFull]} variant="elevated">
            <View style={[styles.statIconContainer, { backgroundColor: `${color}10` }]}>
                <Ionicons name={icon} size={24} color={color} />
            </View>
            <View>
                <Text variant="h2" weight="heavy">{value}</Text>
                <Text variant="caption" color={colors.neutrals.textMuted} weight="bold">{title.toUpperCase()}</Text>
            </View>
        </Card>
    );
}

function ActionButton({ label, icon, onPress }: { label: string, icon: any, onPress: () => void }) {
    return (
        <TouchableOpacity style={styles.actionBtn} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.actionIcon}>
                <Ionicons name={icon} size={20} color={colors.primary} />
            </View>
            <Text variant="body" weight="semibold" style={{ flex: 1 }}>{label}</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.neutrals.borderAlt} />
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
        marginTop: spacing.md,
    },
    headerTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    setupCard: {
        padding: spacing.lg,
        marginBottom: spacing.xl,
        borderWidth: 1,
        borderColor: colors.primaryLight,
        backgroundColor: colors.primarySoft,
    },
    setupHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        marginBottom: spacing.md,
    },
    setupIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        marginBottom: spacing.lg,
    },
    progressTrack: {
        flex: 1,
        height: 8,
        backgroundColor: colors.neutrals.surface,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.primary,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 6,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
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
        padding: spacing.lg,
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
    healthCard: {
        flexDirection: 'row',
        backgroundColor: colors.neutrals.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
        ...shadows.sm,
    },
    healthItem: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    healthDivider: {
        width: 1,
        height: '60%',
        backgroundColor: colors.neutrals.border,
        alignSelf: 'center',
    },
    actionsContainer: {
        gap: spacing.sm,
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.neutrals.surface,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.neutrals.border,
        gap: spacing.md,
    },
    actionIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tipCard: {
        flexDirection: 'row',
        backgroundColor: colors.primarySoft,
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.primaryLight,
        gap: spacing.md,
        marginTop: spacing.xl,
    },
    tipContent: {
        flex: 1,
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
