import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../lib/theme';
import { TutorSearchResult, TeachingMode } from '../types';
import { Button } from './Button';

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
    const badges: string[] = [];
    if (tutor.hasDbsCheck) badges.push('DBS verified');
    if (tutor.badges?.length) badges.push(...tutor.badges);
    if (badges.length === 0) badges.push('Profile verified');

    const subjects = tutor.subjects.slice(0, 4);

    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={onPress}
        >
            <View style={styles.avatarCol}>
                {tutor.photoUrl ? (
                    <Image source={{ uri: tutor.photoUrl }} style={styles.avatar} resizeMode="cover" />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarInitial}>{tutor.fullName.charAt(0)}</Text>
                    </View>
                )}
                <View style={styles.badgeStack}>
                    {badges.slice(0, 2).map((badge) => (
                        <View key={badge} style={styles.badge}>
                            <Text style={styles.badgeText}>{badge}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.infoCol}>
                <View style={styles.titleRow}>
                    <Text style={styles.name}>{tutor.fullName}</Text>
                    <View style={styles.ratingPill}>
                        <Text style={styles.ratingText}>★ {tutor.averageRating.toFixed(1)}</Text>
                        <Text style={styles.reviewCount}>({tutor.reviewCount})</Text>
                    </View>
                </View>

                <View style={styles.subjectRow}>
                    {subjects.map((subject) => (
                        <View key={subject} style={styles.subjectChip}>
                            <Text style={styles.subjectText}>{subject}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.metaRow}>
                    <Text style={styles.metaItem}>{tutor.distanceMiles ? `${tutor.distanceMiles.toFixed(1)} mi away` : 'Distance shown when location is set'}</Text>
                    <Text style={styles.dot}>•</Text>
                    <Text style={styles.metaItem}>{tutor.nextAvailableText || 'Next availability shared after enquiry'}</Text>
                    <Text style={styles.dot}>•</Text>
                    <Text style={styles.metaItem}>{tutor.responseTimeText || 'Typically responds within a day'}</Text>
                </View>

                <View style={styles.modeRow}>
                    <View style={styles.modeTag}>
                        <Text style={styles.modeTagText}>{modeLabel[tutor.teachingMode ?? TeachingMode.Both]}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.ctaCol}>
                <Text style={styles.price}>£{tutor.pricePerHour}</Text>
                <Text style={styles.priceHint}>per hour</Text>
                <View style={styles.ctaButtons}>
                    <Button
                        title="Request booking"
                        onPress={onRequestBooking || onPress || (() => {})}
                        size="md"
                        fullWidth
                    />
                    <Button
                        title="View profile"
                        onPress={onViewProfile || onPress || (() => {})}
                        size="sm"
                        variant="outline"
                        fullWidth
                        style={styles.secondaryBtn}
                    />
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: colors.neutrals.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
        gap: spacing.lg,
        alignItems: 'stretch',
        ...shadows.sm,
        ...Platform.select({
            web: {
                transition: 'all 150ms ease',
                cursor: 'pointer',
            } as any,
        }),
    },
    avatarCol: {
        width: 112,
        alignItems: 'center',
        gap: spacing.sm,
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: borderRadius.lg,
    },
    avatarPlaceholder: {
        width: 96,
        height: 96,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitial: {
        fontSize: typography.fontSize['3xl'],
        fontWeight: typography.fontWeight.heavy,
        color: colors.primary,
    },
    badgeStack: {
        gap: spacing.xs,
        width: '100%',
    },
    badge: {
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        backgroundColor: colors.primarySoft,
        borderRadius: borderRadius.full,
        alignSelf: 'flex-start',
    },
    badgeText: {
        fontSize: typography.fontSize.xs,
        color: colors.primaryDark,
        fontWeight: typography.fontWeight.semibold,
    },
    infoCol: {
        flex: 1,
        gap: spacing.sm,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.sm,
    },
    name: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
        flex: 1,
    },
    ratingPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        backgroundColor: colors.neutrals.surfaceAlt,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
    },
    ratingText: {
        fontWeight: typography.fontWeight.bold,
        color: colors.ratingStars,
        fontSize: typography.fontSize.sm,
    },
    reviewCount: {
        fontSize: typography.fontSize.xs,
        color: colors.neutrals.textSecondary,
        fontWeight: typography.fontWeight.medium,
    },
    subjectRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    subjectChip: {
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.neutrals.surfaceAlt,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.neutrals.cardBorder,
    },
    subjectText: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textPrimary,
        fontWeight: typography.fontWeight.medium,
    },
    metaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: spacing.xs,
    },
    metaItem: {
        fontSize: typography.fontSize.sm,
        color: colors.neutrals.textSecondary,
        fontWeight: typography.fontWeight.medium,
    },
    dot: {
        color: colors.neutrals.textMuted,
    },
    modeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    modeTag: {
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.md,
        backgroundColor: colors.primarySoft,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    modeTagText: {
        fontSize: typography.fontSize.sm,
        color: colors.primaryDark,
        fontWeight: typography.fontWeight.semibold,
    },
    ctaCol: {
        width: 220,
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    price: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.bold,
        color: colors.neutrals.textPrimary,
    },
    priceHint: {
        fontSize: typography.fontSize.xs,
        color: colors.neutrals.textSecondary,
        marginBottom: spacing.sm,
    },
    ctaButtons: {
        width: '100%',
        gap: spacing.sm,
    },
    secondaryBtn: {
        borderWidth: 1.5,
        borderColor: colors.neutrals.cardBorder,
    },
});
