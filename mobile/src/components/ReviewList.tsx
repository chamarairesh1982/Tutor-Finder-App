import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../lib/theme';
import { Review } from '../types';

interface ReviewListProps {
    reviews?: Review[];
    averageRating?: number;
    totalCount?: number;
    sort: 'recent' | 'highest';
    onSortChange: (value: 'recent' | 'highest') => void;
}

export function ReviewList({ reviews = [], averageRating = 0, totalCount = 0, sort, onSortChange }: ReviewListProps) {
    const breakdown = useMemo(() => {
        const buckets = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>;
        reviews.forEach((review) => {
            buckets[review.rating] = (buckets[review.rating] ?? 0) + 1;
        });
        return buckets;
    }, [reviews]);

    const renderSortPill = (value: 'recent' | 'highest', label: string) => {
        const isActive = sort === value;
        return (
            <TouchableOpacity
                style={[styles.sortPill, isActive && styles.sortPillActive]}
                onPress={() => onSortChange(value)}
                activeOpacity={0.85}
            >
                <Text style={[styles.sortText, isActive && styles.sortTextActive]}>{label}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <View>
                    <Text style={styles.ratingValue}>{averageRating.toFixed(1)}</Text>
                    <Text style={styles.ratingLabel}>{totalCount} reviews</Text>
                </View>
                <View style={styles.sortRow}>
                    {renderSortPill('recent', 'Most recent')}
                    {renderSortPill('highest', 'Highest rated')}
                </View>
            </View>

            <View style={styles.breakdownRow}>
                {([5, 4, 3, 2, 1] as const).map((star) => {
                    const count = breakdown[star];
                    return (
                        <View key={star} style={styles.breakdownItem}>
                            <Text style={styles.breakdownLabel}>{star}★</Text>
                            <View style={styles.barTrack}>
                                <View style={[styles.barFill, { flex: Math.max(count, 0) + 0.1 }]} />
                            </View>
                            <Text style={styles.breakdownCount}>{count}</Text>
                        </View>
                    );
                })}
            </View>

            {reviews.length === 0 ? (
                <Text style={styles.empty}>No reviews yet. Be the first to leave feedback.</Text>
            ) : (
                <View style={styles.reviewStack}>
                    {reviews.map((review) => (
                        <View key={review.id} style={styles.reviewCard}>
                            <View style={styles.reviewHeader}>
                                <Text style={styles.reviewer}>{review.studentName}</Text>
                                <Text style={styles.reviewMeta}>{review.rating}★ · {new Date(review.createdAt).toLocaleDateString()}</Text>
                            </View>
                            <Text style={styles.reviewBody}>{review.comment}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: spacing.md,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ratingValue: {
        fontSize: typography.fontSize['3xl'],
        fontWeight: typography.fontWeight.heavy,
        color: colors.neutrals.textPrimary,
        letterSpacing: -0.5,
    },
    ratingLabel: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textSecondary,
    },
    sortRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    sortPill: {
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
        backgroundColor: colors.neutrals.surfaceAlt,
    },
    sortPillActive: {
        backgroundColor: colors.primarySoft,
        borderColor: colors.primary,
    },
    sortText: {
        color: colors.neutrals.textPrimary,
        fontWeight: typography.fontWeight.semibold,
    },
    sortTextActive: {
        color: colors.primaryDark,
    },
    breakdownRow: {
        gap: spacing.xs,
    },
    breakdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    breakdownLabel: {
        width: 32,
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textSecondary,
    },
    barTrack: {
        flex: 1,
        height: 8,
        backgroundColor: colors.neutrals.surfaceAlt,
        borderRadius: borderRadius.full,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        backgroundColor: colors.primary,
        borderRadius: borderRadius.full,
    },
    breakdownCount: {
        width: 32,
        textAlign: 'right',
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textSecondary,
    },
    reviewStack: {
        gap: spacing.sm,
    },
    reviewCard: {
        backgroundColor: colors.neutrals.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.xs,
    },
    reviewer: {
        fontWeight: typography.fontWeight.semibold,
        color: colors.neutrals.textPrimary,
    },
    reviewMeta: {
        fontSize: typography.fontSize.xs,
        color: colors.neutrals.textSecondary,
    },
    reviewBody: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textSecondary,
        lineHeight: 20,
    },
    empty: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textSecondary,
    },
});
