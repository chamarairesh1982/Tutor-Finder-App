import React from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMyBookings } from '../../src/hooks/useBookings';
import { colors, spacing, typography, borderRadius, shadows } from '../../src/lib/theme';
import { Booking, BookingStatus } from '../../src/types';

export default function BookingsScreen() {
    const router = useRouter();
    const { data: bookings, isLoading, isError, refetch } = useMyBookings();
    const listData = (Array.isArray(bookings) ? bookings : (bookings as any)?.items ?? []) as Booking[];

    const getStatusColor = (status: BookingStatus) => {
        switch (status) {
            case BookingStatus.Pending: return { bg: colors.statusPending, text: colors.statusPendingText };
            case BookingStatus.Accepted: return { bg: colors.statusAccepted, text: colors.statusAcceptedText };
            case BookingStatus.Declined: return { bg: colors.statusDeclined, text: colors.statusDeclinedText };
            default: return { bg: colors.neutrals.surfaceAlt, text: colors.neutrals.textSecondary };
        }
    };

    const getStatusLabel = (status: BookingStatus) => {
        return BookingStatus[status];
    };

    const renderBookingItem = ({ item }: { item: Booking }) => {
        const statusStyles = getStatusColor(item.status);

        return (
            <TouchableOpacity
                style={styles.bookingCard}
                onPress={() => router.push(`/booking/${item.id}`)}
                activeOpacity={0.7}
            >
                <View style={styles.cardHeader}>
                    <Text style={styles.tutorName}>{item.tutorName}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyles.bg }]}>
                        <Text style={[styles.statusText, { color: statusStyles.text }]}>
                            {getStatusLabel(item.status)}
                        </Text>
                    </View>
                </View>

                <View style={styles.cardBody}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Date:</Text>
                        <Text style={styles.infoValue}>{item.preferredDate || 'TBD'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Mode:</Text>
                        <Text style={styles.infoValue}>
                            {item.preferredMode === 0 ? 'In Person' : item.preferredMode === 1 ? 'Online' : 'Flexible'}
                        </Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Rate:</Text>
                        <Text style={styles.infoValue}>£{item.pricePerHour}/hr</Text>
                    </View>
                </View>

                <View style={styles.cardFooter}>
                    <View style={styles.footerLeft}>
                        <View style={[styles.inlineBadge, { backgroundColor: statusStyles.bg }]}>
                            <Text style={[styles.inlineBadgeText, { color: statusStyles.text }]}>{getStatusLabel(item.status)}</Text>
                        </View>
                        <Text style={styles.messagePreview} numberOfLines={1}>
                            {item.messages && item.messages.length > 0 ? item.messages[item.messages.length - 1].content : 'No messages'}
                        </Text>
                    </View>
                    <Text style={styles.arrow}>›</Text>
                </View>

            </TouchableOpacity>
        );
    };

    if (isLoading) {
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
                {!!listData.filter((b) => b.status === BookingStatus.Pending).length && (
                    <View style={styles.pendingPill}>
                        <Text style={styles.pendingPillText}>
                            {listData.filter((b) => b.status === BookingStatus.Pending).length} pending
                        </Text>
                    </View>
                )}
            </View>

            {listData.length === 0 ? (
                <View style={styles.centered}>
                    <Text style={styles.emptyText}>You don't have any bookings yet.</Text>
                    <TouchableOpacity
                        style={styles.browseButton}
                        onPress={() => router.push('/')}
                    >
                        <Text style={styles.browseButtonText}>Browse Tutors</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={listData}
                    keyExtractor={(item, index) => item.id || `booking-${index}`}
                    renderItem={renderBookingItem}
                    contentContainerStyle={styles.listContent}
                    onRefresh={refetch}
                    refreshing={isLoading}
                    ListEmptyComponent={() => (
                        <View style={styles.centered}>
                            <Text style={styles.emptyText}>You don't have any bookings yet.</Text>
                        </View>
                    )}
                    ListFooterComponent={
                        <View style={styles.footerNote}>
                            <Text style={styles.footerNoteText}>Pull to refresh bookings</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.neutrals.background,
    },
    header: {
        padding: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
    },
    pendingPill: {
        marginLeft: spacing.md,
        alignSelf: 'center',
        backgroundColor: colors.statusPending,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.full,
    },
    pendingPillText: {
        color: colors.statusPendingText,
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.semibold,
    },
    listContent: {
        padding: spacing.md,
        paddingBottom: spacing.xl,
    },
    bookingCard: {
        backgroundColor: colors.neutrals.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        ...shadows.md,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    tutorName: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        color: colors.neutrals.textPrimary,
    },
    statusBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: borderRadius.sm,
    },
    statusText: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.bold,
        textTransform: 'uppercase',
    },
    cardBody: {
        marginBottom: spacing.md,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: spacing.xs,
    },
    infoLabel: {
        width: 60,
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textSecondary,
    },
    infoValue: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textPrimary,
        fontWeight: typography.fontWeight.medium,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: colors.neutrals.surfaceAlt,
        paddingTop: spacing.sm,
        gap: spacing.sm,
    },
    footerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        flex: 1,
    },
    inlineBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: borderRadius.full,
    },
    inlineBadgeText: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.bold,
    },
    messagePreview: {
        flex: 1,
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textSecondary,
        fontStyle: 'italic',
    },
    arrow: {
        fontSize: typography.fontSize.xl,
        color: colors.neutrals.textMuted,
        marginLeft: spacing.sm,
    },
    footerNote: {
        paddingVertical: spacing.md,
        alignItems: 'center',
    },
    footerNoteText: {
        color: colors.neutrals.textMuted,
        fontSize: typography.fontSize.sm,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
    },
    emptyText: {
        fontSize: typography.fontSize.base,
        color: colors.neutrals.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    browseButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
    },
    browseButtonText: {
        color: colors.neutrals.background,
        fontWeight: typography.fontWeight.bold,
        fontSize: typography.fontSize.base,
    },
    errorText: {
        fontSize: typography.fontSize.base,
        color: colors.error,
        textAlign: 'center',
    },
});
