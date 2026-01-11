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
            case BookingStatus.Pending: return { bg: colors.statusPending, text: colors.statusPendingText, icon: 'time' };
            case BookingStatus.Accepted: return { bg: colors.statusAccepted, text: colors.statusAcceptedText, icon: 'checkmark-circle' };
            case BookingStatus.Declined: return { bg: colors.statusDeclined, text: colors.statusDeclinedText, icon: 'close-circle' };
            case BookingStatus.Completed: return { bg: colors.neutrals.surfaceAlt, text: colors.neutrals.textSecondary, icon: 'checkmark-done-circle' };
            default: return { bg: colors.neutrals.surfaceAlt, text: colors.neutrals.textSecondary, icon: 'help-circle' };
        }
    };

    const getStatusLabel = (status: BookingStatus) => {
        return BookingStatus[status];
    };

    const renderBookingItem = ({ item }: { item: Booking }) => {
        const { bg, text, icon } = getStatusColor(item.status);

        return (
            <TouchableOpacity
                style={styles.bookingCard}
                onPress={() => router.push(`/booking/${item.id}`)}
                activeOpacity={0.9}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.tutorInfo}>
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>{item.tutorName.charAt(0)}</Text>
                        </View>
                        <View>
                            <Text style={styles.tutorName}>{item.tutorName}</Text>
                            <Text style={styles.bookingRate}>£{item.pricePerHour}/hr</Text>
                        </View>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: bg }]}>
                        <Ionicons name={icon as any} size={14} color={text} />
                        <Text style={[styles.statusText, { color: text }]}>
                            {getStatusLabel(item.status)}
                        </Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.cardBody}>
                    <View style={styles.detailRow}>
                        <Ionicons name="calendar-outline" size={16} color={colors.neutrals.textMuted} />
                        <Text style={styles.detailText}>{item.preferredDate || 'Date TBD'}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Ionicons name={item.preferredMode === 1 ? "videocam-outline" : "location-outline"} size={16} color={colors.neutrals.textMuted} />
                        <Text style={styles.detailText}>
                            {item.preferredMode === 0 ? 'In Person' : item.preferredMode === 1 ? 'Online' : 'Flexible Mode'}
                        </Text>
                    </View>
                </View>

                {item.messages && item.messages.length > 0 && (
                    <View style={styles.messagePreviewContainer}>
                        <View style={styles.messageLine} />
                        <Text style={styles.messagePreview} numberOfLines={1}>
                            "{item.messages[item.messages.length - 1].content}"
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    const pendingCount = listData.filter((b) => b.status === BookingStatus.Pending).length;

    if (!isAuthenticated) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.emptyContainer}>
                    <Ionicons name="lock-closed-outline" size={64} color={colors.neutrals.surfaceAlt} />
                    <Text style={styles.emptyTitle}>Sign in to view bookings</Text>
                    <Text style={styles.emptyText}>Booking requests and chat live here once you’re signed in.</Text>
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

    if (isLoading && !listData.length) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
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
                keyExtractor={(item, index) => item.id || `booking-${index}`}
                renderItem={renderBookingItem}
                contentContainerStyle={styles.listContent}
                refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={colors.primary} />}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="calendar-clear-outline" size={64} color={colors.neutrals.surfaceAlt} />
                        <Text style={styles.emptyTitle}>No Bookings Yet</Text>
                        <Text style={styles.emptyText}>Start your learning journey by finding a great tutor.</Text>
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
        backgroundColor: colors.neutrals.surfaceAlt,
    },
    header: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.neutrals.surfaceAlt,
    },
    title: {
        fontSize: typography.fontSize['3xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
        letterSpacing: -0.5,
    },
    pendingBadge: {
        backgroundColor: colors.statusPending,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.full,
    },
    pendingBadgeText: {
        color: colors.statusPendingText,
        fontSize: 10,
        fontWeight: typography.fontWeight.bold,
        letterSpacing: 0.5,
    },
    listContent: {
        padding: spacing.md,
        paddingBottom: spacing.xl,
    },
    bookingCard: {
        backgroundColor: colors.neutrals.background,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.md,
        // Premium shadow
        shadowColor: 'rgba(0,0,0,0.08)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 12,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    tutorInfo: {
        flexDirection: 'row',
        gap: spacing.md,
        alignItems: 'center',
    },
    avatarPlaceholder: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: colors.primary,
        fontWeight: typography.fontWeight.bold,
        fontSize: typography.fontSize.lg,
    },
    tutorName: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
    },
    bookingRate: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textSecondary,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: borderRadius.full,
        gap: 4,
    },
    statusText: {
        fontSize: 10,
        fontWeight: typography.fontWeight.bold,
        textTransform: 'uppercase',
    },
    divider: {
        height: 1,
        backgroundColor: colors.neutrals.surfaceAlt,
        marginVertical: spacing.md,
    },
    cardBody: {
        flexDirection: 'row',
        gap: spacing.xl,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    detailText: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textSecondary,
        fontWeight: typography.fontWeight.medium,
    },
    messagePreviewContainer: {
        marginTop: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    messageLine: {
        width: 2,
        height: '100%',
        backgroundColor: colors.neutrals.surfaceAlt,
        borderRadius: borderRadius.full,
    },
    messagePreview: {
        color: colors.neutrals.textMuted,
        fontStyle: 'italic',
        fontSize: typography.fontSize.xs,
        flex: 1,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing['4xl'],
        gap: spacing.md,
    },
    emptyTitle: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
        marginTop: spacing.md,
    },
    emptyText: {
        fontSize: typography.fontSize.base,
        color: colors.neutrals.textSecondary,
        textAlign: 'center',
        maxWidth: 250,
    },
    browseButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.full,
        marginTop: spacing.md,
    },
    browseButtonText: {
        color: colors.neutrals.background,
        fontWeight: typography.fontWeight.bold,
    },
});
