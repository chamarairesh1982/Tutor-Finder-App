import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '../lib/theme';
import { TutorSearchResult } from '../types';
import { useIsFavorite, useAddFavorite, useRemoveFavorite } from '../hooks/useFavorites';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './Text';
import { Card } from './Card';

interface TutorCardProps {
    tutor: TutorSearchResult;
    onPress: () => void;
}

export function TutorCard({ tutor, onPress }: TutorCardProps) {
    const { isAuthenticated } = useAuthStore();
    const { addToast } = useNotificationStore();
    const { data: favoriteData } = useIsFavorite(tutor.id);
    const addFavorite = useAddFavorite();
    const removeFavorite = useRemoveFavorite();

    const isFavorite = favoriteData?.isFavorite ?? false;

    const toggleFavorite = (e: any) => {
        e?.stopPropagation?.();
        if (!isAuthenticated) {
            addToast({ type: 'info', title: 'Sign in to save', message: 'Create an account to keep track of your favorites.' });
            return;
        }
        if (isFavorite) {
            removeFavorite.mutate(tutor.id);
        } else {
            addFavorite.mutate(tutor.id);
        }
    };

    return (
        <Card variant="elevated" onPress={onPress} style={styles.card}>
            <View style={styles.content}>
                {/* Avatar Section */}
                <View style={styles.avatarSection}>
                    {tutor.photoUrl ? (
                        <Image source={{ uri: tutor.photoUrl }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarFallback}>
                            <Text variant="h3" weight="heavy" color={colors.primary}>
                                {tutor.fullName.split(' ').map(n => n[0]).join('')}
                            </Text>
                        </View>
                    )}
                    {tutor.teachingMode !== 0 && (
                        <View style={styles.onlineBadge}>
                            <View style={styles.onlineDot} />
                        </View>
                    )}
                </View>

                {/* Info Section */}
                <View style={styles.infoSection}>
                    <View style={styles.headerRow}>
                        <View style={styles.nameBlock}>
                            <Text variant="body" weight="heavy" numberOfLines={1}>{tutor.fullName}</Text>
                            {tutor.hasDbs && (
                                <View style={styles.verifiedIcon}>
                                    <Ionicons name="shield-checkmark" size={14} color={colors.success} />
                                </View>
                            )}
                        </View>
                        <TouchableOpacity onPress={toggleFavorite} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Ionicons
                                name={isFavorite ? "heart" : "heart-outline"}
                                size={22}
                                color={isFavorite ? colors.primary : colors.neutrals.textMuted}
                            />
                        </TouchableOpacity>
                    </View>

                    <Text variant="bodySmall" weight="bold" color={colors.primary} style={styles.subject}>
                        {tutor.subjects?.[0]}
                    </Text>

                    <View style={styles.metaRow}>
                        <View style={styles.ratingBlock}>
                            <Ionicons name="star" size={14} color={colors.ratingStars} />
                            <Text variant="caption" weight="heavy" style={{ marginLeft: 4 }}>
                                {tutor.averageRating.toFixed(1)}
                            </Text>
                            <Text variant="caption" color={colors.neutrals.textMuted} style={{ marginLeft: 2 }}>
                                ({tutor.reviewCount})
                            </Text>
                        </View>
                        <Text variant="caption" color={colors.neutrals.textSecondary}>
                            {tutor.distanceMiles > 0 ? `${tutor.distanceMiles.toFixed(1)} mi` : 'Online'}
                        </Text>
                    </View>

                    {tutor.nextAvailableText && (
                        <View style={styles.availabilityRow}>
                            <Ionicons name="calendar-outline" size={12} color={colors.success} />
                            <Text variant="caption" weight="bold" color={colors.success} style={{ marginLeft: 4 }}>
                                {tutor.nextAvailableText}
                            </Text>
                        </View>
                    )}

                    <View style={styles.priceRow}>
                        <Text variant="bodyLarge" weight="heavy">£{tutor.pricePerHour}<Text variant="caption">/hr</Text></Text>
                        <View style={styles.trustBadges}>
                            {tutor.hasDbs && (
                                <View style={styles.dbsBadge}>
                                    <Ionicons name="shield-checkmark" size={12} color={colors.trust.dbs} />
                                    <Text variant="caption" weight="bold" color={colors.trust.dbs}> DBS</Text>
                                </View>
                            )}
                            {tutor.hasCertification && (
                                <View style={styles.certBadge}>
                                    <Ionicons name="ribbon" size={12} color={colors.trust.certified} />
                                    <Text variant="caption" weight="bold" color={colors.trust.certified}> Qualified</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: spacing.md,
        marginHorizontal: spacing.md,
        marginBottom: spacing.md,
        borderRadius: borderRadius.lg,
        ...shadows.sm,
    },
    content: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    avatarSection: {
        position: 'relative',
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 14,
        backgroundColor: colors.neutrals.surfaceAlt,
    },
    avatarFallback: {
        width: 80,
        height: 80,
        borderRadius: 14,
        backgroundColor: colors.neutrals.surfaceAlt,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.neutrals.border,
    },
    onlineBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        backgroundColor: colors.neutrals.surface,
        padding: 2,
        borderRadius: 8,
        ...shadows.sm,
    },
    onlineDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.success,
    },
    infoSection: {
        flex: 1,
        justifyContent: 'center',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    nameBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 4,
    },
    verifiedIcon: {
        marginTop: 2,
    },
    subject: {
        marginBottom: 2,
    },
    availabilityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    ratingBlock: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 2,
        backgroundColor: colors.neutrals.borderAlt,
        marginHorizontal: 8,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    trustBadges: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dbsBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.trust.dbsLight,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: borderRadius.full,
    },
    certBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.trust.certifiedLight,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: borderRadius.full,
    },
});
