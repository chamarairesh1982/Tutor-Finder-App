import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { colors, spacing, borderRadius, shadows, typography } from '../lib/theme';
import { TutorSearchResult, TeachingMode } from '../types';
import { Button } from './Button';
import { Text } from './Text';
import { Card } from './Card';
import { useIsFavorite, useAddFavorite, useRemoveFavorite } from '../hooks/useFavorites';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import { Ionicons } from '@expo/vector-icons';

interface TutorCardWebProps {
    tutor: TutorSearchResult;
    onPress?: () => void;
    onRequestBooking?: () => void;
    onViewProfile?: () => void;
}

const modeLabel: Record<TeachingMode, string> = {
    [TeachingMode.InPerson]: 'In-person',
    [TeachingMode.Online]: 'Online',
    [TeachingMode.Both]: 'In-person & Online',
};

export function TutorCardWeb({ tutor, onPress, onRequestBooking, onViewProfile }: TutorCardWebProps) {
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
            <View style={styles.premiumIndicator} />
            <View style={styles.content}>
                {/* Left: Avatar Section */}
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

                {/* Center: Details Section */}
                <View style={styles.detailsSection}>
                    <View style={styles.nameRow}>
                        <View style={styles.nameAndVerify}>
                            <Text variant="h3" weight="heavy" style={styles.name} numberOfLines={1}>{tutor.fullName}</Text>
                            {tutor.hasDbs && (
                                <View style={styles.verifiedBadge}>
                                    <Ionicons name="shield-checkmark" size={14} color={colors.success} />
                                    <Text variant="caption" weight="heavy" color={colors.success} style={{ marginLeft: 4 }}>DBS</Text>
                                </View>
                            )}
                        </View>
                        <TouchableOpacity
                            onPress={toggleFavorite}
                            style={styles.favoriteBtn}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Ionicons
                                name={isFavorite ? "heart" : "heart-outline"}
                                size={22}
                                color={isFavorite ? colors.primary : colors.neutrals.textMuted}
                            />
                        </TouchableOpacity>
                    </View>

                    <Text variant="body" weight="heavy" color={colors.primary} style={styles.subject} numberOfLines={1}>
                        {tutor.subjects?.slice(0, 3).join(', ') || 'Tutor'}
                    </Text>

                    <View style={styles.metaRow}>
                        <View style={styles.ratingBlock}>
                            <Ionicons name="star" size={16} color={colors.ratingStars} />
                            <Text weight="heavy" style={{ marginLeft: 6 }}>{tutor.averageRating.toFixed(1)}</Text>
                            <Text variant="bodySmall" color={colors.neutrals.textMuted} style={{ marginLeft: 4 }}>
                                ({tutor.reviewCount})
                            </Text>
                        </View>
                        <View style={styles.dot} />
                        <View style={styles.modeBlock}>
                            <Ionicons name="location-outline" size={14} color={colors.neutrals.textSecondary} />
                            <Text variant="bodySmall" color={colors.neutrals.textSecondary} style={{ marginLeft: 4 }}>
                                {modeLabel[tutor.teachingMode ?? TeachingMode.Both]}
                                {tutor.distanceMiles > 0 && ` (${tutor.distanceMiles.toFixed(1)} mi)`}
                            </Text>
                        </View>
                    </View>

                    {tutor.nextAvailableText && (
                        <View style={styles.availabilityRow}>
                            <Ionicons name="calendar-outline" size={14} color={colors.success} />
                            <Text variant="bodySmall" weight="bold" color={colors.success} style={{ marginLeft: 6 }}>
                                {tutor.nextAvailableText}
                            </Text>
                        </View>
                    )}

                    <Text variant="bodySmall" color={colors.neutrals.textSecondary} numberOfLines={2} style={styles.bio}>
                        {tutor.bio || 'Tutor available for personalised sessions to help you reach your goals.'}
                    </Text>
                </View>

                {/* Right: Actions Section */}
                <View style={styles.actionSection}>
                    <View style={styles.priceBlock}>
                        <View style={styles.priceHeader}>
                            <Text variant="h2" weight="heavy">£{tutor.pricePerHour}</Text>
                            <Text variant="bodySmall" color={colors.neutrals.textMuted} style={{ marginLeft: 4, marginBottom: 4 }}>/ hr</Text>
                        </View>
                        <View style={styles.trustBadgeRow}>
                            {tutor.hasDbs && (
                                <View style={styles.dbsBadge}>
                                    <Ionicons name="shield-checkmark" size={12} color={colors.trust.dbs} />
                                    <Text variant="caption" weight="heavy" color={colors.trust.dbs} style={{ marginLeft: 4 }}>DBS</Text>
                                </View>
                            )}
                        </View>
                    </View>

                    <View style={styles.btnGroup}>
                        <Button
                            title="View Profile"
                            variant="outline"
                            size="md"
                            onPress={onViewProfile || (onPress ? onPress : () => { })}
                            fullWidth
                        />
                        <Button
                            title="Request Booking"
                            variant="primary"
                            size="md"
                            onPress={onRequestBooking || (onPress ? onPress : () => { })}
                            fullWidth
                            style={{ marginTop: spacing.sm }}
                        />
                    </View>
                </View>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: 20,
        marginBottom: spacing.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.neutrals.border,
        ...shadows.subtle,
        ...Platform.select({
            web: {
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                ':hover': {
                    transform: [{ translateY: -4 }],
                    ...shadows.md,
                    borderColor: colors.primary + '40',
                }
            } as any
        })
    },
    premiumIndicator: {
        height: 4,
        width: '100%',
        backgroundColor: colors.primarySoft,
        opacity: 0.5,
    },
    content: {
        flexDirection: 'row',
        padding: spacing.lg,
        width: '100%',
    },
    avatarSection: {
        position: 'relative',
        marginRight: spacing.lg,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 16,
        backgroundColor: colors.neutrals.surfaceAlt,
    },
    avatarFallback: {
        width: 110,
        height: 110,
        borderRadius: 16,
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
        padding: 3,
        borderRadius: 10,
        ...shadows.sm,
    },
    onlineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.success,
    },
    detailsSection: {
        flex: 1,
        flexShrink: 1,
        minWidth: 0,
        marginRight: spacing.lg,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.xs,
    },
    nameAndVerify: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    name: {
        letterSpacing: -0.5,
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#A7F3D0',
    },
    favoriteBtn: {
        backgroundColor: colors.neutrals.surface,
        padding: 8,
        borderRadius: 12,
        ...shadows.sm,
    },
    subject: {
        marginBottom: spacing.sm,
        fontSize: 15,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    ratingBlock: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    availabilityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    modeBlock: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.neutrals.borderAlt,
        marginHorizontal: spacing.md,
    },
    bio: {
        lineHeight: 22,
        fontSize: 14,
        color: colors.neutrals.textSecondary,
    },
    actionSection: {
        width: 180,
        justifyContent: 'space-between',
        borderLeftWidth: 1,
        borderLeftColor: colors.neutrals.border,
        paddingLeft: spacing.lg,
    },
    priceBlock: {
        alignItems: 'flex-end',
        gap: 2,
        marginBottom: spacing.md,
    },
    priceHeader: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    trustBadgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        justifyContent: 'flex-end',
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
    btnGroup: {
        width: '100%',
    }
});
