import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../lib/theme';
import { TutorSearchResult, Category } from '../types';
import { useIsFavorite, useAddFavorite, useRemoveFavorite } from '../hooks/useFavorites';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';
import { Ionicons } from '@expo/vector-icons';

interface TutorCardProps {
    tutor: TutorSearchResult;
    onPress: () => void;
}

const categoryLabels: Record<Category, string> = {
    [Category.Music]: 'Music',
    [Category.Maths]: 'Maths',
    [Category.English]: 'English',
    [Category.Science]: 'Science',
    [Category.Languages]: 'Languages',
    [Category.Programming]: 'Programming',
    [Category.Other]: 'Other',
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
            addToast({ type: 'info', title: 'Sign in to save', message: 'Create an account to keep track of your favorite tutors.' });
            return;
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
                <Ionicons
                    key={i}
                    name={i <= Math.round(rating) ? "star" : "star-outline"}
                    size={14}
                    color={i <= Math.round(rating) ? colors.ratingStars : colors.neutrals.border}
                    style={{ marginRight: 2 }}
                />
            );
        }
        return stars;
    };

    const isOnline = tutor.teachingMode === 1 || tutor.teachingMode === 2;

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.9}
            accessibilityRole="button"
        >
            <View style={styles.topSection}>
                <View style={styles.avatarContainer}>
                    {tutor.photoUrl ? (
                        <Image source={{ uri: tutor.photoUrl }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarInitial}>{tutor.fullName.charAt(0)}</Text>
                        </View>
                    )}
                    {isOnline && <View style={styles.onlineBadge} />}
                </View>

                <View style={styles.mainInfo}>
                    <View style={styles.nameHeader}>
                        <Text style={styles.name} numberOfLines={1}>{tutor.fullName}</Text>
                        <TouchableOpacity onPress={toggleFavorite} style={styles.favBtn}>
                            <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={22} color={isFavorite ? colors.primary : colors.neutrals.textMuted} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.categoryName}>{categoryLabels[tutor.category]}</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.ratingGroup}>
                            <View style={styles.starRow}>{renderStars(tutor.averageRating)}</View>
                            <Text style={styles.revCount}>{tutor.reviewCount} reviews</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.priceTag}>
                    <Text style={styles.priceValue}>£{tutor.pricePerHour}</Text>
                    <Text style={styles.priceUnit}>/hr</Text>
                </View>
            </View>

            <View style={styles.footerDetails}>
                <View style={styles.tagsRow}>
                    {tutor.hasDbs && (
                        <View style={[styles.statusTag, { backgroundColor: '#cdfbd4' }]}>
                            <Ionicons name="shield-checkmark" size={10} color="#065f46" />
                            <Text style={[styles.tagText, { color: '#065f46' }]}>DBS</Text>
                        </View>
                    )}
                    <View style={styles.statusTag}>
                        <Ionicons name="time-outline" size={10} color={colors.primaryDark} />
                        <Text style={[styles.tagText, { color: colors.primaryDark }]}>{tutor.nextAvailableText || 'Next week'}</Text>
                    </View>
                </View>

                <View style={styles.footerRight}>
                    {tutor.distanceMiles > 0 && <Text style={styles.milesText}>{tutor.distanceMiles.toFixed(1)} mi</Text>}
                    <Ionicons name="chevron-forward" size={16} color={colors.neutrals.textMuted} />
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.neutrals.surface,
        borderRadius: 24,
        marginHorizontal: spacing.md,
        marginBottom: spacing.lg,
        ...shadows.sm,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
    },
    topSection: {
        flexDirection: 'row',
        padding: spacing.lg,
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: spacing.lg,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 16,
    },
    avatarPlaceholder: {
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitial: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.primary,
    },
    onlineBadge: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: colors.success,
        borderWidth: 2,
        borderColor: '#fff',
    },
    mainInfo: {
        flex: 1,
        gap: 2,
    },
    nameHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.neutrals.textPrimary,
        flex: 1,
    },
    favBtn: {
        padding: 4,
    },
    categoryName: {
        fontSize: 13,
        color: colors.primaryDark,
        fontWeight: '600',
    },
    statsRow: {
        marginTop: 4,
    },
    ratingGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    starRow: {
        flexDirection: 'row',
    },
    revCount: {
        fontSize: 12,
        color: colors.neutrals.textMuted,
    },
    priceTag: {
        alignItems: 'flex-end',
        marginLeft: spacing.md,
    },
    priceValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.neutrals.textPrimary,
    },
    priceUnit: {
        fontSize: 12,
        color: colors.neutrals.textMuted,
    },
    footerDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: colors.neutrals.cardBorder,
        backgroundColor: colors.neutrals.surfaceAlt + '40',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    tagsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    statusTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: colors.primarySoft,
    },
    tagText: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    footerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    milesText: {
        fontSize: 12,
        color: colors.neutrals.textMuted,
        fontWeight: '600',
    },
});
