import React from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useMyBookings } from '../../src/hooks/useBookings';
import { useAuthStore } from '../../src/store/authStore';
import { colors, spacing, typography, borderRadius, shadows } from '../../src/lib/theme';
import { Booking, BookingStatus } from '../../src/types';

export default function BookingsScreen() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const { data: bookings, isLoading, isError, refetch } = useMyBookings(isAuthenticated);

    const listData = (Array.isArray(bookings) ? bookings : (bookings as any)?.items ?? []) as Booking[];

    const getStatusColor = (status: BookingStatus) => {
        switch (status) {
            case BookingStatus.Pending: return { bg: colors.statusPending, text: colors.statusPendingText };
            case BookingStatus.Accepted: return { bg: colors.statusAccepted, text: colors.statusAcceptedText };
            case BookingStatus.Declined: return { bg: colors.statusDeclined, text: colors.statusDeclinedText };
            case BookingStatus.Completed: return { bg: colors.neutrals.surfaceAlt, text: colors.neutrals.textSecondary };
            default: return { bg: colors.neutrals.surfaceAlt, text: colors.neutrals.textSecondary };
        }
    };

    const getStatusLabel = (status: BookingStatus) => {
        return BookingStatus[status];
    };

    const renderBookingItem = ({ item }: { item: Booking }) => {
        const { bg, text } = getStatusColor(item.status);

        return (
            <TouchableOpacity
                style={styles.bookingCard}
                onPress={() => router.push(`/booking/${item.id}`)}
                activeOpacity={0.9}
            >
                <View style={[styles.statusIndicator, { backgroundColor: text }]} />

                <View style={styles.cardMain}>
                    <View style={styles.cardTop}>
                        <View style={styles.tutorAvatar}>
                            <Text style={styles.avatarInitial}>{item.tutorName.charAt(0)}</Text>
                        </View>
                        <View style={styles.headerInfo}>
                            <Text style={styles.tutorNameText}>{item.tutorName}</Text>
                            <View style={styles.metaRow}>
                                <Text style={styles.categoryBadge}>Mathematics</Text>
                                <Text style={styles.dot}>•</Text>
                                <Text style={styles.pricePerHour}>£{item.pricePerHour}/hr</Text>
                            </View>
                        </View>
                        <View style={[styles.pillBadge, { backgroundColor: bg }]}>
                            <Text style={[styles.pillText, { color: text }]}>{getStatusLabel(item.status)}</Text>
                        </View>
                    </View>

                    <View style={styles.bookingDetails}>
                        <View style={styles.detailItem}>
                            <Ionicons name="calendar-outline" size={14} color={colors.neutrals.textMuted} />
                            <Text style={styles.detailValue}>{item.preferredDate || 'TBD'}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Ionicons name={item.preferredMode === 1 ? "videocam-outline" : "people-outline"} size={14} color={colors.neutrals.textMuted} />
                            <Text style={styles.detailValue}>
                                {item.preferredMode === 0 ? 'In Person' : item.preferredMode === 1 ? 'Online' : 'Flexible'}
                            </Text>
                        </View>
                    </View>

                    {item.messages && item.messages.length > 0 && (
                        <View style={styles.lastMessageContainer}>
                            <Ionicons name="chatbubble-ellipses-outline" size={14} color={colors.primary} />
                            <Text style={styles.lastMessageText} numberOfLines={1}>
                                {item.messages[item.messages.length - 1].content}
                            </Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    const pendingCount = listData.filter((b) => b.status === BookingStatus.Pending).length;

    if (!isAuthenticated) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.emptyContainer}>
                    <Ionicons name="lock-closed-outline" size={64} color={colors.neutrals.surfaceAlt} />
                    <Text style={styles.emptyTitle}>Sign in to view</Text>
                    <Text style={styles.emptyText}>Track your learning requests and chat with tutors once you’re signed in.</Text>
                    <TouchableOpacity
                        style={styles.browseButton}
                        onPress={() => router.push('/(auth)/login')}
                    >
                        <Text style={styles.browseButtonText}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.title}>My Bookings</Text>
                {pendingCount > 0 && (
                    <View style={styles.pendingBadge}>
                        <Text style={styles.pendingBadgeText}>{pendingCount} PENDING</Text>
                    </View>
                )}
            </View>

            <FlatList
                data={listData}
                keyExtractor={(item) => item.id}
                renderItem={renderBookingItem}
                contentContainerStyle={styles.listContent}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={colors.primary} />}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="calendar-clear-outline" size={64} color={colors.neutrals.surfaceAlt} />
                        <Text style={styles.emptyTitle}>No Bookings Yet</Text>
                        <Text style={styles.emptyText}>Find a tutor and start your first lesson today.</Text>
                        <TouchableOpacity
                            style={styles.browseButton}
                            onPress={() => router.push('/')}
                        >
                            <Text style={styles.browseButtonText}>Browse Tutors</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.neutrals.background,
    },
    header: {
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.md,
        paddingBottom: spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 32,
        fontWeight: typography.fontWeight.heavy,
        color: colors.neutrals.textPrimary,
        letterSpacing: -1,
    },
    pendingBadge: {
        backgroundColor: colors.primaryDark,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
    },
    pendingBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    listContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing['4xl'],
    },
    bookingCard: {
        backgroundColor: colors.neutrals.surface,
        borderRadius: 24,
        marginBottom: spacing.lg,
        flexDirection: 'row',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
        ...shadows.sm,
    },
    statusIndicator: {
        width: 6,
        height: '100%',
    },
    cardMain: {
        flex: 1,
        padding: spacing.lg,
        gap: spacing.md,
    },
    cardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    tutorAvatar: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    avatarInitial: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primaryDark,
    },
    headerInfo: {
        flex: 1,
    },
    tutorNameText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.neutrals.textPrimary,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    categoryBadge: {
        fontSize: 12,
        color: colors.neutrals.textSecondary,
    },
    dot: {
        fontSize: 12,
        color: colors.neutrals.textMuted,
    },
    pricePerHour: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.primaryDark,
    },
    pillBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    pillText: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    bookingDetails: {
        flexDirection: 'row',
        gap: spacing.lg,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailValue: {
        fontSize: 14,
        color: colors.neutrals.textSecondary,
        fontWeight: '500',
    },
    lastMessageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: colors.neutrals.surfaceAlt,
        padding: 10,
        borderRadius: 12,
    },
    lastMessageText: {
        fontSize: 13,
        color: colors.neutrals.textSecondary,
        fontStyle: 'italic',
        flex: 1,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing['5xl'],
        gap: spacing.lg,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: typography.fontWeight.heavy,
        color: colors.neutrals.textPrimary,
    },
    emptyText: {
        fontSize: 16,
        color: colors.neutrals.textSecondary,
        textAlign: 'center',
        paddingHorizontal: spacing.xl,
        lineHeight: 24,
    },
    browseButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing['2xl'],
        paddingVertical: spacing.lg,
        borderRadius: borderRadius.full,
        ...shadows.md,
    },
    browseButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});
