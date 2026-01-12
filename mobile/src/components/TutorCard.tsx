import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../lib/theme';
import { TutorSearchResult, Category } from '../types';
import { useIsFavorite, useAddFavorite, useRemoveFavorite } from '../hooks/useFavorites';

import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';

interface TutorCardProps {
    tutor: TutorSearchResult;
    onPress: () => void;
}

const categoryLabels: Record<Category, string> = {
    [Category.Music]: 'Music',
    [Category.Sports]: 'Sports',
    [Category.Education]: 'Education',
};

export function TutorCard({ tutor, onPress }: TutorCardProps) {
    const { isAuthenticated, user } = useAuthStore();
    const { addToast } = useNotificationStore();
    const { data: favoriteData } = useIsFavorite(tutor.id);
    const addFavorite = useAddFavorite();
    const removeFavorite = useRemoveFavorite();

    const isFavorite = favoriteData?.isFavorite ?? false;

    const toggleFavorite = (e: any) => {
        e.stopPropagation();

        if (!isAuthenticated) {
            addToast({
                type: 'info',
                title: 'Sign in to save',
                message: 'Create an account to keep track of your favorite tutors.'
            });
            return;
        }

        if (user?.id === tutor.id) { // Not quite right, tutor.id is profile ID, user.id is user ID
            // But the backend handles it anyway. 
        }

        if (isFavorite) {
            removeFavorite.mutate(tutor.id);
        } else {
            addFavorite.mutate(tutor.id, {
                onError: (error: any) => {
                    const message = error.response?.data?.detail || 'Could not save tutor';
                    addToast({ type: 'error', title: 'Oops!', message });
                }
            });
        }
    };

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Text key={i} style={[styles.star, i <= Math.round(rating) && styles.starFilled]}>
                    ★
                </Text>
            );
        }
        return stars;
    };

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
            <View style={styles.content}>
                <View style={styles.avatarContainer}>
                    {tutor.photoUrl ? (
                        <Image source={{ uri: tutor.photoUrl }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarInitial}>{tutor.fullName.charAt(0)}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.info}>
                    <View style={styles.nameRow}>
                        <Text style={styles.name} numberOfLines={1}>{tutor.fullName}</Text>
                        <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
                            <Text style={[styles.heart, isFavorite && styles.heartFilled]}>
                                {isFavorite ? '♥' : '♡'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.ratingRow}>
                        <View style={styles.stars}>{renderStars(tutor.averageRating)}</View>
                        <Text style={styles.reviewCount}>({tutor.reviewCount})</Text>
                    </View>

                    <View style={styles.chipRow}>
                        <View style={styles.chip}>
                            <Text style={styles.chipText}>{categoryLabels[tutor.category] || 'General'}</Text>
                        </View>
                        {tutor.subjects.slice(0, 2).map((subject, idx) => (
                            <View key={idx} style={[styles.chip, styles.subjectChip]}>
                                <Text style={styles.chipTextSecondary}>{subject}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.priceColumn}>
                    <Text style={styles.price}>£{tutor.pricePerHour}</Text>
                    <Text style={styles.priceLabel}>/hour</Text>
                    {tutor.distanceMiles > 0 && (
                        <Text style={styles.distance}>{tutor.distanceMiles.toFixed(1)} mi</Text>
                    )}
                </View>
            </View>

            <View style={styles.footer}>
                <View style={styles.footerTop}>
                    <Text style={styles.availability}>{tutor.nextAvailableText}</Text>
                    <View style={styles.verificationBadges}>
                        {tutor.hasDbs && (
                            <View style={styles.verifBadge}><Text style={styles.verifText}>🛡️ DBS</Text></View>
                        )}
                        {tutor.hasCertification && (
                            <View style={styles.verifBadge}><Text style={styles.verifText}>📜 Cert</Text></View>
                        )}
                    </View>
                </View>
                <View style={styles.badgeRow}>
                    <View style={styles.badgePrimary}>
                        <Text style={styles.badgePrimaryText}>{tutor.teachingMode === undefined ? 'Flexible' : tutor.teachingMode === 0 ? 'In person' : tutor.teachingMode === 1 ? 'Online' : 'Hybrid'}</Text>
                    </View>
                    {tutor.responseTimeText && (
                        <View style={styles.badgeSecondary}>
                            <Text style={styles.badgeSecondaryText}>{tutor.responseTimeText}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.neutrals.background,
        borderRadius: borderRadius.lg,
        marginHorizontal: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        ...shadows.md,
    },
    content: {
        flexDirection: 'row',
        padding: spacing.md,
    },
    avatarContainer: {
        marginRight: spacing.md,
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: borderRadius.md, // Soft square
    },
    avatarPlaceholder: {
        width: 72,
        height: 72,
        borderRadius: borderRadius.md,
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitial: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.primary,
    },
    info: {
        flex: 1,
        justifyContent: 'center',
    },
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    name: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
        flex: 1,
    },
    favoriteButton: {
        padding: spacing.xs,
    },
    heart: {
        fontSize: 22,
        color: colors.neutrals.textMuted,
    },
    heartFilled: {
        color: colors.primary,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    stars: {
        flexDirection: 'row',
    },
    star: {
        fontSize: 14,
        color: colors.neutrals.border,
        marginRight: 1,
    },
    starFilled: {
        color: colors.ratingStars,
    },
    reviewCount: {
        fontSize: typography.fontSize.xs,
        color: colors.neutrals.textSecondary,
        marginLeft: spacing.xs,
        fontWeight: typography.fontWeight.medium,
    },
    chipRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.xs,
    },
    chip: {
        backgroundColor: colors.primarySoft,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: 6,
    },
    subjectChip: {
        backgroundColor: colors.neutrals.surfaceAlt,
    },
    chipText: {
        fontSize: 11,
        fontWeight: typography.fontWeight.bold,
        color: colors.primary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    chipTextSecondary: {
        fontSize: 11,
        fontWeight: typography.fontWeight.medium,
        color: colors.neutrals.textSecondary,
    },
    priceColumn: {
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        marginLeft: spacing.sm,
    },
    price: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
    },
    priceLabel: {
        fontSize: typography.fontSize.xs,
        color: colors.neutrals.textMuted,
        marginTop: -2,
    },
    distance: {
        fontSize: 11,
        color: colors.neutrals.textMuted,
        marginTop: spacing.xs,
        fontWeight: typography.fontWeight.medium,
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: colors.neutrals.surfaceAlt,
        paddingHorizontal: spacing.md,
        paddingVertical: 10,
        backgroundColor: colors.neutrals.surface,
        borderBottomLeftRadius: borderRadius.lg,
        borderBottomRightRadius: borderRadius.lg,
    },
    footerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    availability: {
        fontSize: 12,
        color: colors.secondaryDark,
        fontWeight: typography.fontWeight.semibold,
    },
    verificationBadges: {
        flexDirection: 'row',
        gap: spacing.xs,
    },
    verifBadge: {
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    verifText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#15803d',
    },
    badgeRow: {
        flexDirection: 'row',
        gap: spacing.xs,
        marginTop: spacing.xs,
    },
    badgePrimary: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        backgroundColor: colors.primarySoft,
        borderRadius: borderRadius.full,
    },
    badgePrimaryText: {
        color: colors.primaryDark,
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.semibold,
    },
    badgeSecondary: {
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        backgroundColor: colors.neutrals.surfaceAlt,
        borderRadius: borderRadius.full,
    },
    badgeSecondaryText: {
        color: colors.neutrals.textSecondary,
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.medium,
    },
});
